import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MacroCenter } from "@/components/ui/marketcomponents/stores/MacroCenter";
import { VRGalaxy } from "@/components/ui/marketcomponents/stores/vrgalaxy";
import { TheBoominBox } from "@/components/ui/marketcomponents/stores/TheBoominBox";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import LoginContext from "@/utils/contexts/login";
import { InventoryItem } from "@/utils/typesInterface";
import NavWrapper from "@/components/ui/NavComponent/NavWrapper";
import CSNavWrapper from "@/components/ui/NavComponent/CSNavWrapper";
import NavLogo from "@/components/ui/NavComponent/NavLogo";
import NavbarLeftSideWrapper from "@/components/ui/NavComponent/NavbarLeftSideWrapper";
import NavLinkButton from "@/components/ui/NavComponent/NavLinkButton";
import NavbarRightSideWrapper from "@/components/ui/NavComponent/NavbarRightSideWrapper";
import NavbarLogin from "@/components/ui/NavComponent/NavbarLogin";
import NavbarDropdownMenu from "@/components/ui/NavComponent/NavbarDropdownMenu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import NavbarDropdownMenuItemWrapper from "@/components/ui/NavComponent/NavbarDropdownMenuItemWrapper";
import { CSNav } from "@/components/ui/csnav";
import NavbarLeftSideLinkWrapper from "@/components/ui/NavComponent/NavbarLeftSideLinkWrapper";
import NavbarRightSideLinkWrapper from "@/components/ui/NavComponent/NavbarRightSideLinkWrapper";
import {
  NavbarSignInButton,
  NavbarSignUpButton,
} from "@/components/ui/NavComponent/NavbarSignUpInButton";
import { NAV_ELEMENTS_VARIANT } from "@/utils/constants";
import { StoreCart } from "@/components/ui/marketcomponents/stores/storecart";
import { MARKET } from "@/utils/constants";

export default function Marketplace() {
  const [headerLabel, setHeaderLabel] = useState<string>("");
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [openVRGalaxy, setOpenVRGalaxy] = useState(false);
  const [openMacroCenter, setOpenMacroCenter] = useState(false);
  const [openBoominBox, setOpenBoominBox] = useState(false);
  const { isLoggedIn } = useContext(LoginContext);

  {
    /* Step 1 code block */
  }

  const LDClient = useLDClient();
  const { storeAttentionCallout } = useFlags();

  {
    /* Step 1 code block */
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
    const data: InventoryItem[] = [
      {
        id: 1,
        vendor: "vrgalaxy",
        item: "VR Headset - Advanced Model",
        cost: "499.99",
      },
      {
        id: 2,
        vendor: "vrgalaxy",
        item: "Wireless VR Controllers (Pair)",
        cost: "119.99",
      },
      {
        id: 3,
        vendor: "vrgalaxy",
        item: "VR Treadmill for Immersive Movement",
        cost: "899.99",
      },
      {
        id: 4,
        vendor: "vrgalaxy",
        item: "Haptic Feedback Gloves",
        cost: "259.99",
      },
      {
        id: 5,
        vendor: "vrgalaxy",
        item: "Virtual Reality Game - Space Adventure",
        cost: "59.99",
      },
      {
        id: 6,
        vendor: "vrgalaxy",
        item: "VR Headset Cleaning Kit",
        cost: "29.99",
      },
      {
        id: 7,
        vendor: "vrgalaxy",
        item: "360° VR Camera",
        cost: "349.99",
      },
      {
        id: 8,
        vendor: "vrgalaxy",
        item: "Virtual Reality Development Software",
        cost: "199.99",
      },
      {
        id: 9,
        vendor: "vrgalaxy",
        item: "Adjustable VR Headset Stand",
        cost: "39.99",
      },
      {
        id: 10,
        vendor: "vrgalaxy",
        item: "Virtual Reality Experience Ticket - Underwater World",
        cost: "14.99",
      },
      {
        id: 11,
        vendor: "macrocenter",
        item: "High-Performance Graphics Card - 8GB",
        cost: "699.99",
      },
      {
        id: 12,
        vendor: "macrocenter",
        item: "Gaming Motherboard - RGB Lighting",
        cost: "259.99",
      },
      {
        id: 13,
        vendor: "macrocenter",
        item: "Solid State Drive (SSD) - 1TB",
        cost: "129.99",
      },
      {
        id: 14,
        vendor: "macrocenter",
        item: "DDR4 RAM - 16GB Kit (2x8GB)",
        cost: "89.99",
      },
      {
        id: 15,
        vendor: "macrocenter",
        item: "Modular Power Supply - 750W",
        cost: "119.99",
      },
      {
        id: 16,
        vendor: "macrocenter",
        item: "CPU Cooler - Liquid Cooling System",
        cost: "139.99",
      },
      {
        id: 17,
        vendor: "macrocenter",
        item: "Full-Tower PC Case - Tempered Glass",
        cost: "199.99",
      },
      {
        id: 18,
        vendor: "macrocenter",
        item: "Wireless Gaming Keyboard and Mouse Combo",
        cost: "99.99",
      },
      {
        id: 19,
        vendor: "macrocenter",
        item: "27-inch Gaming Monitor - 144Hz",
        cost: "329.99",
      },
      {
        id: 20,
        vendor: "macrocenter",
        item: "Internal Sound Card - 7.1 Surround",
        cost: "79.99",
      },
      {
        id: 21,
        vendor: "boominbox",
        item: "VR Headset - Advanced Model",
        cost: "499.99",
      },
      {
        id: 22,
        vendor: "boominbox",
        item: "Bluetooth Noise-Canceling Headphones",
        cost: "299.99",
      },
      {
        id: 23,
        vendor: "boominbox",
        item: "Wireless Earbuds - Waterproof Edition",
        cost: "159.99",
      },
      {
        id: 24,
        vendor: "boominbox",
        item: "High-Fidelity Turntable",
        cost: "349.99",
      },
      {
        id: 25,
        vendor: "boominbox",
        item: "Portable Bluetooth Speaker - Rugged Design",
        cost: "119.99",
      },
      {
        id: 26,
        vendor: "boominbox",
        item: "Studio Monitor Speakers (Pair)",
        cost: "499.99",
      },
      {
        id: 27,
        vendor: "boominbox",
        item: "Multi-Channel Home Theater System",
        cost: "999.99",
      },
      {
        id: 28,
        vendor: "boominbox",
        item: "Digital Audio Interface - Pro Series",
        cost: "229.99",
      },
      {
        id: 29,
        vendor: "boominbox",
        item: "Smart Home Sound System with Voice Control",
        cost: "399.99",
      },
      {
        id: 30,
        vendor: "boominbox",
        item: "Professional DJ Mixer",
        cost: "699.99",
      },
    ];
    setProducts(data);
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

  useEffect(() => {
    if (isLoggedIn) {
      storeAccessed();
    }
  }, [isLoggedIn]);

  return (
    <>
      <Toaster />
      <AnimatePresence mode="wait">
        (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-ldblack w-full"
        >
          <NavWrapper>
            <>
              <CSNavWrapper>
                <CSNav />
              </CSNavWrapper>

              <NavLogo srcHref={NAV_ELEMENTS_VARIANT[MARKET]?.logoImg?.src} altText={MARKET} />

              <NavbarDropdownMenu>
                <>
                  {NAV_ELEMENTS_VARIANT[MARKET]?.navLinks.map((navLink, index) => {
                    return (
                      <DropdownMenuItem href={navLink?.href} key={index}>
                        {navLink?.text}
                      </DropdownMenuItem>
                    );
                  })}
                </>
              </NavbarDropdownMenu>

              {/* left side navbar template */}

              <NavbarLeftSideWrapper>
                <>
                  {NAV_ELEMENTS_VARIANT[MARKET]?.navLinks.map((navLink, index) => {
                    return (
                      <NavLinkButton
                        text={navLink?.text}
                        href={navLink?.href}
                        navLinkColor={NAV_ELEMENTS_VARIANT[MARKET]?.navLinkColor}
                        index={index}
                        key={index}
                      />
                    );
                  })}
                </>
              </NavbarLeftSideWrapper>

              {/* right side navbar template */}
              <NavbarRightSideWrapper>
                <>
                  {!isLoggedIn && (
                    <>
                      <NavbarSignUpButton backgroundColor="bg-gradient-experimentation" />
                    </>
                  )}

                  <>
                    <NavbarRightSideLinkWrapper>
                      <StoreCart cart={cart} setCart={setCart} />
                    </NavbarRightSideLinkWrapper>
                  </>

                  <NavbarLogin variant={MARKET} />
                </>
              </NavbarRightSideWrapper>
            </>
          </NavWrapper>

          <section className={`flex h-full bg-ldblack pb-20 text-white flex-col font-roboto`}>
            <section className="relative h-2/3 py-28 bg-gradient-experimentation-black grid items-center justify-center">
              <img src="elipse.png" className="absolute right-0 top-0" />
              <img src="union.png" className="absolute left-0 bottom-0" />
              <div className="flex flex-col text-center px-4 sm:mx-auto items-center ">
                <h1 className="flex justify-center items-center marketplace text-7xl mx-auto pb-8 w-full lg:w-1/2 font-audimat">
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
                  <Badge className="text-lg border-2 bg-transparent border-gray-500 text-ldlightgray">
                    Accessories
                  </Badge>
                  <Badge className="text-lg border-2 bg-transparent border-gray-500 text-ldlightgray">
                    Gifts for devs
                  </Badge>
                  <Badge className="text-lg border-2 bg-transparent border-gray-500 text-ldlightgray">
                    Popular shops
                  </Badge>
                  <Badge className="text-lg border-2 bg-transparent border-gray-500 text-ldlightgray">
                    Best sellers
                  </Badge>
                  <Badge className="text-lg border-2 bg-transparent border-gray-500 text-ldlightgray">
                    Newest
                  </Badge>
                  <Badge className="text-lg border-2 bg-transparent border-gray-500 text-ldlightgray">
                    Top deals
                  </Badge>
                </div>
              </div>
            </section>

            <section className="mx-8 sm:mx-12 xl:mx-auto pt-14 ">
              <section>
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
                    <VRGalaxy addToCart={addToCart} open={openVRGalaxy} setOpen={setOpenVRGalaxy} />
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
              </section>

              {/* Categories header +*/}

              <section>
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
              </section>
              <section>
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
              </section>
            </section>
          </section>
        </motion.main>
        )
      </AnimatePresence>
    </>
  );
}
