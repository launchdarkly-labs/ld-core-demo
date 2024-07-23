// TripsContext.js
import { useLDClient } from "launchdarkly-react-client-sdk";
import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from 'crypto-js';
import { isAndroid, isIOS, isBrowser, isMobile, isMacOs, isWindows } from 'react-device-detect';
import { setCookie, getCookie } from "cookies-next";
import { LAUNCH_CLUB_STANDARD, LD_CONTEXT_COOKIE_KEY } from "../constants";
import { STARTER_PERSONAS } from "./StarterUserPersonas";

const LoginContext = createContext();

export default LoginContext;

const operatingSystem = isAndroid ? 'Android' : isIOS ? 'iOS' : isWindows ? 'Windows' : isMacOs ? 'macOS' : '';
const device = isMobile ? 'Mobile' : isBrowser ? 'Desktop' : '';

// Continue in TripsContext.js
export const LoginProvider = ({ children }) => {
  const client = useLDClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObject, setUserObject] = useState({});
  const [enrolledInLaunchClub, setEnrolledInLaunchClub] = useState(false);
  const [launchClubStatus, setLaunchClubStatus] = useState(LAUNCH_CLUB_STANDARD);
  const [allPersonas, setAllPersonas] = useState(STARTER_PERSONAS);

  const hashEmail = async (email) => {
    return CryptoJS.SHA256(email).toString();
  };

  const loginUser = async (email) => {
    //need to keep this here in order to pull getcookie and get same audience key as you initialized it
    const existingAudienceKey = getCookie(LD_CONTEXT_COOKIE_KEY) && JSON.parse(getCookie(LD_CONTEXT_COOKIE_KEY))?.audience?.key;
    const context = await client?.getContext();
    const foundPersona = allPersonas.find((persona) => persona.personaemail?.includes(email));
    //TODO: when you logout or login and isloggin is true, you need to update allpersona with userObject changes before switching to the next new persona
    //TODO: this is to keep track of launch club status when log in betweeen
    await setUserObject(foundPersona)

    context.user.name = foundPersona.personaname;
    context.user.email = email;
    const hashedEmail = await hashEmail(email);
    context.user.anonymous = false;
    context.user.key = hashedEmail;
    context.user.role = foundPersona.personarole;
    context.audience.key = existingAudienceKey;
    context.user.launchclub = foundPersona.personalaunchclubstatus;
    await client?.identify(context);
    console.log("loginUser", context);
    console.log(foundPersona.personaname, email, foundPersona.personarole)
 
    setCookie(LD_CONTEXT_COOKIE_KEY, context);
    setIsLoggedIn(true);

  };

  useEffect(()=>{
    console.log(userObject)
  },[userObject])

  const updateAudienceContext = async () => {
    const context = await client?.getContext();
    console.log("updateAudienceContext", context);
    context.audience.key = uuidv4().slice(0, 10);
    await client?.identify(context);
  };

  const logoutUser = async () => {
    const existingAudienceKey = getCookie(LD_CONTEXT_COOKIE_KEY) && JSON.parse(getCookie(LD_CONTEXT_COOKIE_KEY))?.audience?.key;
    setIsLoggedIn(false);
    setUserObject({})
    setEnrolledInLaunchClub(false);
    setLaunchClubStatus(LAUNCH_CLUB_STANDARD);
    //need to keep this here in order to pull getcookie and get same audience key as you initialized it
     const createAnonymousContext =  {
      "kind": "multi",
      "user": {
        "anonymous": true,
        "tier":null
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
        "key": existingAudienceKey
      }
    };
    const context = createAnonymousContext;
    await client?.identify(context);
    setCookie(LD_CONTEXT_COOKIE_KEY, context);
    console.log("Anonymous User", context);
    setCookie("ldcontext", context);
  };

  // const setPlaneContext = async (plane) => {
  //   const context = await client?.getContext();
  //   console.log("setPlaneContext", context);
  //   context.experience.airplane = plane;
  //   console.log("Plane context registered for trip as - " + plane);
  //   client.identify(context);
  // };

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
        userObject,
        setUserObject,
        isLoggedIn,
        setIsLoggedIn,
        enrolledInLaunchClub,
        upgradeLaunchClub,
        // setPlaneContext,
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

