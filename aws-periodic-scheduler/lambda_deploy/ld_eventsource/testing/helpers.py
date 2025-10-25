from __future__ import annotations

from logging import Logger
from typing import Iterable, Iterator, List, Optional

from ld_eventsource import *
from ld_eventsource.config import *
from ld_eventsource.errors import *
from ld_eventsource.testing.http_util import *


def make_stream() -> ChunkedResponse:
    return ChunkedResponse({'Content-Type': 'text/event-stream'})


def retry_for_status(status: int) -> ErrorStrategy:
    return ErrorStrategy.from_lambda(
        lambda error: (
            (
                ErrorStrategy.CONTINUE
                if isinstance(error, HTTPStatusError) and error.status == status
                else ErrorStrategy.FAIL
            ),
            None,
        )
    )


def no_delay() -> RetryDelayStrategy:
    return RetryDelayStrategy.from_lambda(lambda _: (0, None))


class MockConnectStrategy(ConnectStrategy):
    def __init__(self, *request_handlers: MockConnectionHandler):
        self.__handlers = list(request_handlers)

    def create_client(self, logger: Logger) -> ConnectionClient:
        return MockConnectionClient(self.__handlers)


class MockConnectionClient(ConnectionClient):
    def __init__(self, handlers: List[MockConnectionHandler]):
        self.__handlers = handlers
        self.__request_count = 0

    def connect(self, last_event_id: Optional[str]) -> ConnectionResult:
        handler = self.__handlers[self.__request_count]
        if self.__request_count < len(self.__handlers) - 1:
            self.__request_count += 1
        return handler.apply()


class MockConnectionHandler:
    def apply(self) -> ConnectionResult:
        raise NotImplementedError(
            "MockConnectionHandler base class cannot be used by itself"
        )


class RejectConnection(MockConnectionHandler):
    def __init__(self, error: Exception):
        self.__error = error

    def apply(self) -> ConnectionResult:
        raise self.__error


class RespondWithStream(MockConnectionHandler):
    def __init__(self, stream: Iterable[bytes]):
        self.__stream = stream

    def apply(self) -> ConnectionResult:
        return ConnectionResult(stream=self.__stream.__iter__(), closer=None)


class RespondWithData(RespondWithStream):
    def __init__(self, data: str):
        super().__init__([bytes(data, 'utf-8')])


class ExpectNoMoreRequests(MockConnectionHandler):
    def apply(self) -> ConnectionResult:
        assert False, "SSEClient should not have made another request"
