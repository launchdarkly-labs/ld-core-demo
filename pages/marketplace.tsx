
import { useEffect, useRef, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NavBar from "@/components/ui/navbar";
import { MacroCenter } from "@/components/ui/marketcomponents/stores/MacroCenter";
import { VRgalaxy } from "@/components/ui/marketcomponents/stores/vrgalaxy";
import { TheBoominBox } from "@/components/ui/marketcomponents/stores/TheBoominBox";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import LoginContext from "@/utils/contexts/login";
import LoginHomePage from "@/components/LoginHomePage";
import { setCookie } from "cookies-next";



export default function Marketplace() {
  const [headerLabel, setHeaderLabel] = useState<string>("");
  const [products, setProducts] = useState([]);
  const [openVRGalaxy, setOpenVRGalaxy] = useState(false);
  const [openMacroCenter, setOpenMacroCenter] = useState(false);
  const [openBoominBox, setOpenBoominBox] = useState(false);
  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser } =
    useContext(LoginContext);

  const LDClient = useLDClient();
  const flags = useFlags();
  const { storeAttentionCallout, storeHeaders } = useFlags();

  interface InventoryItem {
    id: string | number;
    item: string;
    cost: number;
    vendor: string;
  }
  const [cart, setCart] = useState<InventoryItem[]>([]);


  const addToCart = (item: any) => {

    LDClient?.track("item-added", LDClient.getContext(), 1);

    setCart([...cart, item]);
  };

  const storeAccessed = () => {
    LDClient?.track("item-accessed", LDClient.getContext(), 1);

  };


  useEffect(() => {
    fetch("/api/storeInventory?storename=all")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

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

  function handleLogout() {
    logoutUser();
    const context: any = LDClient?.getContext();
    context.user.tier = null;
    LDClient?.identify(context);
    setCookie("ldcontext", context);
  }

    useEffect(() => {
      if (isLoggedIn) {
        storeAccessed();
      }
    }, [isLoggedIn]);


  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <LoginHomePage variant="market" name="Galaxy Marketplace" />) : (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className=""
          >
            <NavBar cart={cart} setCart={setCart} variant={"market"} handleLogout={handleLogout} />
            <main className={`flex h-full bg-ldblack pb-20 text-white flex-col font-roboto`}>
              <header className="relative h-2/3 py-28 bg-market-header grid items-center justify-center">
                <img src="elipse.png" className="absolute right-0 top-0" />
                <img src="union.png" className="absolute left-0 bottom-0" />
                <div className="flex flex-col text-center px-4 sm:mx-auto items-center ">
                  <h1 className="flex justify-center items-center market-header marketplace text-7xl mx-auto pb-8 w-full lg:w-1/2 font-audimat">
                    A galaxy of stores at your fingertips
                  </h1>
                  <div className="w-full sm:w-3/4 lg:w-1/2">
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
                    <Badge className="text-lg border-2 border-gray-500 text-ldlightgray bg-market-header">
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

              <div className="mx-8 sm:mx-12 xl:mx-auto pt-14 ">
                <div className="space-y-16">
                  <div>
                    {/* Popular Shops heading and row */}

                    <div className="flex justify-between pb-10">
                      <div>
                        <p className="shoptext text-xl">Popular Shops</p>
                      </div>
                      <div>
                        <Button className="rounded-full text-xl bg-ldblack border-2 border-gray-500 text-ldlightgray h-full">
                          Search Popular
                        </Button>
                      </div>
                    </div>

                    {/* Store individual callouts */}
                    {/* Individual callouts can be found components/ui/marketcomponents/stores */}
                    <div className="flex flex-col lg:flex-row gap-20 justify-between items-center">
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

                      <div className="prodcard">
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
                        <Button className="rounded-full text-xl h-full bg-ldblack border-2 border-gray-500 text-ldlightgray">
                          Search Categories
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 justify-between items-center">
                      <div>
                        <img src="Hardware.png" className="h-[300px] sm:h-[350px]" />
                      </div>
                      <div>
                        <img src="smarthome.png" className="h-[300px] sm:h-[350px]" />
                      </div>
                      <div>
                        <img src="networking.png" className="h-[300px] sm:h-[350px]" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center pb-10">
                      <div>
                        <p className="shoptext">Trending Now</p>
                      </div>
                      <div>
                        <Button className="rounded-full text-xl h-full bg-ldblack border-2 border-gray-500 text-ldlightgray">
                          Search Trending
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-20 justify-between items-center">
                      <div>
                        <img src="software.png" className="h-[300px] sm:h-[350px]" />
                      </div>
                      <div>
                        <img src="makers.png" className="h-[300px] sm:h-[350px]" />
                      </div>
                      <div>
                        <img src="toys.png" className="h-[300px] sm:h-[350px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
