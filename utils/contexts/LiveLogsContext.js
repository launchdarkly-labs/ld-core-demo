import { createContext, useEffect, useState, useContext } from "react";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import Prism from "prismjs";
import LoginContext from "@/utils/contexts/login";
import ContextProvider from "@/components/ContextProvider";

const LiveLogsContext = createContext();

export default LiveLogsContext;

export const LiveLogsProvider = ({ children }) => {
  const [liveLogs, setLiveLogs] = useState([]);
  const [currentLDFlagEnvValues, setCurrentLDFlagEnvValues] = useState([]);
  const allLDFlags = useFlags();
  const client = useLDClient();
  const { appMultiContext } = useContext(LoginContext);
  

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
            type: "New Flag Change Event Received"
          },
        ];
      });
    });
  }, [client]);

  useEffect(() => {
    const time = new Date();

    setLiveLogs((prevLogs) => {
      return [
        ...prevLogs,
        {
          date: time,
          log: appMultiContext,
          type:"New LD Context Change Event Sent"
        },
      ];
    });
  }, [appMultiContext]);

  return (
    <LiveLogsContext.Provider value={{ liveLogs, currentLDFlagEnvValues }}>
      {children}
    </LiveLogsContext.Provider>
  );
};
