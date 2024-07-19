import {
  PERSONA_TYPE_STANARD,
  PERSONA_ROLE_BETA,
  PERSONA_ROLE_DEVELOPER,
  PERSONA_TYPE_PLATINUM,
  PERSONA_ROLE_USER
} from "../constants";

export const STARTER_PERSONAS = [
  {
    personaname: "Cody",
    personatype: PERSONA_TYPE_STANARD,
    personaimage: "standard.jpg",
    personaemail: "cody@launchmail.io",
    personarole: PERSONA_ROLE_USER,
  },
  {
    personaname: "Alysha",
    personatype: PERSONA_TYPE_STANARD,
    personaimage: "beta.png",
    personaemail: "alysha@launchmail.io",
    personarole: PERSONA_ROLE_BETA,
  },
  {
    personaname: "Jenn",
    personatype: PERSONA_TYPE_STANARD,
    personaimage: "woman.png",
    personaemail: "jenn@launchmail.io",
    personarole: PERSONA_ROLE_DEVELOPER,
  },
  {
    personaname: "Christine",
    personatype: PERSONA_TYPE_STANARD,
    personaimage: "/personas/persona3.png",
    personaemail: "user@launchmail.io",
    personarole: PERSONA_ROLE_USER,
  },
  {
    personaname: "Angela",
    personatype: PERSONA_TYPE_PLATINUM,
    personaimage: "/personas/persona6.jpg",
    personaemail: "angela@launchmail.io",
    personarole: PERSONA_ROLE_USER,
  },
];
