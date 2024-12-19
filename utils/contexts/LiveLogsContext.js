import { createContext, useEffect, useState } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
const LiveLogsContext = createContext();

export default LiveLogsContext;

export const LiveLogsProvider = ({ children }) => {
  const [liveLogs, setLiveLogs] = useState([]);
  const [currentLDFlagEnvValues, setCurrentLDFlagEnvValues] = useState([]);
  const aiNewModelChatbotFlag = useFlags();
  console.log("aiNewModelChatbotFlag", Object.entries(aiNewModelChatbotFlag));

  useEffect(() => {
    setCurrentLDFlagEnvValues(Object.entries(aiNewModelChatbotFlag));
  }, []);

  return (
    <LiveLogsContext.Provider value={{ liveLogs, currentLDFlagEnvValues }}>
      {children}
    </LiveLogsContext.Provider>
  );
};
