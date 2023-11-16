import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import debounce from "lodash/debounce"; // Add this
import { Airports as airports } from "@/lib/airports";
import { XIcon } from "lucide-react";

interface AirportPickerProps {
  setFromLocation: (location: string) => void;
  setToLocation: (location: string) => void;
  setShowSearch: (show: boolean) => void;
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
  setToLocation,
  setShowSearch,
  activeField,
  toLocation,
  fromLocation,
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
        airport.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.airportCode.toLowerCase().includes(searchTerm.toLowerCase())
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
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
    } else if (activeField === "to" && airport.cityName !== fromLocation) {
      setToLocation(airport.airportCode);
    }
    setShowSearch(false);
    setShowMap(true); // Add this line
  };

  const handleClose = () => {
    setShowSearch(false);
  };

  return (
    <div className="w-[427px] h-[275px] bg-white rounded-md shadow-md absolute z-20 mt-4 p-[1rem] font-sohne font-normal ">
      <button className="cursor-pointer h-7 w-7 float-right" onClick={handleClose}>
        <XIcon className="cursor-pointer h-full w-full text-neutral-400 " />
      </button>
      <div className="m-6 flex flex-col gap-y-6">
        <div className="">
          <div className="text-airlineBlack text-sm font-medium uppercase tracking-widest border-b-4 pb-2 w-[7rem] border-pink-500 text-center ">
            Search
          </div>
          <div className="w-full border-b-2 border-neutral-300"/>
        </div>

        <div className="flex-col justify-start items-start gap-[15px] flex">
          <div className="flex-col justify-start items-start flex">
            <div className="text-neutral-500 text-base leading-normal mb-2 ">
              {activeField === "from" ? "Origin" : "Destination"}
            </div>
            <input
              className="w-full text-airlineBlack text-[60px]  
                 leading-[66.65px] outline-none border-b-2 border-airlineBlack pb-4"
              placeholder="Airport"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full text-airlineBlack text-base  leading-[18px] tracking-wide">
            {searchTerm && filteredAirports.length === 0 ? (
              <p>No airports found</p>
            ) : (
              searchTerm && (
                <ul className="flex flex-row">
                  {filteredAirports.slice(0, 3).map((airport, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelect(airport)}
                      className="cursor-pointer hover:text-purple-500 hover:font-bold hover:border-purple-500"
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
