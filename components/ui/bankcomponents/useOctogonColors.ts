import { useEffect, useState } from "react";
import {
  CANADA_OCTOGON_COUNT,
  type DeployColor,
} from "@/utils/canadaRollout";

const EMPTY_COLORS: DeployColor[] = Array.from(
  { length: CANADA_OCTOGON_COUNT },
  () => "grey"
);

export function useOctogonColors() {
  const [colors, setColors] = useState<DeployColor[]>(EMPTY_COLORS);
  const [playbackEnabled, setPlaybackEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flagUpdateId, setFlagUpdateId] = useState(0);

  useEffect(() => {
    const source = new EventSource("/api/map-octogon-colors");
    let receivedSnapshot = false;

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { colors?: DeployColor[]; playbackEnabled?: boolean };
        let applied = false;
        if (Array.isArray(data.colors) && data.colors.length === CANADA_OCTOGON_COUNT) {
          setColors(data.colors);
          applied = true;
        }
        if (typeof data.playbackEnabled === "boolean") {
          setPlaybackEnabled(data.playbackEnabled);
          applied = true;
        }
        if (!applied) return;
        if (receivedSnapshot) setFlagUpdateId((current) => current + 1);
        receivedSnapshot = true;
      } catch (error) {
        console.warn("Octogon colors received an unreadable update.", error);
      } finally {
        setIsLoading(false);
      }
    };

    source.onerror = () => {
      setIsLoading(false);
    };

    return () => source.close();
  }, []);

  return { colors, isLoading, playbackEnabled, flagUpdateId };
}
