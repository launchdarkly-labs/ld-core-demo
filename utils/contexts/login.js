// TripsContext.js
import { useLDClient } from "launchdarkly-react-client-sdk";
import { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from 'crypto-js';
import { isAndroid, isIOS, isBrowser, isMobile, isMacOs, isWindows } from 'react-device-detect';
import { setCookie } from "cookies-next";

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
  const operatingSystem = isAndroid ? 'Android' : isIOS ? 'iOS' : isWindows ? 'Windows' : isMacOs ? 'macOS' : '';
  const device = isMobile ? 'Mobile' : isBrowser ? 'Desktop' : '';


  const hashEmail = async (email) => {
    return CryptoJS.SHA256(email).toString();
  };

  const loginUser = async (user, email, role) => {
    const context = await client?.getContext();
    console.log("loginUser", context);
    context.user.name = user;
    context.user.email = email;
    let hashedEmail = await hashEmail(email);
    context.user.anonymous = false;
    context.user.key = hashedEmail;
    context.user.role = role;
    context.audience.key = uuidv4().slice(0, 10);
    context.user.launchclub = launchClubStatus;
    await client?.identify(context);
    setIsLoggedIn(true);
    setUser(user);
    setEmail(email);
  };

  const updateAudienceContext = async () => {
    const context = await client?.getContext();
    console.log("updateAudienceContext", context);
    context.audience.key = uuidv4().slice(0, 10);
    await client?.identify(context);
  };

  const logoutUser = async () => {
    setIsLoggedIn(false);
    setUser("anonymous");
    setEnrolledInLaunchClub(false);
    setLaunchClubStatus("standard");
    const context = await createAnonymousContext();
    await client?.identify(context);
    console.log("Anonymous User", context);
    setCookie("ldcontext", context);
  };
  
  const createAnonymousContext = async () => {
    return {
      "kind": "multi",
      "user": {
        "anonymous": true,
        tier: null
      },
      "device": {
        "key": device,
        "name": device,
        "operating_system": operatingSystem,
        "platform": device,
      },
      "location": {
        "key": "America/New_York",
        "name": "America/New_York",
        "timeZone": "America/New_York",
        "country": "US"
      },
      "experience": {
        "key": "a380",
        "name": "a380",
        "airplane": "a380"
      },
      "audience": {
        "key": uuidv4().slice(0, 10)
      }
    }
  }

  const setPlaneContext = async (plane) => {
    const context = await client?.getContext();
    console.log("setPlaneContext", context);
    context.experience.airplane = plane;
    console.log("Plane context registered for trip as - " + plane);
    client.identify(context);
  };

  const upgradeLaunchClub = async (status) => {
    const context = await client?.getContext();
    console.log("upgradeLaunchClub", context);
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
