"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import ChannelTile from "./ChannelTile";

const VISIBLE = 4;

export default function ChannelCarousel({ channelIds, linkLabel }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return undefined;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, channelIds]);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const tile = el.querySelector(".channel-tile");
    const step = tile ? tile.offsetWidth + 8 : 80;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="plancard_channelCarousel channel-carousel">
      <div className="channel-carousel-viewport" ref={trackRef}>
        <div className="channel-carousel-track">
          {channelIds.map((id) => (
            <ChannelTile key={id} id={id} />
          ))}
        </div>
      </div>
      <div className="plancard_channelsRow">
        {linkLabel && (
          <a href="#channels" className="plancard_channelsLink">
            {linkLabel}
          </a>
        )}
        <div className="channel-carousel-controls">
          <button
            type="button"
            className="channel-carousel-arrow"
            aria-label="Previous channels"
            disabled={!canPrev}
            onClick={() => scroll(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path
                d="M15 6l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="channel-carousel-arrow"
            aria-label="Next channels"
            disabled={!canNext}
            onClick={() => scroll(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
