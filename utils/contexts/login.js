// TripsContext.js
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { createContext, useState } from 'react';


const LoginContext = createContext();

export default LoginContext;

// Continue in TripsContext.js
export const LoginProvider = ({ children }) => {
    const client = useLDClient();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});

    const loginUser = async (user, email) => {
        const context = await client?.getContext();
        context.user.name = user;
        context.user.email = email;
        setIsLoggedIn(true)
        setUser(user)
        console.log("updated context - "+ JSON.stringify(context))
        client.identify(context);
      };

    const logoutUser = async () => {
        console.log("logged out of user")
        setIsLoggedIn(false)
        setUser("anonymous")
        const context = client?.getContext();
        context.user.name = "anonymous";
        client.identify(context); 
    }
    
  
    return (
      <LoginContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, loginUser, logoutUser }}>
        {children}
      </LoginContext.Provider>
    );
  };
  