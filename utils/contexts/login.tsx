import { useLDClient } from "launchdarkly-react-client-sdk";
import { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { isAndroid, isIOS, isBrowser, isMobile, isMacOs, isWindows } from "react-device-detect";
import { setCookie, getCookie } from "cookies-next";
import { LD_CONTEXT_COOKIE_KEY, LAUNCH_CLUB_PLATINUM } from "../constants";
import { STARTER_PERSONAS } from "./StarterUserPersonas";
import { Persona } from "../typescriptTypesInterfaceLogin";
import type { LoginContextType } from "@/utils/typescriptTypesInterfaceLogin";
import { LDContext } from "launchdarkly-js-client-sdk";

const startingUserObject = {
  personaname: "",
  personatier: "",
  personaimage: "",
  personaemail: "",
  personarole: "",
  personalaunchclubstatus: "",
  personaEnrolledInLaunchClub: false,
};

const LoginContext = createContext<LoginContextType>({
  userObject: startingUserObject,
  isLoggedIn: false,
  async upgradeLaunchClubStatus() {},
  // async setPlaneContext(),
  async enrollInLaunchClub() {},
  async updateAudienceContext() {},
  async updateUserContext() {},
  async loginUser() {},
  async logoutUser() {},
  allUsers: [],
});

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

export const LoginProvider = ({ children }: { children: any }) => {
  const client = useLDClient();
const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
const [userObject, setUserObject] = useState<Persona | {}>({});
  const [appMultiContext, setAppMultiContext] = useState({
    ...client?.getContext(),
  });
  const [allUsers, setAllUsers] = useState<Persona[]>(STARTER_PERSONAS);

  const hashEmail = async (email: string): Promise<string> => {
    return CryptoJS.SHA256(email).toString();
  };

  const getLocation = async (): Promise<{
    key: string;
    name: string;
    timeZone: string;
    country: string;
  }> => {
    const options = Intl.DateTimeFormat().resolvedOptions();
    const country = options.locale.split("-")[1] || "US"; // Default to "US" if country code is not available
    return {
      key: options.timeZone,
      name: options.timeZone,
      timeZone: options.timeZone,
      country: country,
    };
  };

  const loginUser = async (email: string): Promise<void> => {
    //need to keep this here in order to pull getcookie and get same audience key as you initialized it
    const ldContextCookieKey: string | undefined = getCookie(LD_CONTEXT_COOKIE_KEY);
    const existingAudienceKey: string =
      ldContextCookieKey && JSON.parse(ldContextCookieKey)?.audience?.key;

    if (Object.keys(userObject).length > 0) {
      //to update the all personas array with the changes
      setAllUsers((prevObj) => [
        ...prevObj.filter((persona) => persona?.personaemail !== userObject?.personaemail),
        userObject,
      ]);
    }

    const context: LDContext | undefined = await client?.getContext();
    //don't know how to fix this without using undefined
    const foundPersona: Persona = allUsers?.find((persona) =>
      persona?.personaemail?.includes(email)
    );
    await setUserObject(foundPersona);
    context.user.name = foundPersona?.personaname;
    context.user.email = foundPersona?.personaemail;
    const hashedEmail = await hashEmail(email);
    context.user.anonymous = false;
    context.user.key = hashedEmail;
    context.user.role = foundPersona?.personarole;
    context.user.tier = foundPersona?.personatier;
    context.user.device = device;
    context.user.operating_system = operatingSystem;
    context.user.location = await getLocation();
    context.audience.key = existingAudienceKey;
    context.location = await getLocation();
    context.user.launchclub = foundPersona?.personalaunchclubstatus;
    setAppMultiContext(context);
    await client?.identify(context);
    console.log("loginUser", context);

    setCookie(LD_CONTEXT_COOKIE_KEY, context);
    setIsLoggedIn(true);
  };

  const updateAudienceContext = async (): Promise<void> => {
    const context = await client?.getContext();
    console.log("updateAudienceContext", context);
    context.audience.key = uuidv4().slice(0, 10);
    setAppMultiContext(context);
    setCookie(LD_CONTEXT_COOKIE_KEY, context);
    await client?.identify(context);
  };

  const updateUserContext = async (): Promise<void> => {
    const context = await client?.getContext();
    context.user.key = uuidv4();
    context.user.device = Math.random() < 0.5 ? "Mobile" : "Desktop";
    const osOptions = ["iOS", "Android", "macOS", "Windows"];
    context.user.operating_system = osOptions[Math.floor(Math.random() * osOptions.length)];
    context.user.location = `America/${["New_York", "Chicago", "Los_Angeles", "Denver"][Math.floor(Math.random() * 4)]}`;
    context.user.tier = ["Gold", "Silver", "Platinum"][Math.floor(Math.random() * 3)];
    context.user.anonymous = false;
    setAppMultiContext(context);
    setCookie(LD_CONTEXT_COOKIE_KEY, context);
    console.log("updateUserContext", context);
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
    setUserObject(startingUserObject);
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

  const upgradeLaunchClubStatus = async (): Promise<void> => {
    const context = await client?.getContext();
    console.log("upgradeLaunchClubStatus", context);
    setUserObject((prevObj) => ({ ...prevObj, personalaunchclubstatus: LAUNCH_CLUB_PLATINUM }));
    context.user.launchclub = LAUNCH_CLUB_PLATINUM;
    console.log("User upgraded to " + LAUNCH_CLUB_PLATINUM + " status");
    setAppMultiContext(context);
    client.identify(context);
    setCookie(LD_CONTEXT_COOKIE_KEY, context);
  };

  const enrollInLaunchClub = (): void => {
    setUserObject((prevObj) => ({ ...prevObj, personaEnrolledInLaunchClub: true }));
  };

  return (
    <LoginContext.Provider
      value={{
        userObject,
        isLoggedIn,
        upgradeLaunchClubStatus,
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