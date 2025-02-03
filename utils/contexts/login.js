// TripsContext.js
import { useLDClient } from "launchdarkly-react-client-sdk";
import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { isAndroid, isIOS, isBrowser, isMobile, isMacOs, isWindows } from "react-device-detect";
import { setCookie, getCookie } from "cookies-next";
import { LD_CONTEXT_COOKIE_KEY, LAUNCH_CLUB_PLATINUM, LAUNCH_CLUB_STANDARD } from "../constants";
import { STARTER_PERSONAS } from "./StarterUserPersonas";

const LoginContext = createContext();

export default LoginContext;

const operatingSystem = isAndroid
  ? "Android"
  : isIOS
  ? "iOS"
  : isWindows
  ? "Windows"
  : isMacOs
  ? "macOS"
  : "";
const device = isMobile ? "Mobile" : isBrowser ? "Desktop" : "";

export const LoginProvider = ({ children }) => {
  const client = useLDClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObject, setUserObject] = useState({});
  const [appMultiContext, setAppMultiContext] = useState({
    ...client?.getContext(),
  });
  const [allUsers, setAllUsers] = useState(STARTER_PERSONAS);

  const hashEmail = async (email) => {
    return CryptoJS.SHA256(email).toString();
  };

  const getLocation = async () => {
    const options = Intl.DateTimeFormat().resolvedOptions();
    const country = options.locale.split("-")[1] || "US"; // Default to "US" if country code is not available
    return {
      key: options.timeZone,
      name: options.timeZone,
      timeZone: options.timeZone,
      country: country,
    };
  };

  const loginUser = async (email) => {
    //need to keep this here in order to pull getcookie and get same audience key as you initialized it
    const existingAudienceKey =
      getCookie(LD_CONTEXT_COOKIE_KEY) &&
      JSON.parse(getCookie(LD_CONTEXT_COOKIE_KEY))?.audience?.key;

    if (Object.keys(userObject).length > 0) {
      //to update the all personas array with the changes
      setAllUsers((prevObj) => [
        ...prevObj.filter((persona) => persona.personaemail !== userObject.personaemail),
        userObject,
      ]);
    }

    const context = await client?.getContext();
    const foundPersona = allUsers.find((persona) => persona.personaemail?.includes(email));
    await setUserObject(foundPersona);

    context.user.name = foundPersona.personaname;
    context.user.email = foundPersona.personaemail;
    const hashedEmail = await hashEmail(email);
    context.user.anonymous = false;
    context.user.key = hashedEmail;
    context.user.role = foundPersona.personarole;
    context.user.tier = foundPersona.personatier;
    context.audience.key = existingAudienceKey;
    context.location = await getLocation();
    context.user.launchclub = foundPersona.personalaunchclubstatus;
    setAppMultiContext(context);
    await client?.identify(context);
    console.log("loginUser", context);

    setCookie(LD_CONTEXT_COOKIE_KEY, context);
    setIsLoggedIn(true);
  };

  const updateAudienceContext = async () => {
    const context = await client?.getContext();
    console.log("updateAudienceContext", context);
    context.audience.key = uuidv4().slice(0, 10);
    setAppMultiContext(context);
    setCookie(LD_CONTEXT_COOKIE_KEY, context);
    await client?.identify(context);
  };

  const updateUserContext = async () => {
    const context = await client?.getContext();
    console.log("updateUserContext", context);
    context.user.key = uuidv4().slice(0, 10);
    setAppMultiContext(context);
    setCookie(LD_CONTEXT_COOKIE_KEY, context);
    await client?.identify(context);
  };

  const updateUserContextWithUserId = async (userId) => {
    const context = await client?.getContext();
    console.log("updateUserContext", context);
    context.user.key = userId;
    setAppMultiContext(context);
    setCookie(LD_CONTEXT_COOKIE_KEY, context);
    await client?.identify(context);
  };

  const logoutUser = async () => {
    const existingAudienceKey =
      getCookie(LD_CONTEXT_COOKIE_KEY) &&
      JSON.parse(getCookie(LD_CONTEXT_COOKIE_KEY))?.audience?.key;
    setIsLoggedIn(false);
    setUserObject({});
    setAllUsers(STARTER_PERSONAS);
    //need to keep this here in order to pull getcookie and get same audience key as you initialized it
    const createAnonymousContext = {
      kind: "multi",
      user: {
        anonymous: true,
        key: uuidv4().slice(0, 10),
      },
      device: {
        key: device,
        name: device,
        operating_system: operatingSystem,
        platform: device,
      },
      location: {
        key: "America/New_York",
        name: "America/New_York",
        timeZone: "America/New_York",
        country: "US",
      },
      experience: {
        key: "a380",
        name: "a380",
        airplane: "a380",
      },
      audience: {
        key: existingAudienceKey,
      },
    };
    const context = createAnonymousContext;
    setAppMultiContext(context);
    await client?.identify(context);
    setCookie(LD_CONTEXT_COOKIE_KEY, context);
    console.log("Anonymous User", context);
  };

  // const setPlaneContext = async (plane) => {
  //   const context = await client?.getContext();
  //   console.log("setPlaneContext", context);
  //   context.experience.airplane = plane;
  //   console.log("Plane context registered for trip as - " + plane);
  //   client.identify(context);
  // };

  const upgradeLaunchClubStatus = async () => {
    const context = await client?.getContext();
    console.log("upgradeLaunchClubStatus", context);
    setUserObject((prevObj) => ({ ...prevObj, personalaunchclubstatus: LAUNCH_CLUB_PLATINUM }));
    context.user.launchclub = LAUNCH_CLUB_PLATINUM;
    console.log("User upgraded to " + LAUNCH_CLUB_PLATINUM + " status");
    setAppMultiContext(context);
    client.identify(context);
    setCookie(LD_CONTEXT_COOKIE_KEY, context);
  };

  const enrollInLaunchClub = () => {
    setUserObject((prevObj) => ({ ...prevObj, personaEnrolledInLaunchClub: true }));
  };

  return (
    <LoginContext.Provider
      value={{
        userObject,
        setUserObject,
        isLoggedIn,
        upgradeLaunchClubStatus,
        // setPlaneContext,
        enrollInLaunchClub,
        updateAudienceContext,
        updateUserContext,
        updateUserContextWithUserId,
        loginUser,
        logoutUser,
        allUsers,
        appMultiContext,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
