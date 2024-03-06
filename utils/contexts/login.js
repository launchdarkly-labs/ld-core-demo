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
  const [launchClubStatus, setLaunchClubStatus] = useState("economy");

  const loginUser = async (user, email) => {
    const context = await client?.getContext();
    console.log("loginUser",context)
    context.user.name = user;
    context.user.email = email;
    context.user.key = email;
    context.audience.key = uuidv4().slice(0, 10)
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
    const context = client?.getContext();
    context.user.name = "anonymous";
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
