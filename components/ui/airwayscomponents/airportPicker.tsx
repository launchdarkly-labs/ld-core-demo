import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import debounce from "lodash/debounce"; // Add this
import { Airports as airports } from "@/lib/airports";

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
    <div className="w-[427px] h-[275px] relative ">
      <div className="w-[427px] h-[285px] left-0 top-0 absolute bg-white rounded-[5px] shadow" />
      <button className="ml-auto absolute top-5 right-5 text-neutral-400" onClick={handleClose}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-800" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 1a9 9 0 100 18A9 9 0 0010 1zm4.95 12.95a.75.75 0 01-1.06 1.06L10 11.06l-3.89 3.89a.75.75 0 11-1.06-1.06L8.94 10 5.05 6.11a.75.75 0 111.06-1.06L10 8.94l3.89-3.89a.75.75 0 111.06 1.06L11.06 10l3.89 3.89z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="w-[321px] h-[173px] left-[53px] top-[51px] absolute flex-col justify-start items-start gap-[20px] inline-flex">

        <div className="px-[10px] justify-start items-start gap-0 inline-flex">
          <div className="text-neutral-800 text-[10px] font-medium font-sohne uppercase leading-[3px] tracking-widest">Search</div>
        </div>

        <div className="w-80 h-1 border-b-2 border-pink-500 justify-center mx-auto"></div>

        <div className="flex-col justify-start items-start gap-[15px] flex">
          <div className="flex-col justify-start items-start flex">
            <div className="w-[88px] flex-col justify-start items-start flex">
              <div className="text-neutral-500 text-base font-normal font-sohne leading-normal ">
                {activeField === "from" ? "Origin" : "Destination"}
              </div>
              <input
                className="w-[300px] h-[70px] text-zinc-500 text-[60px] font-normal font-sohne leading-[66.65px] outline-none"
                placeholder="Airport"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: "linear-gradient(to right, #F43F5E, #8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              />

              <div className="border-b-4 border-ldblue mb-2 text-white" />

            </div>
            <div className="w-80 h-1 border-b-2 border-purple-500 justify-center mx-auto"></div>

          </div>

          <div className="w-36 h-[21px] text-neutral-700 text-xs font-normal font-sohne leading-[18px] tracking-wide">
            {searchTerm && filteredAirports.length === 0 ? (
              <p>No airports found</p>
            ) : (
              searchTerm && (
                <ul>
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
      <div className="w-6 h-6 left-[390px] top-[14px] absolute" />
      <div className="w-6 h-6 left-[360.97px] top-[147px] absolute origin-top-left rotate-45"
      />
    </div>

  );
};

export default AirportPicker;