import React from "react";
import { motion } from "framer-motion";
import { MoveHorizontalIcon } from "lucide-react";
import AirportPicker from "./airportPicker";

const AirlineDestination = ({
  setActiveField,
  setShowSearch,
  fromLocation,
  setFromCity,
  toLocation,
  showSearch,
  activeField,
  setToLocation,
  setToCity,
  setFromLocation,
  toCity,
  fromCity,
}: {
  setActiveField: any;
  setShowSearch: any;
  setFromCity: any;
  fromLocation: string;
  toLocation: string;
  showSearch: boolean;
  activeField: any;
  setToLocation: any;
  setToCity: any;
  setFromLocation: any;
  toCity: string;
  fromCity: string;
}) => {
  return (
    <motion.div
      initial={{ scale: 0.25, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={`w-full`}
    >
      <div className={`flex items-center gap-x-6 justify-between relative ${showSearch ? "" : ""}`}>
        <div className=" text-center grid col-start-1">
          <button
            onClick={() => {
              setActiveField("from");
              setShowSearch(true);
            }}
          >
            <p className="font-audimat py-2 bg-transparent bg-gradient-airways-2 text-transparent bg-clip-text text-3xl sm:text-5xl">
              {fromLocation}
            </p>
          </button>
          <p className="text-center text-xs sm:text-sm xl:text-base ">{fromCity}</p>
        </div>
        <img src="./airline/moveHorizontalArrow.svg" alt="move horizontal arrow "  className="text-airlinegray"/>

        <div className="relative text-center grid col-start-3">
          <button
            onClick={() => {
              setActiveField("to");
              setShowSearch(true);
            }}
            className=""
          >
            <p className="font-audimat py-2 bg-transparent bg-gradient-airways-2 text-transparent bg-clip-text text-3xl sm:text-5xl">
              {toLocation}
            </p>
          </button>
          <p className="text-center text-xs sm:text-sm xl:text-base ">{toCity}</p>
        </div>
      </div>

      {showSearch && activeField && (
        <>
          <AirportPicker
            setToLocation={setToLocation}
            setFromLocation={setFromLocation}
            setFromCity={setFromCity}
            setShowSearch={setShowSearch}
            activeField={activeField}
            toLocation={toLocation}
            setToCity={setToCity}
            fromLocation={fromLocation}
          />
        </>
      )}
    </motion.div>
  );
};

export default AirlineDestination;
