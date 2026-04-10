import logging

from urllib3.exceptions import ProtocolError

from ld_eventsource import *
from ld_eventsource.actions import *
from ld_eventsource.config.connect_strategy import *
from ld_eventsource.testing.helpers import *
from ld_eventsource.testing.http_util import *

# Tests of the basic client/request configuration methods and HTTP functionality in
# ConnectStrategy.http(), using an embedded HTTP server as a target, but without using
# SSEClient.


def logger():
    return logging.getLogger("test")


def test_http_request_gets_chunked_data():
    with start_server() as server:
        with make_stream() as stream:
            server.for_path('/', stream)
            with ConnectStrategy.http(server.uri).create_client(logger()) as client:
                with client.connect(None) as cxn:
                    stream.push('hello')
                    assert next(cxn.stream) == b'hello'
                    stream.push('world')
                    assert next(cxn.stream) == b'world'


def test_http_request_default_headers():
    with start_server() as server:
        with make_stream() as stream:
            server.for_path('/', stream)
            with ConnectStrategy.http(server.uri).create_client(logger()) as client:
                with client.connect(None):
                    r = server.await_request()
                    assert r.headers['Accept'] == 'text/event-stream'
                    assert r.headers['Cache-Control'] == 'no-cache'
                    assert r.headers.get('Last-Event-Id') is None


def test_http_request_custom_default_headers():
    with start_server() as server:
        with make_stream() as stream:
            server.for_path('/', stream)
            strategy = ConnectStrategy.http(server.uri, headers={'name1': 'value1'})
            with strategy.create_client(logger()) as client:
                with client.connect(None):
                    r = server.await_request()
                    assert r.headers['Accept'] == 'text/event-stream'
                    assert r.headers['Cache-Control'] == 'no-cache'
                    assert r.headers['name1'] == 'value1'


def test_http_request_last_event_id_header():
    with start_server() as server:
        with make_stream() as stream:
            server.for_path('/', stream)
            strategy = ConnectStrategy.http(server.uri, headers={'name1': 'value1'})
            with strategy.create_client(logger()) as client:
                with client.connect('id123'):
                    r = server.await_request()
                    assert r.headers['Last-Event-Id'] == 'id123'


def test_http_status_error():
    with start_server() as server:
        server.for_path('/', BasicResponse(400))
        try:
            with ConnectStrategy.http(server.uri).create_client(logger()) as client:
                client.connect(None)
            raise Exception("expected exception, did not get one")
        except HTTPStatusError as e:
            assert e.status == 400


def test_http_content_type_error():
    with start_server() as server:
        with ChunkedResponse({'Content-Type': 'text/plain'}) as stream:
            server.for_path('/', stream)
            try:
                with ConnectStrategy.http(server.uri).create_client(logger()) as client:
                    client.connect(None)
                raise Exception("expected exception, did not get one")
            except HTTPContentTypeError as e:
                assert e.content_type == "text/plain"


def test_http_io_error():
    with start_server() as server:
        server.for_path('/', CauseNetworkError())
        try:
            with ConnectStrategy.http(server.uri).create_client(logger()) as client:
                client.connect(None)
            raise Exception("expected exception, did not get one")
        except ProtocolError as e:
            pass


def test_auto_redirect_301():
    with start_server() as server:
        with make_stream() as stream:
            server.for_path(
                '/', BasicResponse(301, None, {'Location': server.uri + '/real-stream'})
            )
            server.for_path('/real-stream', stream)
            with ConnectStrategy.http(server.uri).create_client(logger()) as client:
                client.connect(None)
        server.await_request()
        server.await_request()


def test_auto_redirect_307():
    with start_server() as server:
        with make_stream() as stream:
            server.for_path(
                '/', BasicResponse(307, None, {'Location': server.uri + '/real-stream'})
            )
            server.for_path('/real-stream', stream)
            with ConnectStrategy.http(server.uri).create_client(logger()) as client:
                client.connect(None)
        server.await_request()
        server.await_request()


def test_sse_client_with_http_connect_strategy():
    # Just a basic smoke test to prove that SSEClient interacts with the ConnectStrategy correctly.
    with start_server() as server:
        with make_stream() as stream:
            server.for_path('/', stream)
            with SSEClient(connect=ConnectStrategy.http(server.uri)) as client:
                client.start()
                stream.push("data: data1\n\n")
                event = next(client.events)
                assert event.data == 'data1'


def test_http_response_headers_captured():
    """Test that HTTP response headers are captured from the connection"""
    with start_server() as server:
        custom_headers = {
            'Content-Type': 'text/event-stream',
            'X-Custom-Header': 'custom-value',
            'X-Rate-Limit': '100'
        }
        with ChunkedResponse(custom_headers) as stream:
            server.for_path('/', stream)
            with ConnectStrategy.http(server.uri).create_client(logger()) as client:
                result = client.connect(None)
                assert result.headers is not None
                assert result.headers.get('X-Custom-Header') == 'custom-value'
                assert result.headers.get('X-Rate-Limit') == '100'
                # urllib3 should also include Content-Type
                assert 'Content-Type' in result.headers


def test_http_response_headers_in_sse_client():
    """Test that headers are exposed via Start action in SSEClient"""
    with start_server() as server:
        custom_headers = {
            'Content-Type': 'text/event-stream',
            'X-Session-Id': 'abc123'
        }
        with ChunkedResponse(custom_headers) as stream:
            server.for_path('/', stream)
            with SSEClient(connect=ConnectStrategy.http(server.uri)) as client:
                stream.push("event: test\ndata: data1\n\n")

                # Read from .all to get Start action
                all_items = []
                for item in client.all:
                    all_items.append(item)
                    if isinstance(item, Event):
                        break

                # First item should be Start with headers
                assert isinstance(all_items[0], Start)
                assert all_items[0].headers is not None
                assert all_items[0].headers.get('X-Session-Id') == 'abc123'

                # Second item should be the event
                assert isinstance(all_items[1], Event)


def test_http_status_error_includes_headers():
    """Test that HTTPStatusError captures response headers"""
    with start_server() as server:
        server.for_path('/', BasicResponse(429, None, {
            'Retry-After': '120',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': '1234567890'
        }))
        try:
            with ConnectStrategy.http(server.uri).create_client(logger()) as client:
                client.connect(None)
            raise Exception("expected exception, did not get one")
        except HTTPStatusError as e:
            assert e.status == 429
            assert e.headers is not None
            assert e.headers.get('Retry-After') == '120'
            assert e.headers.get('X-RateLimit-Remaining') == '0'
            assert e.headers.get('X-RateLimit-Reset') == '1234567890'


def test_http_content_type_error_includes_headers():
    """Test that HTTPContentTypeError captures response headers"""
    with start_server() as server:
        with ChunkedResponse({'Content-Type': 'application/json', 'X-Custom': 'value'}) as stream:
            server.for_path('/', stream)
            try:
                with ConnectStrategy.http(server.uri).create_client(logger()) as client:
                    client.connect(None)
                raise Exception("expected exception, did not get one")
            except HTTPContentTypeError as e:
                assert e.content_type == "application/json"
                assert e.headers is not None
                assert e.headers.get('Content-Type') == 'application/json'
                assert e.headers.get('X-Custom') == 'value'


def test_fault_exposes_headers_from_http_error():
    """Test that Fault.headers exposes headers from HTTP errors"""
    with start_server() as server:
        server.for_path('/', BasicResponse(503, None, {
            'Retry-After': '60',
            'X-Error-Code': 'SERVICE_UNAVAILABLE'
        }))
        with SSEClient(
            connect=ConnectStrategy.http(server.uri),
            error_strategy=ErrorStrategy.always_continue(),
            retry_delay_strategy=no_delay()
        ) as client:
            # Read first item which should be a Fault with the error
            fault = next(client.all)
            assert isinstance(fault, Fault)
            assert isinstance(fault.error, HTTPStatusError)
            assert fault.headers is not None
            assert fault.headers.get('Retry-After') == '60'
            assert fault.headers.get('X-Error-Code') == 'SERVICE_UNAVAILABLE'
