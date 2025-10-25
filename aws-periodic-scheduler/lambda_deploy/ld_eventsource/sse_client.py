import logging
import time
from typing import Iterable, Optional, Union

from ld_eventsource.actions import *
from ld_eventsource.config import *
from ld_eventsource.errors import *
from ld_eventsource.reader import _BufferedLineReader, _SSEReader


class SSEClient:
    """
    A client for reading a Server-Sent Events stream.

    This is a synchronous implementation which blocks the caller's thread when reading events or
    reconnecting. It can be run on a worker thread. The expected usage is to create an ``SSEClient``
    instance, then read from it using the iterator properties :attr:`events` or :attr:`all`.

    By default, ``SSEClient`` uses ``urllib3`` to make HTTP requests to an SSE endpoint. You can
    customize this behavior using :class:`.ConnectStrategy`.

    Connection failures and error responses can be handled in various ways depending on the
    constructor parameters. The default behavior, if no non-default parameters are passed, is
    that the client will attempt to reconnect as many times as necessary if a connection is
    dropped or cannot be made; but if a connection is made and returns an invalid response
    (non-2xx status, 204 status, or invalid content type), it will not retry. This behavior can
    be customized with ``error_strategy``. The client will automatically follow 3xx redirects.

    For any non-retryable error, if this is the first connection attempt then the constructor
    will throw an exception (such as :class:`.HTTPStatusError`). Or, if a
    successful connection was made so the constructor has already returned, but a
    non-retryable error occurs subsequently, the iterator properties will simply run out of
    values to indicate that the ``SSEClient`` is finished (if you are reading :attr:`all`, it will
    first yield a :class:`.Fault` to indicate what the error was).

    To avoid flooding the server with requests, it is desirable to have a delay before each
    reconnection. There is a base delay set by ``initial_retry_delay`` (which can be overridden
    by the stream if the server sends a ``retry:`` line). By default, as defined by
    :meth:`.RetryDelayStrategy.default()`, this delay will double with each subsequent retry,
    and will also have a pseudo-random jitter subtracted. You can customize this behavior with
    ``retry_delay_strategy``.
    """

    def __init__(
        self,
        connect: Union[str, ConnectStrategy],
        initial_retry_delay: float = 1,
        retry_delay_strategy: Optional[RetryDelayStrategy] = None,
        retry_delay_reset_threshold: float = 60,
        error_strategy: Optional[ErrorStrategy] = None,
        last_event_id: Optional[str] = None,
        logger: Optional[logging.Logger] = None,
    ):
        """
        Creates a client instance.

        The client is created in an inactive state. It will not try to make a stream connection
        until either you call :meth:`start()`, or you attempt to read events from
        :attr:`events` or :attr:`all`.

        For the default HTTP behavior, you may pass a URL string for ``connect``; this is
        equivalent to ``connect=ConnectStrategy.http(url)``. To set custom HTTP options, call
        :meth:`.ConnectStrategy.http()` directly:
        ::

            sse_client = SSEClient(
                connect=ConnectStrategy.http(
                    url="https://my-sse-server.com",
                    headers={"Authorization": "abcdef"}
                )
            )

        Or, you may provide your own :class:`.ConnectStrategy` implementation to make SSEClient
        read from another source.

        :param connect: either a :class:`.ConnectStrategy` instance or a URL string
        :param initial_retry_delay: the initial delay before reconnecting after a failure,
            in seconds; this can increase as described in :class:`SSEClient`
        :param retry_delay_strategy: allows customization of the delay behavior for retries; if
            not specified, uses :meth:`.RetryDelayStrategy.default()`
        :param retry_delay_reset_threshold: the minimum amount of time that a connection must
            stay open before the SSEClient resets its retry delay strategy
        :param error_strategy: allows customization of the behavior after a stream failure; if
            not specified: uses :meth:`.ErrorStrategy.always_fail()`
        :param last_event_id: if provided, the ``Last-Event-Id`` value will be preset to this
        :param logger: if provided, log messages will be written here
        """
        if isinstance(connect, str):
            connect = ConnectStrategy.http(connect)
        elif not isinstance(connect, ConnectStrategy):
            raise TypeError("request must be either a string or ConnectStrategy")

        self.__base_retry_delay = initial_retry_delay
        self.__base_retry_delay_strategy = (
            retry_delay_strategy or RetryDelayStrategy.default()
        )
        self.__retry_delay_reset_threshold = retry_delay_reset_threshold
        self.__current_retry_delay_strategy = self.__base_retry_delay_strategy
        self.__next_retry_delay = 0

        self.__base_error_strategy = error_strategy or ErrorStrategy.always_fail()
        self.__current_error_strategy = self.__base_error_strategy

        self.__last_event_id = last_event_id

        if logger is None:
            logger = logging.getLogger('launchdarkly-eventsource.null')
            logger.addHandler(logging.NullHandler())
            logger.propagate = False
        self.__logger = logger

        self.__connection_client = connect.create_client(logger)
        self.__connection_result: Optional[ConnectionResult] = None
        self._retry_reset_baseline: float = 0
        self.__disconnected_time: float = 0

        self.__closed = False
        self.__interrupted = False

    def start(self):
        """
        Attempts to start the stream if it is not already active.

        If there is not an active stream connection, this method attempts to start one using
        the previously configured parameters. If successful, it returns and you can proceed
        to read events. You should only read events on the same thread where you called
        :meth:`start()`.

        If the connection fails, the behavior depends on the configured :class:`.ErrorStrategy`.
        The default strategy is to raise an exception, but you can configure it to continue
        instead, in which case :meth:`start()` will keep retrying until the :class:`.ErrorStrategy`
        says to give up.

        If the stream was previously active and then failed, :meth:`start()` will sleep for
        some amount of time-- the retry delay-- before trying to make the connection. The
        retry delay is determined by the ``initial_retry_delay``, ``retry_delay_strategy``,
        and ``retry_delay_reset_threshold`` parameters to :class:`SSEClient`.
        """
        self._try_start(False)

    def close(self):
        """
        Permanently shuts down this client instance and closes any active connection.
        """
        self.__closed = True
        self.interrupt()

    def interrupt(self):
        """
        Stops the stream connection if it is currently active.

        The difference between this method and :meth:`close()` is that this method does not
        permanently shut down the :class:`SSEClient`. If you try to read more events or call
        :meth:`start()`, the client will try to reconnect to the stream. The behavior is
        exactly the same as if the previous stream had been ended by the server.
        """
        if self.__connection_result:
            self.__interrupted = True
            self.__connection_result.close()
            self.__connection_result = None
            self._compute_next_retry_delay()

    @property
    def all(self) -> Iterable[Action]:
        """
        An iterable series of notifications from the stream.

        Each of these can be any subclass of :class:`.Action`: :class:`.Event`, :class:`.Comment`,
        :class:`.Start`, or :class:`.Fault`.

        You can use :attr:`events` instead if you are only interested in Events.

        Iterating over this property automatically starts or restarts the stream if it is not
        already active, so you do not need to call :meth:`start()` unless you want to verify that
        the stream is connected before trying to read events.
        """
        while True:
            # Reading implies starting the stream if it isn't already started. We might also
            # be restarting since we could have been interrupted at any time.
            while self.__connection_result is None:
                fault = self._try_start(True)
                # return either a Start action or a Fault action
                yield Start() if fault is None else fault

            lines = _BufferedLineReader.lines_from(self.__connection_result.stream)
            reader = _SSEReader(lines, self.__last_event_id, None)
            error: Optional[Exception] = None
            try:
                for ec in reader.events_and_comments:
                    yield ec
                    if self.__interrupted:
                        break
                # If we finished iterating all of reader.events_and_comments, it means the stream
                # was closed without an error.
                self.__connection_result = None
            except Exception as e:
                if self.__closed:
                    # It's normal to get an I/O error if we force-closed the stream to shut down
                    return
                error = e
                self.__connection_result = None
            finally:
                self.__last_event_id = reader.last_event_id

            # We've hit an error, so ask the ErrorStrategy what to do: raise an exception or yield a Fault.
            self._compute_next_retry_delay()
            fail_or_continue, self.__current_error_strategy = (
                self.__current_error_strategy.apply(error)
            )
            if fail_or_continue == ErrorStrategy.FAIL:
                if error is None:
                    # If error is None, the stream was ended normally by the server. Just stop iterating.
                    yield Fault(
                        None
                    )  # this is only visible if you're reading from "all"
                    return
                raise error
            yield Fault(error)
            continue  # try to connect again

    @property
    def events(self) -> Iterable[Event]:
        """
        An iterable series of :class:`.Event` objects received from the stream.

        Use :attr:`all` instead if you also want to know about other kinds of occurrences.

        Iterating over this property automatically starts or restarts the stream if it is not
        already active, so you do not need to call :meth:`start()` unless you want to verify that
        the stream is connected before trying to read events.
        """
        for item in self.all:
            if isinstance(item, Event):
                yield item

    @property
    def next_retry_delay(self) -> float:
        """
        The retry delay that will be used for the next reconnection, in seconds, if the stream
        has failed or ended.

        This is initially zero, because SSEClient does not compute a retry delay until there is
        a failure. If you have just received an exception or a :class:`.Fault`, or if you were
        iterating through events and the events ran out because the stream closed, the value
        tells you how long SSEClient will sleep before the next reconnection attempt. The value
        is computed by applying the configured :class:`.RetryDelayStrategy` to the base retry delay.
        """
        return self.__next_retry_delay

    def _compute_next_retry_delay(self):
        # If the __retry_reset_baseline is 0, then we haven't successfully connected yet.
        #
        # In those situations, we don't want to reset the retry delay strategy;
        # it should continue to double until the retry maximum, and then hold
        # steady (- jitter).
        if self.__retry_delay_reset_threshold > 0 and self._retry_reset_baseline != 0:
            now = time.time()
            connection_duration = now - self._retry_reset_baseline
            if connection_duration >= self.__retry_delay_reset_threshold:
                self.__current_retry_delay_strategy = self.__base_retry_delay_strategy
                self._retry_reset_baseline = now
        self.__next_retry_delay, self.__current_retry_delay_strategy = (
            self.__current_retry_delay_strategy.apply(self.__base_retry_delay)
        )

    def _try_start(self, can_return_fault: bool) -> Optional[Fault]:
        if self.__connection_result is not None:
            return None
        while True:
            if self.__next_retry_delay > 0:
                delay = (
                    self.__next_retry_delay
                    if self.__disconnected_time == 0
                    else self.__next_retry_delay
                    - (time.time() - self.__disconnected_time)
                )
                if delay > 0:
                    self.__logger.info("Will reconnect after delay of %fs" % delay)
                    time.sleep(delay)
            try:
                self.__connection_result = self.__connection_client.connect(
                    self.__last_event_id
                )
            except Exception as e:
                self.__disconnected_time = time.time()
                self._compute_next_retry_delay()
                fail_or_continue, self.__current_error_strategy = (
                    self.__current_error_strategy.apply(e)
                )
                if fail_or_continue == ErrorStrategy.FAIL:
                    raise e
                if can_return_fault:
                    return Fault(e)
                # If can_return_fault is false, it means the caller explicitly called start(), in
                # which case there's no way to return a Fault so we just keep retrying transparently.
                continue
            self._retry_reset_baseline = time.time()
            self.__current_error_strategy = self.__base_error_strategy
            self.__interrupted = False
            return None

    @property
    def last_event_id(self) -> Optional[str]:
        """
        The ID value, if any, of the last known event.

        This can be set initially with the ``last_event_id`` parameter to :class:`SSEClient`,
        and is updated whenever an event is received that has an ID. Whether event IDs are supported
        depends on the server; it may ignore this value.
        """
        return self.__last_event_id

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        self.close()


__all__ = ['SSEClient']
