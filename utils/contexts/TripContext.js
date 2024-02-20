// TripsContext.js
import { createContext, useEffect, useState } from 'react';

const TripsContext = createContext();

export default TripsContext;

// Continue in TripsContext.js
export const TripsProvider = ({ children }) => {
    const [bookedTrips, setBookedTrips] = useState([{
        airplane: "a380",
        depart: "12/1/2023",
        from: "DXB",
        fromCity: "Dubai",
        id: 906,
        to: "SFO",
        toCity: "San Francisco",
        type: "Outbound"
    },{
      airplane: "a380",
      depart: "12/8/2023",
      from: "SFO",
      fromCity: "San Francisco",
      id: 842,
      to: "DXB",
      toCity: "Dubai",
      type: "Outbound"
  }]);

    
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
  