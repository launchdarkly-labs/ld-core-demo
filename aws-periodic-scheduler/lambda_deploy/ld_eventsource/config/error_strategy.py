from __future__ import annotations

import time
from typing import Callable, Optional, Tuple


class ErrorStrategy:
    """
    Base class of strategies for determining how SSEClient should handle a stream error or the
    end of a stream.

    The parameter that SSEClient passes to :meth:`apply()` is either ``None`` if the server ended
    the stream normally, or an exception. If it is an exception, it could be an I/O exception
    (failure to connect, broken connection, etc.), or one of the error types defined in this
    package such as :class:`.HTTPStatusError`.

    The two options for the result are:

    * :const:`FAIL`: This means that SSEClient should throw an exception to the caller-- or, in
      the case of a stream ending without an error, it should simply stop iterating through events.
    * :const:`CONTINUE`: This means that you intend to keep reading events, so SSEClient should
      transparently retry the connection. If you are reading from :attr:`.SSEClient.all`,
      you will also receive a :class:`.Fault` describing the error.

    With either option, it is still always possible to explicitly reconnect the stream by calling
    :meth:`.SSEClient.start()` again, or simply by trying to read from :attr:`.SSEClient.events`
    or :attr:`.SSEClient.all` again.

    Subclasses should be immutable. To implement strategies that behave differently on consecutive
    retries, the strategy should return a new instance of its own class as the second return value
    from ``apply``, rather than modifying the state of the existing instance. This makes it easy
    for SSEClient to reset to the original error-handling state when appropriate by simply reusing
    the original instance.
    """

    FAIL = True
    CONTINUE = False

    def apply(self, exception: Optional[Exception]) -> Tuple[bool, ErrorStrategy]:
        """Applies the strategy to determine what to do after a failure.

        :param exception: an exception, or ``None`` if the stream simply ended
        :return: a tuple where the first element is either :const:`FAIL` to raise an exception
            or :const:`CONTINUE` to continue, and the second element is the strategy object to
            use next time (which could be ``self``)
        """
        raise NotImplementedError("ErrorStrategy base class cannot be used by itself")

    @staticmethod
    def always_fail() -> ErrorStrategy:
        """
        Specifies that SSEClient should always treat an error as a stream failure. This is the
        default behavior if you do not configure another.
        """
        return _LambdaErrorStrategy(lambda e: (ErrorStrategy.FAIL, None))

    @staticmethod
    def always_continue() -> ErrorStrategy:
        """
        Specifies that SSEClient should never raise an exception, but should transparently retry
        or, if :attr:`.SSEClient.all` is being used, return the error as a :class:`.Fault`.

        Be aware that using this mode could cause connection attempts to block indefinitely if
        the server is unavailable.
        """
        return _LambdaErrorStrategy(lambda e: (ErrorStrategy.CONTINUE, None))

    @staticmethod
    def continue_with_max_attempts(max_attempts: int) -> ErrorStrategy:
        """
        Specifies that SSEClient should automatically retry after an error for up to this
        number of consecutive attempts, but should fail after that point.

        :param max_attempts: the maximum number of consecutive retries
        """
        return _MaxAttemptsErrorStrategy(max_attempts, 0)

    @staticmethod
    def continue_with_time_limit(max_time: float) -> ErrorStrategy:
        """
        Specifies that SSEClient should automatically retry after a failure and can retry
        repeatedly until this amount of time has elapsed, but should fail after that point.

        :param max_time: the time limit, in seconds
        """
        return _TimeLimitErrorStrategy(max_time, 0)

    @staticmethod
    def from_lambda(
        fn: Callable[[Optional[Exception]], Tuple[bool, Optional[ErrorStrategy]]]
    ) -> ErrorStrategy:
        """
        Convenience method for creating an ErrorStrategy whose ``apply`` method is equivalent to
        the given lambda.

        The one difference is that the second return value is an ``Optional[ErrorStrategy]`` which
        can be None to mean "no change", since the lambda cannot reference the strategy's ``self``.
        """
        return _LambdaErrorStrategy(fn)


class _LambdaErrorStrategy(ErrorStrategy):
    def __init__(
        self, fn: Callable[[Optional[Exception]], Tuple[bool, Optional[ErrorStrategy]]]
    ):
        self.__fn = fn

    def apply(self, exception: Optional[Exception]) -> Tuple[bool, ErrorStrategy]:
        should_raise, maybe_next = self.__fn(exception)
        return (should_raise, maybe_next or self)


class _MaxAttemptsErrorStrategy(ErrorStrategy):
    def __init__(self, max_attempts: int, counter: int):
        self.__max_attempts = max_attempts
        self.__counter = counter

    def apply(self, exception: Optional[Exception]) -> Tuple[bool, ErrorStrategy]:
        if self.__counter >= self.__max_attempts:
            return (ErrorStrategy.FAIL, self)
        return (
            ErrorStrategy.CONTINUE,
            _MaxAttemptsErrorStrategy(self.__max_attempts, self.__counter + 1),
        )


class _TimeLimitErrorStrategy(ErrorStrategy):
    def __init__(self, max_time: float, start_time: float):
        self.__max_time = max_time
        self.__start_time = start_time

    def apply(self, exception: Optional[Exception]) -> Tuple[bool, ErrorStrategy]:
        if self.__start_time == 0:
            return (
                ErrorStrategy.CONTINUE,
                _TimeLimitErrorStrategy(self.__max_time, time.time()),
            )
        if (time.time() - self.__start_time) < self.__max_time:
            return (ErrorStrategy.CONTINUE, self)
        return (ErrorStrategy.FAIL, self)


__all__ = ['ErrorStrategy']
