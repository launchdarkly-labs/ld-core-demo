import pytest

from ld_eventsource import *
from ld_eventsource.actions import *
from ld_eventsource.config import *
from ld_eventsource.testing.helpers import *

# Tests for SSEClient's basic properties and parsing behavior. These tests do not use real HTTP
# requests; instead, they use a ConnectStrategy that provides a preconfigured input stream. HTTP
# functionality is tested separately in test_http_connect_strategy.py and
# test_http_connect_strategy_with_sse_client.py.


@pytest.mark.parametrize('explicitly_start', [False, True])
def test_receives_events(explicitly_start: bool):
    mock = MockConnectStrategy(
        RespondWithData(
            "event: event1\ndata: data1\n\n:whatever\nevent: event2\ndata: data2\n\n"
        )
    )
    with SSEClient(connect=mock) as client:
        if explicitly_start:
            client.start()  # shouldn't make a difference if we're just reading events

        events = client.events

        event1 = next(events)
        assert event1.event == 'event1'
        assert event1.data == 'data1'

        event2 = next(events)
        assert event2.event == 'event2'
        assert event2.data == 'data2'


def test_events_returns_eof_when_stream_ends():
    mock = MockConnectStrategy(RespondWithData("event: event1\ndata: data1\n\n"))
    with SSEClient(connect=mock) as client:
        events = client.events

        event1 = next(events)
        assert event1.event == 'event1'
        assert event1.data == 'data1'

        event2 = next(events, "done")
        assert event2 == "done"


def test_receives_all():
    mock = MockConnectStrategy(
        RespondWithData(
            "event: event1\ndata: data1\n\n:whatever\nevent: event2\ndata: data2\n\n"
        )
    )
    with SSEClient(connect=mock) as client:
        all = client.all

        item1 = next(all)
        assert isinstance(item1, Start)

        item2 = next(all)
        assert isinstance(item2, Event)
        assert item2.event == 'event1'
        assert item2.data == 'data1'

        item3 = next(all)
        assert isinstance(item3, Comment)
        assert item3.comment == 'whatever'

        item4 = next(all)
        assert isinstance(item4, Event)
        assert item4.event == 'event2'
        assert item4.data == 'data2'


def test_all_returns_fault_and_eof_when_stream_ends():
    mock = MockConnectStrategy(RespondWithData("event: event1\ndata: data1\n\n"))
    with SSEClient(connect=mock) as client:
        all = client.all

        item1 = next(all)
        assert isinstance(item1, Start)

        item2 = next(all)
        assert isinstance(item2, Event)
        assert item2.event == 'event1'
        assert item2.data == 'data1'

        item3 = next(all)
        assert isinstance(item3, Fault)
        assert item3.error is None

        item4 = next(all, 'done')
        assert item4 == 'done'
