import pytest

from ld_eventsource import *
from ld_eventsource.actions import *
from ld_eventsource.config import *
from ld_eventsource.errors import *
from ld_eventsource.testing.helpers import *


def test_start_action_with_no_headers():
    """Test that Start action can be created without headers"""
    start = Start()
    assert start.headers is None


def test_start_action_with_headers():
    """Test that Start action can be created with headers"""
    headers = {'Content-Type': 'text/event-stream', 'X-Custom': 'value'}
    start = Start(headers)
    assert start.headers == headers


def test_headers_exposed_in_start_action():
    """Test that headers from connection are exposed in Start action"""
    headers = {'Content-Type': 'text/event-stream', 'X-Test-Header': 'test-value'}
    mock = MockConnectStrategy(
        RespondWithData("event: test\ndata: data1\n\n", headers=headers)
    )

    with SSEClient(connect=mock) as client:
        all_items = list(client.all)

        # First item should be Start with headers
        assert isinstance(all_items[0], Start)
        assert all_items[0].headers == headers

        # Second item should be the event
        assert isinstance(all_items[1], Event)
        assert all_items[1].event == 'test'

        # Third item should be Fault (end of stream)
        assert isinstance(all_items[2], Fault)
        assert all_items[2].error is None


def test_headers_not_visible_in_events_iterator():
    """Test that headers are only visible when using .all, not .events"""
    headers = {'X-Custom': 'value'}
    mock = MockConnectStrategy(
        RespondWithData("event: test\ndata: data1\n\n", headers=headers)
    )

    with SSEClient(connect=mock) as client:
        events = list(client.events)

        # Should only get the event, no Start action
        assert len(events) == 1
        assert isinstance(events[0], Event)
        assert events[0].event == 'test'


def test_no_headers_when_not_provided():
    """Test that Start action has None headers when connection doesn't provide them"""
    mock = MockConnectStrategy(
        RespondWithData("event: test\ndata: data1\n\n")
    )

    with SSEClient(connect=mock) as client:
        all_items = list(client.all)

        # First item should be Start with no headers
        assert isinstance(all_items[0], Start)
        assert all_items[0].headers is None


def test_different_headers_on_reconnection():
    """Test that reconnection yields new Start with potentially different headers"""
    headers1 = {'X-Connection': 'first'}
    headers2 = {'X-Connection': 'second'}

    mock = MockConnectStrategy(
        RespondWithData("event: test1\ndata: data1\n\n", headers=headers1),
        RespondWithData("event: test2\ndata: data2\n\n", headers=headers2)
    )

    with SSEClient(
        connect=mock,
        error_strategy=ErrorStrategy.from_lambda(lambda _: (ErrorStrategy.CONTINUE, None)),
        retry_delay_strategy=no_delay()
    ) as client:
        items = []
        for item in client.all:
            items.append(item)
            # Stop after we get the second Start (from reconnection)
            if isinstance(item, Start) and len([i for i in items if isinstance(i, Start)]) == 2:
                break

        # Find all Start actions
        starts = [item for item in items if isinstance(item, Start)]
        assert len(starts) >= 2

        # First connection should have first headers
        assert starts[0].headers == headers1

        # Second connection should have second headers
        assert starts[1].headers == headers2


def test_headers_on_retry_after_error():
    """Test that headers are provided on successful retry after an error"""
    error = HTTPStatusError(503)
    headers = {'X-Retry': 'success'}

    mock = MockConnectStrategy(
        RejectConnection(error),
        RespondWithData("event: test\ndata: data1\n\n", headers=headers)
    )

    with SSEClient(
        connect=mock,
        error_strategy=ErrorStrategy.from_lambda(lambda _: (ErrorStrategy.CONTINUE, None)),
        retry_delay_strategy=no_delay()
    ) as client:
        items = []
        for item in client.all:
            items.append(item)
            if isinstance(item, Event):
                break

        # Should have: Fault (from error), Start (from retry), Event
        assert isinstance(items[0], Fault)
        assert isinstance(items[0].error, HTTPStatusError)

        assert isinstance(items[1], Start)
        assert items[1].headers == headers

        assert isinstance(items[2], Event)


def test_connection_result_headers_property():
    """Test that ConnectionResult properly stores and returns headers"""
    headers = {'X-Test': 'value'}
    result = ConnectionResult(stream=iter([b'data']), closer=None, headers=headers)
    assert result.headers == headers


def test_connection_result_no_headers():
    """Test that ConnectionResult returns None when no headers provided"""
    result = ConnectionResult(stream=iter([b'data']), closer=None)
    assert result.headers is None


def test_http_status_error_includes_headers():
    """Test that HTTPStatusError can store and expose headers"""
    headers = {'Retry-After': '120', 'X-RateLimit-Remaining': '0'}
    error = HTTPStatusError(429, headers)
    assert error.status == 429
    assert error.headers == headers
    assert error.headers.get('Retry-After') == '120'


def test_http_content_type_error_includes_headers():
    """Test that HTTPContentTypeError can store and expose headers"""
    headers = {'Content-Type': 'text/plain', 'X-Custom': 'value'}
    error = HTTPContentTypeError('text/plain', headers)
    assert error.content_type == 'text/plain'
    assert error.headers == headers
    assert error.headers.get('X-Custom') == 'value'


def test_fault_exposes_headers_from_http_status_error():
    """Test that Fault.headers delegates to HTTPStatusError.headers"""
    headers = {'Retry-After': '60'}
    error = HTTPStatusError(503, headers)
    fault = Fault(error)

    assert fault.error == error
    assert fault.headers == headers
    assert fault.headers.get('Retry-After') == '60'


def test_fault_exposes_headers_from_http_content_type_error():
    """Test that Fault.headers delegates to HTTPContentTypeError.headers"""
    headers = {'Content-Type': 'application/json'}
    error = HTTPContentTypeError('application/json', headers)
    fault = Fault(error)

    assert fault.error == error
    assert fault.headers == headers


def test_fault_headers_none_for_non_http_errors():
    """Test that Fault.headers returns None for errors without headers"""
    error = RuntimeError("some error")
    fault = Fault(error)

    assert fault.error == error
    assert fault.headers is None


def test_fault_headers_none_when_no_error():
    """Test that Fault.headers returns None when there's no error"""
    fault = Fault(None)

    assert fault.error is None
    assert fault.headers is None


def test_fault_headers_none_when_exception_has_no_headers():
    """Test that Fault.headers returns None when exception doesn't provide headers"""
    error = HTTPStatusError(500)  # No headers provided
    fault = Fault(error)

    assert fault.error == error
    assert fault.headers is None
