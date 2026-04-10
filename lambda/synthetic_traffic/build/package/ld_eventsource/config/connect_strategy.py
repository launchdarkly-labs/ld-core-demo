from __future__ import annotations

from dataclasses import dataclass
from logging import Logger
from typing import Any, Callable, Dict, Iterator, Optional, Union

from urllib3 import PoolManager

from ld_eventsource.http import (DynamicQueryParams, _HttpClientImpl,
                                 _HttpConnectParams)


class ConnectStrategy:
    """
    An abstraction for how :class:`.SSEClient` should obtain an input stream.

    The default implementation is :meth:`http()`, which makes HTTP requests with ``urllib3``.
    Or, if you want to consume an input stream from some other source, you can create your own
    subclass of :class:`ConnectStrategy`.

    Instances of this class should be immutable and should not contain any state that is specific
    to one active stream. The :class:`ConnectionClient` that they produce is stateful and belongs
    to a single :class:`.SSEClient`.
    """

    def create_client(self, logger: Logger) -> ConnectionClient:
        """
        Creates a client instance.

        This is called once when an :class:`.SSEClient` is created. The SSEClient returns the
        returned :class:`ConnectionClient` and uses it to perform all subsequent connection attempts.

        :param logger: the logger being used by the SSEClient
        """
        raise NotImplementedError("ConnectStrategy base class cannot be used by itself")

    @staticmethod
    def http(
        url: str,
        headers: Optional[dict] = None,
        pool: Optional[PoolManager] = None,
        urllib3_request_options: Optional[dict] = None,
        query_params: Optional[DynamicQueryParams] = None
    ) -> ConnectStrategy:
        """
        Creates the default HTTP implementation, specifying request parameters.

        :param url: the stream URL
        :param headers: optional HTTP headers to add to the request
        :param pool: optional urllib3 ``PoolManager`` to provide an HTTP client
        :param urllib3_request_options: optional ``kwargs`` to add to the ``request`` call; these
            can include any parameters supported by ``urllib3``, such as ``timeout``
        :param query_params: optional callable that can be used to affect query parameters
            dynamically for each connection attempt
        """
        return _HttpConnectStrategy(
            _HttpConnectParams(url, headers, pool, urllib3_request_options, query_params)
        )


class ConnectionClient:
    """
    An object provided by :class:`.ConnectStrategy` that is retained by a single
    :class:`.SSEClient` to perform all connection attempts by that instance.

    For the default HTTP implementation, this represents an HTTP connection pool.
    """

    def connect(self, last_event_id: Optional[str]) -> ConnectionResult:
        """
        Attempts to connect to a stream. Raises an exception if unsuccessful.

        :param last_event_id: the current value of :attr:`SSEClient.last_event_id`
            (should be sent to the server to support resuming an interrupted stream)
        :return: a :class:`ConnectionResult` representing the stream
        """
        raise NotImplementedError(
            "ConnectionClient base class cannot be used by itself"
        )

    def close(self):
        """
        Does whatever is necessary to release resources when the SSEClient is closed.
        """
        pass

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        self.close()


class ConnectionResult:
    """
    The return type of :meth:`ConnectionClient.connect()`.
    """

    def __init__(self, stream: Iterator[bytes], closer: Optional[Callable], headers: Optional[Dict[str, Any]] = None):
        self.__stream = stream
        self.__closer = closer
        self.__headers = headers

    @property
    def stream(self) -> Iterator[bytes]:
        """
        An iterator that returns chunks of data.
        """
        return self.__stream

    @property
    def headers(self) -> Optional[Dict[str, Any]]:
        """
        The HTTP response headers, if available.

        For HTTP connections, this contains the headers from the SSE stream response.
        For non-HTTP connections, this will be ``None``.

        The headers dict uses case-insensitive keys (via urllib3's HTTPHeaderDict).
        """
        return self.__headers

    def close(self):
        """
        Does whatever is necessary to release the connection.
        """
        if self.__closer:
            self.__closer()
            self.__closer = None

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        self.close()


# _HttpConnectStrategy and _HttpConnectionClient are defined here rather than in http.py to avoid
# a circular module reference.


class _HttpConnectStrategy(ConnectStrategy):
    def __init__(self, params: _HttpConnectParams):
        self.__params = params

    def create_client(self, logger: Logger) -> ConnectionClient:
        return _HttpConnectionClient(self.__params, logger)


class _HttpConnectionClient(ConnectionClient):
    def __init__(self, params: _HttpConnectParams, logger: Logger):
        self.__impl = _HttpClientImpl(params, logger)

    def connect(self, last_event_id: Optional[str]) -> ConnectionResult:
        stream, closer, headers = self.__impl.connect(last_event_id)
        return ConnectionResult(stream, closer, headers)

    def close(self):
        self.__impl.close()


__all__ = ['ConnectStrategy', 'ConnectionClient', 'ConnectionResult']
