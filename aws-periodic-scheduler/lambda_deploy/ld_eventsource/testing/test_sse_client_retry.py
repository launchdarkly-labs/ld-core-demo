from time import sleep

from ld_eventsource import *
from ld_eventsource.actions import *
from ld_eventsource.config import *
from ld_eventsource.testing.helpers import *


def test_retry_during_initial_connect_succeeds():
    mock = MockConnectStrategy(
        RejectConnection(HTTPStatusError(503)),
        RespondWithData("data: data1\n\n"),
        ExpectNoMoreRequests(),
    )
    with SSEClient(
        connect=mock,
        retry_delay_strategy=no_delay(),
        error_strategy=retry_for_status(503),
    ) as client:
        client.start()

        events = client.events
        event1 = next(events)
        assert event1.data == 'data1'


def test_retry_during_initial_connect_succeeds_then_fails():
    mock = MockConnectStrategy(
        RejectConnection(HTTPStatusError(503)),
        RejectConnection(HTTPStatusError(400)),
        ExpectNoMoreRequests(),
    )
    try:
        with SSEClient(
            connect=mock,
            retry_delay_strategy=no_delay(),
            error_strategy=retry_for_status(503),
        ) as client:
            client.start()
        raise Exception("expected exception, did not get one")
    except HTTPStatusError as e:
        assert e.status == 400


def test_events_iterator_continues_after_retry():
    mock = MockConnectStrategy(
        RespondWithData("data: data1\n\n"),
        RespondWithData("data: data2\n\n"),
        ExpectNoMoreRequests(),
    )
    with SSEClient(
        connect=mock,
        error_strategy=ErrorStrategy.always_continue(),
        retry_delay_strategy=no_delay(),
    ) as client:
        events = client.events

        event1 = next(events)
        assert event1.data == 'data1'

        event2 = next(events)
        assert event2.data == 'data2'


def test_all_iterator_continues_after_retry():
    initial_delay = 0.005
    mock = MockConnectStrategy(
        RespondWithData("data: data1\n\n"),
        RespondWithData("data: data2\n\n"),
        RespondWithData("data: data3\n\n"),
        ExpectNoMoreRequests(),
    )
    with SSEClient(
        connect=mock,
        error_strategy=ErrorStrategy.always_continue(),
        initial_retry_delay=initial_delay,
        retry_delay_strategy=RetryDelayStrategy.default(jitter_multiplier=None),
    ) as client:
        all = client.all

        item1 = next(all)
        assert isinstance(item1, Start)

        item2 = next(all)
        assert isinstance(item2, Event)
        assert item2.data == 'data1'

        item3 = next(all)
        assert isinstance(item3, Fault)
        assert item3.error is None
        assert client.next_retry_delay == initial_delay

        item4 = next(all)
        assert isinstance(item4, Start)

        item5 = next(all)
        assert isinstance(item5, Event)
        assert item5.data == 'data2'

        item6 = next(all)
        assert isinstance(item6, Fault)
        assert item6.error is None
        assert client.next_retry_delay == initial_delay * 2


def test_retry_delay_gets_reset_after_threshold():
    initial_delay = 0.005
    retry_delay_reset_threshold = 0.1
    mock = MockConnectStrategy(
        RespondWithData("data: data1\n\n"),
        RejectConnection(HTTPStatusError(503)),
    )
    with SSEClient(
        connect=mock,
        error_strategy=ErrorStrategy.always_continue(),
        initial_retry_delay=initial_delay,
        retry_delay_reset_threshold=retry_delay_reset_threshold,
        retry_delay_strategy=RetryDelayStrategy.default(jitter_multiplier=None),
    ) as client:
        assert client._retry_reset_baseline == 0
        all = client.all

        # Establish a successful connection
        item1 = next(all)
        assert isinstance(item1, Start)
        assert client._retry_reset_baseline != 0

        item2 = next(all)
        assert isinstance(item2, Event)
        assert item2.data == 'data1'

        # Stream is dropped and then fails to re-connect, resulting in backoff.
        item3 = next(all)
        assert isinstance(item3, Fault)
        assert client.next_retry_delay == initial_delay

        item4 = next(all)
        assert isinstance(item4, Fault)
        assert client.next_retry_delay == initial_delay * 2

        # Sleeping the threshold should reset the retry thresholds
        sleep(retry_delay_reset_threshold)

        # Which we see it does here
        item5 = next(all)
        assert isinstance(item5, Fault)
        assert client.next_retry_delay == initial_delay

        # And if we don't sleep long enough, it doesn't get reset.
        sleep(retry_delay_reset_threshold / 2)

        item6 = next(all)
        assert isinstance(item6, Fault)
        assert client.next_retry_delay == initial_delay * 2


def test_can_interrupt_and_restart_stream():
    initial_delay = 0.005
    mock = MockConnectStrategy(
        RespondWithData("data: data1\n\ndata: data2\n\n"),
        RespondWithData("data: data3\n\n"),
        ExpectNoMoreRequests(),
    )
    with SSEClient(
        connect=mock,
        error_strategy=ErrorStrategy.always_continue(),
        initial_retry_delay=initial_delay,
        retry_delay_strategy=RetryDelayStrategy.default(jitter_multiplier=None),
    ) as client:
        all = client.all

        item1 = next(all)
        assert isinstance(item1, Start)

        item2 = next(all)
        assert isinstance(item2, Event)
        assert item2.data == 'data1'

        client.interrupt()
        assert client.next_retry_delay == initial_delay

        item3 = next(all)
        assert isinstance(item3, Fault)

        item4 = next(all)
        assert isinstance(item4, Start)

        item5 = next(all)
        assert isinstance(item5, Event)
        assert item5.data == 'data3'
