class HTTPStatusError(Exception):
    """
    This exception indicates that the client was able to connect to the server, but that
    the HTTP response had an error status.
    """

    def __init__(self, status: int):
        super().__init__("HTTP error %d" % status)
        self._status = status

    @property
    def status(self) -> int:
        return self._status


class HTTPContentTypeError(Exception):
    """
    This exception indicates that the HTTP response did not have the expected content
    type of `"text/event-stream"`.
    """

    def __init__(self, content_type: str):
        super().__init__("invalid content type \"%s\"" % content_type)
        self._content_type = content_type

    @property
    def content_type(self) -> str:
        return self._content_type
