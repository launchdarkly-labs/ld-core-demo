
import { createContext, useState } from 'react';

const LiveLogsContext = createContext();

export default LiveLogsContext;

export const LiveLogsProvider = ({ children }) => {
    const [liveLogs, setLiveLogs] = useState([]);

    
 
  
    return (
      <LiveLogsContext.Provider value={{ liveLogs, setLiveLogs }}>
        {children}
      </LiveLogsContext.Provider>
    );
  };
  