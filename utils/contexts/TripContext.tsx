// TripsContext.js
import { createContext, useState} from "react";
import { BookedTrips } from "../typescriptTypesInterfaceIndustry";

type TripsContextTypes = {
  bookedTrips: BookedTrips[];
  setBookedTrips: () => React.Dispatch<React.SetStateAction<BookedTrips[]>>;
  cancelTrip: (index: number) => void;
};

const TripsContext = createContext<TripsContextTypes>({
  bookedTrips: [{
    airplane: "",
    depart: "",
    from: "",
    fromCity: "",
    id: 1,
    to: "",
    toCity: "",
    type: "",
  }],
  setBookedTrips:()=>{return useState<BookedTrips[]>},
  cancelTrip:()=>{}
});

export default TripsContext;

// Continue in TripsContext.js
export const TripsProvider = ({ children }: { children: any }) => {
  const [bookedTrips, setBookedTrips] = useState<BookedTrips[]>([
    {
      airplane: "a380",
      depart: "12/1/2023",
      from: "DXB",
      fromCity: "Dubai",
      id: 906,
      to: "SFO",
      toCity: "San Francisco",
      type: "Outbound",
    },
    {
      airplane: "a380",
      depart: "12/8/2023",
      from: "SFO",
      fromCity: "San Francisco",
      id: 842,
      to: "DXB",
      toCity: "Dubai",
      type: "Outbound",
    },
  ]);

  const cancelTrip = (index: number): void => {
    setBookedTrips((prevTrips) => {
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
