// TripsContext.js
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { createContext, useState, useEffect } from 'react';


const LoginContext = createContext();

export default LoginContext;

// Continue in TripsContext.js
export const LoginProvider = ({ children }) => {
    const client = useLDClient();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [email, setEmail] = useState({});
    const [enrolledInLaunchClub, setEnrolledInLaunchClub] = useState(false);
    const [launchClubStatus, setLaunchClubStatus] = useState("economy")

    useEffect(() => {
      console.log("isLoggedIn from context - "+isLoggedIn)
    }, [isLoggedIn])

    const loginUser = async (user, email) => {
        const context = await client?.getContext();
        context.user.name = user;
        context.user.email = email;
        context.user.key = email;
        setIsLoggedIn(true)
        setUser(user)
        setEmail(email)
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

    const setPlaneContext = async (plane) => {
      const context = await client?.getContext(); 
      context.experience.airplane = plane 
      console.log("Plane context registered for trip as - "+plane)
      client.identify(context)
    }

    const upgradeLaunchClub = async (status) => {
      const context = await client?.getContext(); 
      setLaunchClubStatus(status)
      context.user.launchclub = status 
      console.log("User upgraded to "+status+" status")
      client.identify(context) 
    }

    
  
    return (
      <LoginContext.Provider value={{ user, email, setUser, isLoggedIn, setIsLoggedIn, enrolledInLaunchClub, upgradeLaunchClub, setPlaneContext, setEnrolledInLaunchClub, launchClubStatus, setLaunchClubStatus, loginUser, logoutUser }}>
        {children}
      </LoginContext.Provider>
    );
  };
  