import pytest

from ld_eventsource.actions import Comment, Event
from ld_eventsource.reader import _BufferedLineReader, _SSEReader


class TestBufferedLineReader:
    @pytest.fixture(params=["\r", "\n", "\r\n"])
    def terminator(self, request):
        return request.param

    @pytest.fixture(
        params=[
            [
                ["first line*", "second line*", "3rd line*"],
                ["first line", "second line", "3rd line"],
            ],
            [["*", "second line*", "3rd line*"], ["", "second line", "3rd line"]],
            [["first line*", "*", "3rd line*"], ["first line", "", "3rd line"]],
            [
                ["first line*", "*", "*", "*", "3rd line*"],
                ["first line", "", "", "", "3rd line"],
            ],
            [
                ["first line*second line*third", " line*fourth line*"],
                ["first line", "second line", "third line", "fourth line"],
            ],
        ]
    )
    def inputs_outputs(self, terminator, request):
        inputs = list(s.replace("*", terminator).encode() for s in request.param[0])
        return [inputs, request.param[1]]

    def test_parsing(self, inputs_outputs):
        assert (
            list(_BufferedLineReader.lines_from(inputs_outputs[0])) == inputs_outputs[1]
        )

    def test_mixed_terminators(self):
        chunks = [
            b"first line\nsecond line\r\nthird line\r",
            b"\nfourth line\r",
            b"\r\nlast\r\n",
        ]
        expected = [
            "first line",
            "second line",
            "third line",
            "fourth line",
            "",
            "last",
        ]
        assert list(_BufferedLineReader.lines_from(chunks)) == expected


class TestSSEReader:
    def expect_output(self, lines, expected):
        output = list(_SSEReader(lines).events_and_comments)
        assert output == expected

    def test_parses_event_with_all_fields(self):
        lines = ["event: abc", "data: def", "id: 1", ""]
        expected_event = Event("abc", "def", "1", "1")
        self.expect_output(lines, [expected_event])

    def test_parses_event_with_only_data(self):
        lines = ["data: def", ""]
        expected_event = Event("message", "def")
        self.expect_output(lines, [expected_event])

    def test_parses_event_with_multi_line_data(self):
        lines = ["data: def", "data: ghi", ""]
        expected_event = Event("message", "def\nghi")
        self.expect_output(lines, [expected_event])

    def test_parses_event_with_empty_data(self):
        lines = ["data:", ""]
        expected_event = Event("message", "")
        self.expect_output(lines, [expected_event])

    def test_parses_comment(self):
        lines = [":comment", "data: abc", ""]
        expected_comment = Comment("comment")
        expected_event = Event("message", "abc")
        self.expect_output(lines, [expected_comment, expected_event])

    def test_parses_multiple_events(self):
        lines = ["event: abc", "data: def", "", "data: ghi", ""]
        event1 = Event("abc", "def")
        event2 = Event("message", "ghi")
        self.expect_output(lines, [event1, event2])

    def test_parses_retry_interval(self):
        got_retry = None

        def store_retry(value):
            nonlocal got_retry
            got_retry = value

        lines = ["retry: 1000"]
        list(_SSEReader(lines, None, store_retry).events_and_comments)
        assert got_retry == 1000

    def test_ignores_retry_interval_if_no_callback_given(self):
        lines = ["retry: 1000"]
        list(_SSEReader(lines, None, None).events_and_comments)

    def test_remembers_last_event_id(self):
        lines = [
            "data: first",
            "",
            "data: second",
            "id: b",
            "",
            "data: third",
            "",
            "data: fourth",
            "id:",
            "",
        ]
        expected = [
            Event("message", "first", None, "a"),
            Event("message", "second", "b", "b"),
            Event("message", "third", None, "b"),
            Event("message", "fourth", "", ""),
        ]
        output = list(_SSEReader(lines, last_event_id="a").events_and_comments)
        assert output == expected
