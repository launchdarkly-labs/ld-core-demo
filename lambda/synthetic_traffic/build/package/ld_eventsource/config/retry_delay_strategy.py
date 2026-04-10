from __future__ import annotations

import time
from random import Random
from typing import Callable, Optional, Tuple


class RetryDelayStrategy:
    """Base class of strategies for computing how long to wait before retrying a connection.

    The default behavior, provided by :meth:`default()`, provides customizable exponential backoff
    and jitter. Applications may also create their own subclasses of RetryDelayStrategy if they
    desire different behavior. It is generally a best practice to use backoff and jitter, to avoid
    a reconnect storm during a service interruption.

    Subclasses should be immutable. To implement strategies where the delay uses different parameters
    on each subsequent retry (such as exponential backoff), the strategy should return a new instance
    of its own class as the second return value from ``apply``, rather than modifying the state of
    the existing instance. This makes it easy for SSEClient to reset to the original delay state when
    appropriate by simply reusing the original instance.
    """

    def apply(self, base_delay: float) -> Tuple[float, RetryDelayStrategy]:
        """Applies the strategy to compute the appropriate retry delay.

        :param base_delay: the initial configured base delay, in seconds, as set in the SSEClient
            parameters
        :return: a tuple where the first element is the computed delay, in seconds, and the second
            element the strategy object to use next time (which could be ``self``)
        """
        return (base_delay, self)

    @staticmethod
    def default(
        max_delay: Optional[float] = None,
        backoff_multiplier: float = 2,
        jitter_multiplier: Optional[float] = None,
    ) -> RetryDelayStrategy:
        """
        Provides the default retry delay behavior for :class:`.SSEClient`, which includes
        customizable backoff and jitter options.

        The behavior is as follows:

        * Start with the configured base delay as set by the ``initial_retry_delay`` parameter to
          :class:`.SSEClient`.
        * On each subsequent attempt, multiply the base delay by ``backoff_multiplier``, giving the
          current base delay.
        * If ``max_delay`` is set and is greater than zero, the base delay is pinned to be no greater
          than that value.
        * If ``jitter_multiplier`` is set and is greater than zero, the actual delay for each attempt is
          equal to the current base delay minus a pseudo-random number equal to that ratio times itself.
          For instance, a jitter multiplier of 0.25 would mean that a base delay of 1000 is changed to a
          value in the range [750, 1000].


        :param max_delay: the maximum possible delay value, in seconds; default is 30 seconds
        :param backoff_multiplier: the exponential backoff factor
        :param jitter_multiplier: a fraction from 0.0 to 1.0 for how much of the delay may be
            pseudo-randomly subtracted
        """
        return _DefaultRetryDelayStrategy(
            max_delay or 0,
            backoff_multiplier,
            jitter_multiplier or 0,
            0,
            _ReusableRandom(time.time()),
        )

    @staticmethod
    def from_lambda(
        fn: Callable[[float], Tuple[float, Optional[RetryDelayStrategy]]]
    ) -> RetryDelayStrategy:
        """
        Convenience method for creating a RetryDelayStrategy whose ``apply`` method is equivalent to
        the given lambda.

        The one difference is that the second return value is an ``Optional[RetryDelayStrategy]`` which
        can be None to mean "no change", since the lambda cannot reference the strategy's ``self``.
        """
        return _LambdaRetryDelayStrategy(fn)


class _DefaultRetryDelayStrategy(RetryDelayStrategy):
    def __init__(
        self,
        max_delay: float,
        backoff_multiplier: float,
        jitter_multiplier: float,
        last_base_delay: float,
        random: _ReusableRandom,
    ):
        self.__max_delay = max_delay
        self.__backoff_multiplier = backoff_multiplier
        self.__jitter_multiplier = jitter_multiplier
        self.__last_base_delay = last_base_delay
        self.__random = random

    def apply(self, base_delay: float) -> Tuple[float, RetryDelayStrategy]:
        next_base_delay = (
            base_delay
            if self.__last_base_delay == 0
            else self.__last_base_delay * self.__backoff_multiplier
        )
        if self.__max_delay > 0 and next_base_delay > self.__max_delay:
            next_base_delay = self.__max_delay
        adjusted_delay = next_base_delay

        random = self.__random
        if self.__jitter_multiplier > 0:
            # To avoid having this object contain mutable state, we create a new Random with the same
            # state as our previous Random before using it.
            random = random.clone()
            adjusted_delay -= (
                random.random() * self.__jitter_multiplier * adjusted_delay
            )

        next_strategy = _DefaultRetryDelayStrategy(
            self.__max_delay,
            self.__backoff_multiplier,
            self.__jitter_multiplier,
            next_base_delay,
            random,
        )
        return (adjusted_delay, next_strategy)


class _LambdaRetryDelayStrategy(RetryDelayStrategy):
    def __init__(
        self, fn: Callable[[float], Tuple[float, Optional[RetryDelayStrategy]]]
    ):
        self.__fn = fn

    def apply(self, base_delay: float) -> Tuple[float, RetryDelayStrategy]:
        delay, maybe_next = self.__fn(base_delay)
        return (delay, maybe_next or self)


class _ReusableRandom:
    def __init__(self, seed: float):
        self.__seed = seed
        self.__random = Random(seed)

    def clone(self):
        state = self.__random.getstate()
        ret = _ReusableRandom(self.__seed)
        ret.__random.setstate(state)
        return ret

    def random(self) -> float:
        return self.__random.random()


__all__ = ['RetryDelayStrategy']
