import json
from typing import Optional


class Action:
    """
    Base class for objects that can be returned by :attr:`.SSEClient.all`.
    """

    pass


class Event(Action):
    """
    An event received by :class:`.SSEClient`.

    Instances of this class are returned by both :attr:`.SSEClient.events` and
    :attr:`.SSEClient.all`.
    """

    def __init__(
        self,
        event: str = 'message',
        data: str = '',
        id: Optional[str] = None,
        last_event_id: Optional[str] = None,
    ):
        self._event = event
        self._data = data
        self._id = id
        self._last_event_id = last_event_id

    @property
    def event(self) -> str:
        """
        The event type, or "message" if not specified.
        """
        return self._event

    @property
    def data(self) -> str:
        """
        The event data.
        """
        return self._data

    @property
    def id(self) -> Optional[str]:
        """
        The value of the ``id:`` field for this event, or `None` if omitted.
        """
        return self._id

    @property
    def last_event_id(self) -> Optional[str]:
        """
        The value of the most recent ``id:`` field of an event seen in this stream so far.
        """
        return self._last_event_id

    def __eq__(self, other):
        if not isinstance(other, Event):
            return False
        return (
            self._event == other._event
            and self._data == other._data
            and self._id == other._id
            and self.last_event_id == other.last_event_id
        )

    def __repr__(self):
        return "Event(event=\"%s\", data=%s, id=%s, last_event_id=%s)" % (
            self._event,
            json.dumps(self._data),
            "None" if self._id is None else json.dumps(self._id),
            "None" if self._last_event_id is None else json.dumps(self._last_event_id),
        )


class Comment(Action):
    """
    A comment received by :class:`.SSEClient`.

    Comment lines (any line beginning with a colon) have no significance in the SSE specification
    and can be ignored, but if you want to see them, use :attr:`.SSEClient.all`. They will never
    be returned by :attr:`.SSEClient.events`.
    """

    def __init__(self, comment: str):
        self._comment = comment

    @property
    def comment(self) -> str:
        """
        The comment text, not including the leading colon.
        """
        return self._comment

    def __eq__(self, other):
        return isinstance(other, Comment) and self._comment == other._comment

    def __repr__(self):
        return ":" + self._comment


class Start(Action):
    """
    Indicates that :class:`.SSEClient` has successfully connected to a stream.

    Instances of this class are only available from :attr:`.SSEClient.all`.
    A ``Start`` is returned for the first successful connection. If the client reconnects
    after a failure, there will be a :class:`.Fault` followed by a ``Start``.
    """

    pass


class Fault(Action):
    """
    Indicates that :class:`.SSEClient` encountered an error or end of stream.

    Instances of this class are only available from :attr:`.SSEClient.all`.

    If you receive a Fault, the SSEClient is now in an inactive state since either a
    connection attempt has failed or an existing connection has been closed. The SSEClient
    will attempt to reconnect if you either call :meth:`.SSEClient.start()`
    or simply continue reading events after this point.
    """

    def __init__(self, error: Optional[Exception]):
        self.__error = error

    @property
    def error(self) -> Optional[Exception]:
        """
        The exception that caused the stream to fail, if any. If this is ``None``, it means
        that the stream simply ran out of data, i.e. the server shut down the connection
        in an orderly way after sending an EOF chunk as defined by chunked transfer encoding.
        """
        return self.__error
