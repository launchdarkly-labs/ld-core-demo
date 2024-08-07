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
