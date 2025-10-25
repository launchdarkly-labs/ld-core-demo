import logging

from urllib3.exceptions import ProtocolError

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
