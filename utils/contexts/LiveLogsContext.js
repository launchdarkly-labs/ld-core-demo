import { createContext, useEffect, useState, useContext } from "react";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import Prism from "prismjs";
import LoginContext from "@/utils/contexts/login";

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
            log: JSON.stringify(settings, null, 4),
            type: "New LD Flag Change Event Received",
            color: "text-white bg-airlinedarkblue",
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
          log: JSON.stringify(appMultiContext, null, 4),
          type: "New LD Context Change Event Sent",
          color: "text-black bg-gray-200",
        },
      ];
    });
  }, [appMultiContext]);

  const logLDMetricSent = ( metricKey, metricValue ) => {
    const time = new Date();
    setLiveLogs((prevLogs) => {
      return [
        ...prevLogs,
        {
          date: time,
          log: `client?.track(${metricKey}, client.getContext() ${
            metricValue !== undefined ? `, ${metricValue}` : ""
          });`,
          type: "New LD Metric Sent",
          color: "text-white bg-purple-500",
        },
      ];
    });
  };

  return (
    <LiveLogsContext.Provider value={{ liveLogs, currentLDFlagEnvValues, logLDMetricSent }}>
      {children}
    </LiveLogsContext.Provider>
  );
};
