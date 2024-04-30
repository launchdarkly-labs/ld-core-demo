// PersonaContext.js
import React, { createContext, useState, useEffect } from 'react';

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
        personarole: "Standard",
        personaemail: "cody@launchmail.io",
      },
      {
        personaname: "Alysha",
        personatype: "Beta User",
        personaimage: "beta.png",
        personarole: "Beta",
        personaemail: "alysha@launchmail.io",
      },
      {
        personaname: "Jenn",
        personatype: "Developer",
        personaimage: "woman.png",
        personarole: "Developer",
        personaemail: "jenn@launchmail.io",
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