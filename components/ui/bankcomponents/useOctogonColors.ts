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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const source = new EventSource("/api/map-octogon-colors");

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { colors?: DeployColor[] };
        if (Array.isArray(data.colors) && data.colors.length === CANADA_OCTOGON_COUNT) {
          setColors(data.colors);
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

  return { colors, isLoading };
}
