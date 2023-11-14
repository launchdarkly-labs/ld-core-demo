// TripsContext.js
import { createContext, useState } from 'react';

const TripsContext = createContext();

export default TripsContext;

// Continue in TripsContext.js
export const TripsProvider = ({ children }) => {
    const [bookedTrips, setBookedTrips] = useState([]);

    const cancelTrip = (index) => {
        setBookedTrips(prevTrips => {
          const newTrips = [...prevTrips];
          newTrips.splice(index, 1);
          return newTrips;
        });
      };
    
  
    return (
      <TripsContext.Provider value={{ bookedTrips, setBookedTrips, cancelTrip }}>
        {children}
      </TripsContext.Provider>
    );
  };
  