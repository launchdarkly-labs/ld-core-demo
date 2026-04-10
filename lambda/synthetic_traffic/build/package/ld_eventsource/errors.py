from typing import Any, Dict, Optional, Protocol, runtime_checkable


@runtime_checkable
class ExceptionWithHeaders(Protocol):
    """
    Protocol for exceptions that include HTTP response headers.

    This allows type-safe access to headers from error responses without
    using hasattr checks.
    """

    @property
    def headers(self) -> Optional[Dict[str, Any]]:
        """The HTTP response headers associated with this exception."""
        raise NotImplementedError


class HTTPStatusError(Exception):
    """
    This exception indicates that the client was able to connect to the server, but that
    the HTTP response had an error status.

    When available, the response headers are accessible via the :attr:`headers` property.
    """

    def __init__(self, status: int, headers: Optional[Dict[str, Any]] = None):
        super().__init__("HTTP error %d" % status)
        self._status = status
        self._headers = headers

    @property
    def status(self) -> int:
        return self._status

    @property
    def headers(self) -> Optional[Dict[str, Any]]:
        """The HTTP response headers, if available."""
        return self._headers


class HTTPContentTypeError(Exception):
    """
    This exception indicates that the HTTP response did not have the expected content
    type of `"text/event-stream"`.

    When available, the response headers are accessible via the :attr:`headers` property.
    """

    def __init__(self, content_type: str, headers: Optional[Dict[str, Any]] = None):
        super().__init__("invalid content type \"%s\"" % content_type)
        self._content_type = content_type
        self._headers = headers

    @property
    def content_type(self) -> str:
        return self._content_type

    @property
    def headers(self) -> Optional[Dict[str, Any]]:
        """The HTTP response headers, if available."""
        return self._headers
