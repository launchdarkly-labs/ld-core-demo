// PersonaContext.js
import React, { createContext, useState } from 'react';

export const PersonaContext = createContext<PersonaContextType | null>(null);

interface Persona {
  personaname: string;
  personatype: string;
  personaimage: string;
  personaemail: string;
  personarole: string;
}

interface PersonaContextType {
  personas: Persona[];
  error: any; // You can specify a more accurate type for error if possible
  getPersonas: () => void;
}

export const PersonaProvider = ({ children }) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
 
  const [error, setError] = useState(null);

  const getPersonas =  () => {

    const starterPersonas = [
      {
        personaname: "Cody",
        personatype: "Standard User",
        personaimage: "standard.jpg",
        personaemail: "cody@launchmail.io",
        personarole: "Standard"

      },
      {
        personaname: "Alysha",
        personatype: "Beta User",
        personaimage: "beta.png",
        personaemail: "alysha@launchmail.io",
        personarole: "Beta"

      },
      {
        personaname: "Jenn",
        personatype: "Developer",
        personaimage: "woman.png",
        personaemail: "jenn@launchmail.io",
        personarole: "Developer"
      },
    ]; 
    setPersonas(starterPersonas);
  }

  return (
    <PersonaContext.Provider value={{ personas, error, getPersonas }}>
      {children}
    </PersonaContext.Provider>
  );
};