import React from "react";
import { motion } from "framer-motion";
import { MoveHorizontalIcon } from "lucide-react";
import AirportPicker from "./airportPicker";

const AirlineDestination = ({
  setActiveField,
  setShowSearch,
  fromLocation,
  toLocation,
  showSearch,
  activeField,
  setToLocation,
  setFromLocation,
}: {
  setActiveField: any;
  setShowSearch: any;
  fromLocation: string;
  toLocation: string;
  showSearch: boolean;
  activeField: any;
  setToLocation: any;
  setFromLocation: any;
}) => {
  return (
    <motion.div
      initial={{ scale: 0.25, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-x-6"
    >
      <div className="relative">
        <button
          onClick={() => {
            setActiveField("from");
            setShowSearch(true);
          }}
        >
          <p className="text-3xl md:text-4xl xl:text-6xl font-audimat px-4 py-2 ">{fromLocation}</p>
        </button>
        <p className="text-center text-xs font-audimat uppercase">Origin</p>
      </div>
      <MoveHorizontalIcon className="h-10 w-10 text-marketblue" />
      <div className="relative">
        <button
          onClick={() => {
            setActiveField("to");
            setShowSearch(true);
          }}
        >
          <p className="text-3xl md:text-4xl xl:text-6xl font-audimat  px-4   py-2 ">
            {toLocation}
          </p>
        </button>
        <p className="text-center text-xs font-audimat uppercase">Destination</p>
      </div>
      {showSearch && activeField && (
        <AirportPicker
          setToLocation={setToLocation}
          setFromLocation={setFromLocation}
          setShowSearch={setShowSearch}
          activeField={activeField}
          toLocation={toLocation}
          fromLocation={fromLocation}
        />
      )}
    </motion.div>
  );
};

export default AirlineDestination;
