import {
  PERSONA_TIER_STANARD,
  PERSONA_ROLE_BETA,
  PERSONA_ROLE_DEVELOPER,
  PERSONA_TIER_PLATINUM,
  PERSONA_ROLE_USER
} from "../constants";

export const STARTER_PERSONAS = [
  {
    personaname: "Cody",
    personatier: PERSONA_TIER_STANARD,
    personaimage: "standard.jpg",
    personaemail: "cody@launchmail.io",
    personarole: PERSONA_ROLE_USER,
  },
  {
    personaname: "Alysha",
    personatier: PERSONA_TIER_STANARD,
    personaimage: "beta.png",
    personaemail: "alysha@launchmail.io",
    personarole: PERSONA_ROLE_BETA,
  },
  {
    personaname: "Jenn",
    personatier: PERSONA_TIER_STANARD,
    personaimage: "woman.png",
    personaemail: "jenn@launchmail.io",
    personarole: PERSONA_ROLE_DEVELOPER,
  },
  {
    personaname: "Christine",
    personatier: PERSONA_TIER_STANARD,
    personaimage: "/personas/persona3.png",
    personaemail: "user@launchmail.io",
    personarole: PERSONA_ROLE_USER,
  },
  {
    personaname: "Angela",
    personatier: PERSONA_TIER_PLATINUM,
    personaimage: "/personas/persona6.jpg",
    personaemail: "angela@launchmail.io",
    personarole: PERSONA_ROLE_USER,
  },
];
