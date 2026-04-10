from typing import Callable, Iterable, Optional

from ld_eventsource.actions import Comment, Event


class _BufferedLineReader:
    """
    Helper class that encapsulates the logic for reading UTF-8 stream data as a series of text lines,
    each of which can be terminated by \n, \r, or \r\n.
    """

    @staticmethod
    def lines_from(chunks):
        """
        Takes an iterable series of encoded chunks (each of "bytes" type) and parses it into an iterable
        series of strings, each of which is one line of text. The line does not include the terminator.
        """
        last_char_was_cr = False
        partial_line = None

        for chunk in chunks:
            if len(chunk) == 0:
                continue

            # bytes.splitlines() will correctly break lines at \n, \r, or \r\n, and is faster than
            # iterating through the characters in Python code. However, we have to adjust the results
            # in several ways as described below.
            lines = chunk.splitlines()
            if last_char_was_cr:
                last_char_was_cr = False
                if chunk[0] == 10:
                    # If the last character we saw was \r, and then the first character in buf is \n, then
                    # that's just a single \r\n terminator, so we should remove the extra blank line that
                    # splitlines added for that first \n.
                    lines.pop(0)
                    if len(lines) == 0:
                        continue  # ran out of data, continue to get next chunk
            if partial_line is not None:
                # On our last time through the loop, we ended up with an unterminated line, so we should
                # treat our first parsed line here as a continuation of that.
                lines[0] = partial_line + lines[0]
                partial_line = None
            # Check whether the buffer really ended in a terminator. If it did not, then the last line in
            # lines is a partial line and should not be emitted yet.
            last_char = chunk[-1]
            if last_char == 13:
                last_char_was_cr = True  # remember this in case the next chunk starts with \n
            elif last_char != 10:
                partial_line = lines.pop()  # remove last element which is the partial line
            for line in lines:
                yield line.decode()


class _SSEReader:
    def __init__(
        self,
        lines_source: Iterable[str],
        last_event_id: Optional[str] = None,
        set_retry: Optional[Callable[[int], None]] = None,
    ):
        self._lines_source = lines_source
        self._last_event_id = last_event_id
        self._set_retry = set_retry

    @property
    def last_event_id(self):
        return self._last_event_id

    @property
    def events_and_comments(self):
        event_type = ""
        event_data = None
        event_id = None
        for line in self._lines_source:
            if line == "":
                if event_data is not None:
                    if event_id is not None:
                        self._last_event_id = event_id
                    yield Event(
                        "message" if event_type == "" else event_type,
                        event_data,
                        event_id,
                        self._last_event_id,
                    )
                event_type = ""
                event_data = None
                event_id = None
                continue
            colon_pos = line.find(':')
            if colon_pos == 0:
                yield Comment(line[1:])
                continue
            if colon_pos < 0:
                name = line
                value = ""
            else:
                name = line[:colon_pos]
                if colon_pos < (len(line) - 1) and line[colon_pos + 1] == ' ':
                    colon_pos += 1
                value = line[colon_pos + 1:]
            if name == 'event':
                event_type = value
            elif name == 'data':
                event_data = (
                    value if event_data is None else (event_data + "\n" + value)
                )
            elif name == 'id':
                if value.find("\x00") < 0:
                    event_id = value
            elif name == 'retry':
                try:
                    n = int(value)
                    if self._set_retry:
                        self._set_retry(n)
                except Exception:
                    pass  # ignore invalid number for retry
            # unknown field names are ignored in SSE
