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
}) => {
  return (
    <motion.div
      initial={{ scale: 0.25, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={``}
    >
      <div className={`grid grid-cols-3 items-center gap-x-6 justify-between relative ${showSearch ? "" : ""}`}>
        <div className=" text-center grid col-start-1">
          <button
            onClick={() => {
              setActiveField("from");
              setShowSearch(true);
            }}
          >
            <p className="text-6xl md:text-4xl xl:text-6xl font-audimat py-2 ">{fromLocation}</p>
          </button>
          <p className="text-center text-xs font-audimat uppercase">Origin</p>
        </div>
        <MoveHorizontalIcon className="h-14 w-14 text-marketblue grid col-start-2 mx-auto" />
        <div className="relative text-center grid col-start-3">
          <button
            onClick={() => {
              setActiveField("to");
              setShowSearch(true);
            }}
            className=""
          >
            <p className="text-6xl md:text-4xl xl:text-6xl font-audimat py-2 ">{toLocation}</p>
          </button>
          <p className="text-center text-xs font-audimat uppercase">Destination</p>
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
