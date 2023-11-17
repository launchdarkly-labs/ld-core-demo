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
} from "@/components/ui/sheet";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { CSNav } from "@/components/ui/csnav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LoginScreen from "@/components/ui/marketcomponents/login";
import NavBar from "@/components/ui/navbar";
import { MacroCenter } from "@/components/ui/marketcomponents/stores/MacroCenter";
import { VRgalaxy } from "@/components/ui/marketcomponents/stores/vrgalaxy";
import { TheBoominBox } from "@/components/ui/marketcomponents/stores/TheBoominBox";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { is } from "drizzle-orm";


export default function Marketplace() {
  const [cart, setCart] = useState([]);
  const [headerLabel, setHeaderLabel] = useState<string>("");
  const [products, setProducts] = useState([]);
  const [openVRGalaxy, setOpenVRGalaxy] = useState(false);
  const [openMacroCenter, setOpenMacroCenter] = useState(false);
  const [openBoominBox, setOpenBoominBox] = useState(false);

  const LDClient = useLDClient();
  const flags = useFlags();
  const { storeAttentionCallout, storeHeaders } = useFlags();

  interface InventoryItem {
    id: string | number;
    item: string;
    cost: number;
    vendor: string;
  }

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

  const addToCart = (item: any) => {
    console.log("Adding Item to Store");
    LDClient?.track("item-added", LDClient.getContext(), 1);
    console.log("Adding");
    setCart([...cart, item]);
  };

  useEffect(() => {
    fetch("/api/storeInventory?storename=all")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  useEffect(() => {
    setHeaderLabel(storeAttentionCallout);
  }, [storeAttentionCallout]);

  const handleOnSelect = (item: InventoryItem) => {
    if (item.vendor === "vrgalaxy") {
      setOpenVRGalaxy(true);
    }
    if (item.vendor === "macrocenter") {
      setOpenMacroCenter(true);
    }
    if (item.vendor === "boominbox") {
      setOpenBoominBox(true);
    }
  };

  const formatResult = (item: InventoryItem) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.item}</span>
      </>
    );
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
      <NavBar cart={cart} setCart={setCart} variant={"market"} />
      <main
        className={`flex h-full bg-ldblack pb-20 text-white flex-col font-roboto`}
      >
        <header className="relative h-2/3 py-28 bg-market-header grid items-center justify-center">
          <img src="elipse.png" className="absolute right-0 top-0" />
          <img src="union.png" className="absolute left-0 bottom-0" />
          <div className="flex flex-col text-center px-4 sm:mx-auto items-center ">
            <h1 className="flex justify-center items-center market-header text-7xl mx-auto pb-8 font-audimat">
              A galaxy of stores at your fingertips
            </h1>
            <div className="w-full sm:w-3/4">
              <ReactSearchAutocomplete
                items={products}
                onSelect={handleOnSelect}
                autoFocus
                formatResult={formatResult}
                fuseOptions={{ keys: ["item"] }}
                resultStringKeyName="item"
                placeholder="Browse a Galaxy of Storefronts"
              />
            </div>
            <div className="mt-4 sm:mt-6 gap-x-2 gap-y-4 sm:gap-y-0 grid grid-cols-3 sm:flex sm:grid-cols-0  ">
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
        </header>

        <div className="mx-24 3xl:mx-52 pt-14 ">
          <div className="space-y-16">
            <div>

{/* Popular Shops heading and row */}


            <div className="flex justify-between items-center pb-10">
                <div>
                  <p className="shoptext text-xl mx-20">Popular Shops</p>
                </div>
                <div>
                  <Button className="rounded-full text-xl bg-ldblack border-2 border-gray-500 text-ldlightgray mx-20">
                    Search Popular
                  </Button>
                </div>
              </div>

                {/* Store individual callouts */}
                {/* Individual callouts can be found components/ui/marketcomponents/stores */}
                <div className="flex grid xl:flex flex-row gap-20 justify-between">
                  
                <div className="prodcard">
                  <VRgalaxy
                    storeHeaders={storeHeaders}
                    headerLabel={headerLabel}
                    addToCart={addToCart}
                    open={openVRGalaxy}
                    setOpen={setOpenVRGalaxy}
                  />
                </div>

                <div className="prodcard">
                  <MacroCenter
                    addToCart={addToCart}
                    open={openMacroCenter}
                    setOpen={setOpenMacroCenter}
                  />
                </div>

                <div className="prodcard" >
                  <TheBoominBox
                    addToCart={addToCart}
                    open={openBoominBox}
                    setOpen={setOpenBoominBox}
                  />
                </div>
              </div>
            </div>

            {/* Categories header +*/}

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


              <div className="flex grid xl:flex flex-row gap-20 justify-between">
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
