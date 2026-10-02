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
  const [playbackEnabled, setPlaybackEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const source = new EventSource("/api/map-octogon-colors");

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { colors?: DeployColor[]; playbackEnabled?: boolean };
        if (Array.isArray(data.colors) && data.colors.length === CANADA_OCTOGON_COUNT) {
          setColors(data.colors);
        }
        if (typeof data.playbackEnabled === "boolean") {
          setPlaybackEnabled(data.playbackEnabled);
        }
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

  return { colors, isLoading, playbackEnabled };
}
