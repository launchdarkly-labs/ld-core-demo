import { useLDClient } from "launchdarkly-react-client-sdk";
import { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { isAndroid, isIOS, isBrowser, isMobile, isMacOs, isWindows } from "react-device-detect";
import { setCookie, getCookie } from "cookies-next";
import { LD_CONTEXT_COOKIE_KEY, LAUNCH_CLUB_PLATINUM } from "../constants";
import { STARTER_PERSONAS } from "./StarterUserPersonas";
import { Persona } from "../typescriptTypesInterfaceLogin";
import type { LoginUserFunctionType } from "@/utils/typescriptTypesInterfaceLogin";

type LoginContextType = {
  userObject: Persona;
  isLoggedIn: boolean;
  upgradeLaunchClubStatus: () => Promise<void>;
  // setPlaneContext:()=> Promise<void>;
  enrollInLaunchClub: () => void;
  updateAudienceContext: () => Promise<void>;
  loginUser: LoginUserFunctionType;
  logoutUser: () => Promise<void>;
  allUsers: Persona[];
};

const LoginContext = createContext<LoginContextType | null>(null);

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
  const [userObject, setUserObject] = useState<Persona>({
    personaname: "",
    personatier: "",
    personaimage: "",
    personaemail: "",
    personarole: "",
    personalaunchclubstatus: "",
    personaEnrolledInLaunchClub: false,
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
    const existingAudienceKey: string =
      getCookie(LD_CONTEXT_COOKIE_KEY) &&
      JSON.parse(getCookie(LD_CONTEXT_COOKIE_KEY))?.audience?.key;

    if (Object.keys(userObject).length > 0) {
      //to update the all personas array with the changes
      setAllUsers((prevObj: (Persona | undefined)[]) => [
        ...prevObj.filter((persona) => persona?.personaemail !== userObject?.personaemail),
        userObject,
      ]);
    }

    const context = await client?.getContext();
    const foundPersona: Persona = allUsers.find((persona) =>
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
    context.audience.key = existingAudienceKey;
    context.location = await getLocation();
    context.user.launchclub = foundPersona?.personalaunchclubstatus;
    await client?.identify(context);
    console.log("loginUser", context);
    console.log(foundPersona?.personaname, foundPersona?.personaemail, foundPersona?.personarole);

    setCookie(LD_CONTEXT_COOKIE_KEY, context);
    setIsLoggedIn(true);
  };

  const updateAudienceContext = async (): Promise<void> => {
    const context = await client?.getContext();
    console.log("updateAudienceContext", context);
    context.audience.key = uuidv4().slice(0, 10);
    await client?.identify(context);
  };

  const logoutUser = async (): Promise<void> => {
    const existingAudienceKey: string =
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

  const upgradeLaunchClubStatus = async (): Promise<void> => {
    const context = await client?.getContext();
    console.log("upgradeLaunchClubStatus", context);
    setUserObject((prevObj) => ({ ...prevObj, personalaunchclubstatus: LAUNCH_CLUB_PLATINUM }));
    context.user.launchclub = LAUNCH_CLUB_PLATINUM;
    console.log("User upgraded to " + LAUNCH_CLUB_PLATINUM + " status");
    client.identify(context);
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
        // setPlaneContext,
        enrollInLaunchClub,
        updateAudienceContext,
        loginUser,
        logoutUser,
        allUsers,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
