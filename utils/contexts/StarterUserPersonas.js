import persona3 from "@/public/personas/persona3.png"
import { PERSONA_ROLE_STANARD,PERSONA_ROLE_BETA, PERSONA_ROLE_DEVELOPER } from "../constants";

export const STARTER_PERSONAS = [
  {
    personaname: "Cody",
    personatype: `${PERSONA_ROLE_STANARD} User`,
    personaimage: "standard.jpg",
    personaemail: "cody@launchmail.io",
    personarole: PERSONA_ROLE_STANARD,
  },
  {
    personaname: "Alysha",
    personatype: `${PERSONA_ROLE_BETA} User`,
    personaimage: "beta.png",
    personaemail: "alysha@launchmail.io",
    personarole: PERSONA_ROLE_BETA,
  },
  {
    personaname: "Jenn",
    personatype: PERSONA_ROLE_DEVELOPER,
    personaimage: "woman.png",
    personaemail: "jenn@launchmail.io",
    personarole: PERSONA_ROLE_DEVELOPER,
  },
  {
    personaname: "Christine",
    personatype: `${PERSONA_ROLE_STANARD} User`,
    personaimage: "/personas/persona3.png",
    personaemail: "user@launchmail.io",
    personarole: PERSONA_ROLE_STANARD,
  },
];
