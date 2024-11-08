import { PlusSquare } from "lucide-react";
import { motion } from "framer-motion";
import { FederatedCheckingAccount } from "@/components/ui/bankcomponents/federatedChecking";
import { FederatedCreditAccount } from "@/components/ui/bankcomponents/federatedCredit";
import { useState } from "react";

export default function FederatedAccountModule() {
  const [federatedAccountOne, setFederatedAccountOne] = useState(false);
  const [federatedAccountTwo, setFederatedAccountTwo] = useState(false);
  const accountvariant = {
    hidden: { x: "100%" }, // start from the right side of the container
    visible: { x: 0 }, // animate back to the original position
    exit: { x: "100%" }, // exit to the right side of the container
  };

  const variants = {
    hidden: { scaleY: 0, originY: 1 }, // start from the base of the div
    visible: { scaleY: 1, originY: 1 }, // grow up to the top of the div
  };

  return (
    <section className="h-full w-full xl:w-[40%]  font-sohne rounded-xl  ">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={accountvariant}
        className=" p-6 gap-4 w-full h-full rounded-xl borde"
      >
        <p className="text-black font-sohne mb-6 text-[24px]">
          Federated account access
        </p>
        <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-x-4 justify-start">
          {!federatedAccountOne ? (
            <div
              onClick={() => setFederatedAccountOne(true)}
              className="flex p-4 h-[300px] w-full sm:w-1/2 bg-white items-center "
            >
              <PlusSquare size={96} className="text-gray-400 mx-auto" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={variants}
              transition={{ duration: 0.5 }}
              className="p-4 h-[300px] w-full sm:w-1/2 bg-white shadow-xl rounded-xl cursor-pointer"
            >
              <FederatedCheckingAccount />
            </motion.div>
          )}

          {!federatedAccountTwo ? (
            <div
              onClick={() => setFederatedAccountTwo(true)}
              className="flex p-4 h-[300px] w-full sm:w-1/2 bg-white items-center "
            >
              <PlusSquare size={96} className="text-gray-400 mx-auto" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={variants}
              transition={{ duration: 0.5 }}
              className="p-4 h-[300px] w-full sm:w-1/2 bg-white shadow-xl rounded-xl cursor-pointer"
            >
              <FederatedCreditAccount />
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
