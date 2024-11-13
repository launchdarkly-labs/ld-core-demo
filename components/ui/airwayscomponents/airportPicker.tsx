import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import debounce from "lodash/debounce"; // Add this
import { Airports as airports } from "@/lib/airports";
import { XIcon } from "lucide-react";

interface AirportPickerProps {
  setFromLocation: (location: string) => void;
  setToLocation: (location: string) => void;
  setShowSearch: (show: boolean) => void;
  setFromCity: any;
  setToCity: any;
  activeField: "from" | "to";
  toLocation: string;
  fromLocation: string;
}

export interface Airport {
  id: number;
  cityName: string;
  airportCode: string;
  country: string;
}

const AirportPicker: React.FC<AirportPickerProps> = ({
  setFromLocation,
  setFromCity,
  setToLocation,
  setToCity,
  setShowSearch,
  activeField,
  toLocation,
  fromLocation,
  toCity,
  fromCity
}) => {
  // const [airports, setAirports] = useState<Airport[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showMap, setShowMap] = useState(false);

  const filterAirports = debounce(() => {
    const filtered = airports.filter(
      (airport) =>
        airport.cityName.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        airport.airportCode.toLowerCase()?.includes(searchTerm.toLowerCase())
    );
    setFilteredAirports(filtered);
  }, 250);

  useEffect(() => {
    filterAirports();
    // Cleanup debounce function on unmount
    return filterAirports.cancel;
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSearch, containerRef]); // Add dependencies here

  const handleSelect = (airport: Airport) => {
    setSelectedAirport(airport);
    if (activeField === "from" && airport.cityName !== toLocation) {
      setFromLocation(airport.airportCode);
      setFromCity(airport.cityName);
    } else if (activeField === "to" && airport.cityName !== fromLocation) {
      setToLocation(airport.airportCode);
      setToCity(airport.cityName);
    }
    setShowSearch(false);
    setShowMap(true); // Add this line
  };

  const handleClose = () => {
    setShowSearch(false);
  };

  return (
    <div
      className={`w-[70%] sm:w-[430px] bg-white rounded-md shadow-md absolute
     z-20 mt-4 p-[.2rem] sm:p-[1rem] font-sohne font-normal  ${
       activeField === "from" ? "" : "right-[13%]"
     }`}
    >
      <button
        className="cursor-pointer h-7 w-7 float-right mt-2 mr-2 sm:mt-1 sm:mr-1"
        onClick={handleClose}
      >
        <XIcon className="cursor-pointer h-full w-full text-neutral-400 " />
      </button>
      <div className="m-6 flex flex-col gap-y-6">
        <div className="">
          <div className="text-black text-sm font-medium uppercase tracking-widest w-[7rem] pb-2 border-pink-500 text-center ">
            Search
          </div>
          <div className="w-full h-1 border-b-2 border-[#3DD6F5] justify-center mx-auto"></div>
        </div>

        <div className="flex-col justify-start items-start flex">
          <div className="flex-col justify-start items-start flex">
            <div className="text-neutral-500 text-base leading-normal mb-2 ">
              {activeField === "from" ? "Origin" : "Destination"}
            </div>
            <input
              className="w-full text-black text-3xl  
                 leading-[66.65px] outline-none border-b-2 border-[#405BFF]"
              placeholder="Airport"
              value={searchTerm}
              autoFocus
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "linear-gradient(224.68deg, #405BFF -5.3%, #3DD6F5 112.86%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            />
          </div>

          <div className="w-full h-full text-black text-base  leading-[18px] tracking-widest">
            {searchTerm && filteredAirports.length === 0 ? (
              <p>No airports found</p>
            ) : (
              searchTerm && (
                <ul className="grid space-y-2">
                  {filteredAirports.slice(0, 3).map((airport, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelect(airport)}
                      className="cursor-pointer hover:bg-gradient-airways bg-clip-text hover:text-transparent  hover:font-bold"
                    >
                      {airport.cityName} ({airport.airportCode})
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirportPicker;
