import {
  PERSONA_TIER_STANARD,
  PERSONA_ROLE_BETA,
  PERSONA_ROLE_DEVELOPER,
  PERSONA_TIER_PLATINUM,
  PERSONA_ROLE_USER,
  LAUNCH_CLUB_STANDARD,
  LAUNCH_CLUB_PLATINUM
} from "../constants";

import {Persona} from '@/utils/typescriptTypesInterfaceLogin'

export const STARTER_PERSONAS: Persona[] = [
  {
    personaname: "Christine",
    personatier: PERSONA_TIER_STANARD,
    personaimage: "/personas/persona3.png",
    personaemail: "user@launchmail.io",
    personarole: PERSONA_ROLE_USER,
    personalaunchclubstatus: LAUNCH_CLUB_STANDARD,
    personaEnrolledInLaunchClub: false
  },
  {
    personaname: "Angela",
    personatier: PERSONA_TIER_PLATINUM,
    personaimage: "/personas/persona6.jpg",
    personaemail: "angela@launchmail.io",
    personarole: PERSONA_ROLE_USER,
    personalaunchclubstatus: LAUNCH_CLUB_PLATINUM,
    personaEnrolledInLaunchClub: true
  },
  {
    personaname: "Alysha",
    personatier: PERSONA_TIER_STANARD,
    personaimage: "beta.png",
    personaemail: "alysha@launchmail.io",
    personarole: PERSONA_ROLE_BETA,
    personalaunchclubstatus: LAUNCH_CLUB_STANDARD,
    personaEnrolledInLaunchClub: false
  },
  {
    personaname: "Jenn",
    personatier: PERSONA_TIER_STANARD,
    personaimage: "woman.png",
    personaemail: "jenn@launchmail.io",
    personarole: PERSONA_ROLE_DEVELOPER,
    personalaunchclubstatus: LAUNCH_CLUB_STANDARD,
    personaEnrolledInLaunchClub: false
  },
  {
    personaname: "Cody",
    personatier: PERSONA_TIER_STANARD,
    personaimage: "standard.jpg",
    personaemail: "cody@launchmail.io",
    personarole: PERSONA_ROLE_USER,
    personalaunchclubstatus: LAUNCH_CLUB_STANDARD,
    personaEnrolledInLaunchClub: false
  },
];
