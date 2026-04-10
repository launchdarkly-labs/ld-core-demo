from urllib.parse import parse_qsl

from ld_eventsource import *
from ld_eventsource.config import *
from ld_eventsource.testing.helpers import *
from ld_eventsource.testing.http_util import *

# Tests of basic SSEClient behavior using real HTTP requests.


def test_sse_client_reads_events():
    with start_server() as server:
        with make_stream() as stream:
            server.for_path('/', stream)
            stream.push("event: a\ndata: data1\n\n")
            stream.push("event: b\ndata: data2\n\n")
            with SSEClient(connect=ConnectStrategy.http(server.uri)) as client:
                client.start()
                event1 = next(client.events)
                assert event1.event == 'a'
                assert event1.data == 'data1'
                event2 = next(client.events)
                assert event2.event == 'b'
                assert event2.data == 'data2'


def test_sse_client_sends_initial_last_event_id():
    with start_server() as server:
        with make_stream() as stream:
            server.for_path('/', stream)
            with SSEClient(
                connect=ConnectStrategy.http(server.uri), last_event_id="id123"
            ) as client:
                client.start()
                r = server.await_request()
                assert r.headers['Last-Event-Id'] == 'id123'


def test_sse_client_reconnects_after_socket_closed():
    with start_server() as server:
        with make_stream() as stream1:
            with make_stream() as stream2:
                server.for_path('/', SequentialHandler(stream1, stream2))
                stream1.push("event: a\ndata: data1\n\n")
                stream2.push("event: b\ndata: data2\n\n")
                with SSEClient(
                    connect=ConnectStrategy.http(server.uri),
                    error_strategy=ErrorStrategy.always_continue(),
                    initial_retry_delay=0,
                ) as client:
                    client.start()
                    event1 = next(client.events)
                    assert event1.event == 'a'
                    assert event1.data == 'data1'
                    stream1.close()
                    event2 = next(client.events)
                    assert event2.event == 'b'
                    assert event2.data == 'data2'


def test_sse_client_allows_modifying_query_params_dynamically():
    count = 0

    def dynamic_query_params() -> dict[str, str]:
        nonlocal count
        count += 1
        params = {'count': str(count)}
        if count > 1:
            params['option'] = 'updated'

        return params

    with start_server() as server:
        with make_stream() as stream1:
            with make_stream() as stream2:
                server.for_path('/', SequentialHandler(stream1, stream2))
                stream1.push("event: a\ndata: data1\nid: id123\n\n")
                stream2.push("event: b\ndata: data2\n\n")
                with SSEClient(
                    connect=ConnectStrategy.http(f"{server.uri}?basis=unchanging&option=initial", query_params=dynamic_query_params),
                    error_strategy=ErrorStrategy.always_continue(),
                    initial_retry_delay=0,
                ) as client:
                    client.start()
                    next(client.events)
                    stream1.close()
                    next(client.events)
                    r1 = server.await_request()
                    r1_query_params = dict(parse_qsl(r1.path.split('?', 1)[1]))

                    # Ensure we can add, retain, and modify query parameters
                    assert r1_query_params.get('count') == '1'
                    assert r1_query_params.get('basis') == 'unchanging'
                    assert r1_query_params.get('option') == 'initial'

                    r2 = server.await_request()
                    r2_query_params = dict(parse_qsl(r2.path.split('?', 1)[1]))
                    assert r2_query_params.get('count') == '2'
                    assert r2_query_params.get('basis') == 'unchanging'
                    assert r2_query_params.get('option') == 'updated'


def test_sse_client_sends_last_event_id_on_reconnect():
    with start_server() as server:
        with make_stream() as stream1:
            with make_stream() as stream2:
                server.for_path('/', SequentialHandler(stream1, stream2))
                stream1.push("event: a\ndata: data1\nid: id123\n\n")
                stream2.push("event: b\ndata: data2\n\n")
                with SSEClient(
                    connect=ConnectStrategy.http(server.uri),
                    error_strategy=ErrorStrategy.always_continue(),
                    initial_retry_delay=0,
                ) as client:
                    client.start()
                    next(client.events)
                    stream1.close()
                    next(client.events)
                    r1 = server.await_request()
                    assert r1.headers.get('Last-Event-Id') is None
                    r2 = server.await_request()
                    assert r2.headers['Last-Event-Id'] == 'id123'
