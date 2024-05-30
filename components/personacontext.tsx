// PersonaContext.js
import React, { createContext, useState, useEffect } from 'react';
import {STARTER_PERSONAS} from '@/utils/contexts/StarterUserPersonas'

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
    setPersonas(STARTER_PERSONAS);
  }

  return (
    <PersonaContext.Provider value={{ personas, error, getPersonas }}>
      {children}
    </PersonaContext.Provider>
  );
};