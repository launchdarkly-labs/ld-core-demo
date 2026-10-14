import { useEffect, useRef, useState } from "react";
import type { BeatChoice, DjBeatSnapshot } from "@/utils/djBeat";

const VOTER_KEY = "dj-beat-voter";

export const beatVoterId = () => {
  const existing = window.localStorage.getItem(VOTER_KEY);
  if (existing) return existing;
  const created = window.crypto.randomUUID();
  window.localStorage.setItem(VOTER_KEY, created);
  return created;
};

export function useDjBeat() {
  const [snapshot, setSnapshot] = useState<DjBeatSnapshot | null>(null);
  const resetAtRef = useRef(0);
  resetAtRef.current = snapshot?.resetAt ?? 0;

  const applySnapshot = (next: DjBeatSnapshot) => {
    setSnapshot((current) => {
      const nextRevision = next.revision ?? 0;
      const currentRevision = current?.revision ?? -1;
      if (nextRevision < currentRevision) return current;
      return next;
    });
  };

  useEffect(() => {
    const source = new EventSource("/api/dj-beat");
    source.onmessage = (event) => {
      try {
        applySnapshot(JSON.parse(event.data) as DjBeatSnapshot);
      } catch (error) {
        console.warn("The shared beat sent an unreadable update.", error);
      }
    };
    return () => source.close();
  }, []);

  const vote = async (choice: BeatChoice) => {
    const response = await fetch("/api/dj-beat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voterId: beatVoterId(),
        choice,
        resetAt: resetAtRef.current,
        castAt: Date.now(),
      }),
    });
    if (!response.ok) throw new Error("Vote was not accepted");
    applySnapshot((await response.json()) as DjBeatSnapshot);
  };

  const resetVotes = async () => {
    const response = await fetch("/api/dj-beat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
    if (!response.ok) throw new Error("Votes were not reset");
    applySnapshot((await response.json()) as DjBeatSnapshot);
  };

  return { snapshot, vote, resetVotes };
}
