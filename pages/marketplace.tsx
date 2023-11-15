import { Inter } from "next/font/google";
import {
  ArrowRightCircle,
  CalendarIcon,
  MoveHorizontalIcon,
  Plane,
  Search,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import AirportPicker from "@/components/ui/airwayscomponents/airportPicker";
import { motion, useAnimation, useInView } from "framer-motion";
import TripsContext from "@/utils/contexts/TripContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { shopmore } from "@/components/ui/marketcomponents/shopmore";
import { useFlags } from "launchdarkly-react-client-sdk";
import { CSNav } from "@/components/ui/csnav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LoginScreen from "@/components/ui/marketcomponents/login";

export default function Marketplace() {
  const flags = useFlags();
  console.log(flags);

  const pageVariants = {
    initial: { x: "100%" },
    in: { x: 0 },
    out: { x: 0 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };


  
 

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="h-full"
    >
      <div className="flex h-20 bg-black shadow-2xl justify-between text-white font-audimat ">
        <div className="ml-4 flex items-center text-3xl">
          <CSNav />
          <p className="flex font-robotobold marketplace italic px-2">
            Galaxy Marketplace
          </p>
        </div>
        <div className="flex gap-x-8 mr-8 items-center">
          <Button className="px-12 text-lg rounded-none font-sohne bg-black border-2">
            Admin
          </Button>
          <LoginScreen />
        </div>
      </div>
      <main
        className={`flex h-full bg-ldblack pb-20 text-white flex-col font-roboto`}
      >
        <div className="relative h-2/3 py-28 bg-market-header grid items-center justify-center">
          <img src="elipse.png" className="absolute right-0 top-0" />
          <img src="union.png" className="absolute left-0 bottom-0" />
          <div className="grid w-2/3 text-center mx-auto">
            <p className="flex justify-center items-center market-header text-7xl mx-auto pb-8 font-audimat">
              A galaxy of stores at your fingertips
            </p>
            <div className="mx-auto w-3/4">
              <Input
                className="rounded-full text-black"
                placeholder="Browse a Galaxy of Storefronts"
              ></Input>
            </div>
            <div className="pt-4 space-x-2 space-y-2">
              <Badge className="text-lg  border-2 border-gray-500 text-ldlightgray bg-market-header">
                Accessories
              </Badge>
              <Badge className="text-lg bg-market-header border-2 border-gray-500 text-ldlightgray">
                Gifts for devs
              </Badge>
              <Badge className="text-lg bg-market-header border-2 border-gray-500 text-ldlightgray">
                Popular shops
              </Badge>
              <Badge className="text-lg bg-market-header border-2 border-gray-500 text-ldlightgray">
                Best sellers
              </Badge>
              <Badge className="text-lg bg-market-header border-2 border-gray-500 text-ldlightgray">
                Newest
              </Badge>
              <Badge className="text-lg bg-market-header border-2 border-gray-500 text-ldlightgray">
                Top deals
              </Badge>
            </div>
          </div>
        </div>
        <div className="mx-52 pt-14 ">
          <div className="space-y-16">
            <div>
              <div className="flex justify-between items-center pb-10">
                <div>
                  <p className="shoptext text-xl">Popular Shops</p>
                </div>
                <div>
                  <Button className="rounded-full text-xl bg-ldblack border-2 border-gray-500 text-ldlightgray">
                    Search Popular
                  </Button>
                </div>
              </div>
              <div className="grid xl:flex flex-row space-x-20 mx-auto justify-center">

              <SheetTrigger<>
              <shopmore  />


                <div>
                  <img src="computers.png" className="h-[300px]" />
                </div>
                <div>
                  <img src="electronics.png" className="h-[300px]" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center pb-10">
                <div>
                  <p className="shoptext">Shop By Category</p>
                </div>
                <div>
                  <Button className="rounded-full text-xl bg-ldblack border-2 border-gray-500 text-ldlightgray">
                    Search Categories
                  </Button>
                </div>
              </div>
              <div className="grid xl:flex flex-row space-x-10 xl:space-x-20 mx-auto justify-center">
                <div>
                  <img src="Hardware.png" className="h-[300px]" />
                </div>
                <div>
                  <img src="smarthome.png" className="h-[300px]" />
                </div>
                <div>
                  <img src="networking.png" className="h-[300px]" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center pb-10">
                <div>
                  <p className="shoptext">Trending Now</p>
                </div>
                <div>
                  <Button className="rounded-full text-xl bg-ldblack border-2 border-gray-500 text-ldlightgray">
                    Search Trending
                  </Button>
                </div>
              </div>
              <div className="grid xl:flex flex-row space-x-20 mx-auto justify-center">
                <div>
                  <img src="software.png" className="h-[300px]" />
                </div>
                <div>
                  <img src="makers.png" className="h-[300px]" />
                </div>
                <div>
                  <img src="toys.png" className="h-[300px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
