from typing import Optional, Tuple

from ld_eventsource.config import *


def test_backoff_with_no_jitter_and_no_max():
    base = 4
    strategy = RetryDelayStrategy.default(
        max_delay=None, backoff_multiplier=2, jitter_multiplier=None
    )

    delay, next1 = strategy.apply(base)
    assert delay == base

    delay, next2 = next1.apply(base)
    assert delay == base * 2

    delay, next3 = next2.apply(base)
    assert delay == base * 4

    delay, next4 = next3.apply(base)
    assert delay == base * 8


def test_backoff_with_no_jitter_and_max():
    base = 4
    max = base * 4 + 3
    strategy = RetryDelayStrategy.default(
        max_delay=max, backoff_multiplier=2, jitter_multiplier=None
    )

    delay, next1 = strategy.apply(base)
    assert delay == base

    delay, next2 = next1.apply(base)
    assert delay == base * 2

    delay, next3 = next2.apply(base)
    assert delay == base * 4

    delay, next4 = next3.apply(base)
    assert delay == max


def test_no_backoff_and_no_jitter():
    base = 4
    strategy = RetryDelayStrategy.default(
        max_delay=None, backoff_multiplier=1, jitter_multiplier=None
    )

    delay, next1 = strategy.apply(base)
    assert delay == base

    delay, next2 = next1.apply(base)
    assert delay == base

    delay, next3 = next2.apply(base)
    assert delay == base


def test_backoff_with_jitter():
    base = 4
    backoff = 2
    max = base * backoff * backoff + 3
    jitter = 0.25
    strategy = RetryDelayStrategy.default(
        max_delay=max, backoff_multiplier=backoff, jitter_multiplier=jitter
    )

    _, next1 = verify_jitter(strategy, base, base, jitter)
    _, next2 = verify_jitter(next1, base, base * backoff, jitter)
    _, next3 = verify_jitter(next2, base, base * backoff * backoff, jitter)
    verify_jitter(next3, base, max, jitter)


def zero_base_delay_always_produces_zero():
    strategy = RetryDelayStrategy.default()
    for i in range(5):
        r = strategy.apply(0)
        assert r.delay == 0
        r = r


def verify_jitter(
    strategy: RetryDelayStrategy, base: float, base_with_backoff: float, jitter: float
) -> Tuple[float, Optional[RetryDelayStrategy]]:
    # We can't 100% prove that it's using the expected jitter ratio, since the result
    # is pseudo-random, but we can at least prove that repeated computations don't
    # fall outside the expected range and aren't all equal.
    last_result: Optional[Tuple[float, Optional[RetryDelayStrategy]]] = None
    at_least_one_was_different = False
    for i in range(100):
        result = strategy.apply(base)
        delay, _ = result
        assert delay >= base_with_backoff * jitter
        assert delay <= base_with_backoff
        if last_result is not None and last_result != delay:
            at_least_one_was_different = True
        last_result = result
    assert at_least_one_was_different
    assert last_result is not None
    return last_result
