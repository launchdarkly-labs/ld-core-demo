import { createContext, useEffect, useState } from "react";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import Prism from "prismjs";

const LiveLogsContext = createContext();

export default LiveLogsContext;

export const LiveLogsProvider = ({ children }) => {
  const [liveLogs, setLiveLogs] = useState([]);
  const [currentLDFlagEnvValues, setCurrentLDFlagEnvValues] = useState([]);
  const allLDFlags = useFlags();
  const client = useLDClient();

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  useEffect(() => {
    setCurrentLDFlagEnvValues(Object.entries(allLDFlags));
  }, [allLDFlags]);

  useEffect(() => {
    client.on("change", (settings) => {
      const time = new Date();

      setLiveLogs((prevLogs) => {
        return [
          ...prevLogs,
          {
            date: time,
            log: settings,
          },
        ];
      });
    });
  }, [client]);

  return (
    <LiveLogsContext.Provider value={{ liveLogs, currentLDFlagEnvValues }}>
      {children}
    </LiveLogsContext.Provider>
  );
};
