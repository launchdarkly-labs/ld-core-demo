export type LoginUserFunctionType = (email: string) => Promise<void>;
export interface Persona {
    personaname: string,
    personatier: string,
    personaimage: string,
    personaemail: string,
    personarole: string,
    personalaunchclubstatus: string,
    personaEnrolledInLaunchClub: boolean
  }

 export interface VariantInterface {
    variant: "bank" | "airlines" | "market" | "investment";
  }

 export type LoginContextType = {
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