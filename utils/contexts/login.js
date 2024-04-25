// TripsContext.js
import { useLDClient } from "launchdarkly-react-client-sdk";
import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const LoginContext = createContext();

export default LoginContext;

// Continue in TripsContext.js
export const LoginProvider = ({ children }) => {
  const client = useLDClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [email, setEmail] = useState({});
  const [enrolledInLaunchClub, setEnrolledInLaunchClub] = useState(false);
  const [launchClubStatus, setLaunchClubStatus] = useState("standard");

  const loginUser = async (user, email) => {
    const context = await client?.getContext();

    const hashCode = (str) => {
      var hash = 0,
        i = 0,
        len = str.length;
      while (i < len) {
        hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
      }
      const key = pad(hash + 2147483647 + 1, 12);
      return "key_" + key;
    }
    
    const pad = (num, size) => {
      num = num.toString();
      while (num.length < size) num = "0" + num;
      return num;
    }

    console.log("loginUser",context)
    context.user.name = user;
    context.user.email = email;
    context.user.key = hashCode(email);
    context.audience.key = uuidv4().slice(0, 10);
    context.user.launchclub = launchClubStatus;
    setIsLoggedIn(true);
    setUser(user);
    setEmail(email);
    await client.identify(context);
  };

  const updateAudienceContext = async () => {
    const context = await client?.getContext();
    console.log("updateAudienceContext",context)
    context.audience.key = uuidv4().slice(0, 10);
    await client.identify(context);
  }

  const logoutUser = async () => {

    setIsLoggedIn(false);
    setUser("anonymous");
    setEnrolledInLaunchClub(false);
    setLaunchClubStatus("standard")
    const context = client?.getContext();
    context.user.name = "anonymous";
    context.user.email = "anonymous";
    context.audience.key = uuidv4().slice(0, 10);
    context.user.key = "anonymous";
    context.user.launchclub = launchClubStatus;
    client.identify(context);
  };

  const setPlaneContext = async (plane) => {
    const context = await client?.getContext();
    console.log("setPlaneContext",context)
    context.experience.airplane = plane;
    console.log("Plane context registered for trip as - " + plane);
    client.identify(context);
  };

  const upgradeLaunchClub = async (status) => {
    const context = await client?.getContext();
    console.log("upgradeLaunchClub",context)
    setLaunchClubStatus(status);
    context.user.launchclub = status;
    console.log("User upgraded to " + status + " status");
    client.identify(context);
  };

  return (
    <LoginContext.Provider
      value={{
        user,
        email,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        enrolledInLaunchClub,
        upgradeLaunchClub,
        setPlaneContext,
        setEnrolledInLaunchClub,
        launchClubStatus,
        setLaunchClubStatus,
        updateAudienceContext,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
