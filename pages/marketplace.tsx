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
import { CSNav } from "@/components/ui/csnav";
import NavbarRightSideLinkWrapper from "@/components/ui/NavComponent/NavbarRightSideLinkWrapper";
import {
  NavbarSignUpButton,
} from "@/components/ui/NavComponent/NavbarSignUpInButton";
import { NAV_ELEMENTS_VARIANT } from "@/utils/constants";
import { StoreCart } from "@/components/ui/marketcomponents/stores/storecart";
import { MARKET } from "@/utils/constants";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";



import { VR_GALAXY_DATA, THE_BOOMIN_BOX_DATA, MACROCENTER_DATA } from "@/utils/constants";
import { useToast } from "@/components/ui/use-toast";


const badgesText = [
  "Accessories",
  "Gifts for devs",
  "Popular shops",
  "Best sellers",
  "Newest",
  "Top deals",
];

export default function Marketplace() {
  const [openVRGalaxy, setOpenVRGalaxy] = useState(false);
  const [openMacroCenter, setOpenMacroCenter] = useState(false);
  const [openBoominBox, setOpenBoominBox] = useState(false);
  const { isLoggedIn } = useContext(LoginContext);
  const { logLDMetricSent } = useContext(LiveLogsContext);


  const { toast } = useToast();

  {
    /* Step 1 code block */
  }

  const LDClient = useLDClient();
  const releaseNewSearchEngine = useFlags()["release-new-search-engine"];

  const [cart, setCart] = useState<InventoryItem[]>([]);

  const addToCart = (item: any) => {
    LDClient?.track("item-added", LDClient.getContext(), 1);
    logLDMetricSent("item-added");
    setCart([...cart, item]);
  };

  const handleOnSelect = (item: InventoryItem) => {
    let openShoppingCart: HTMLElement = document?.querySelector(
      ".shopping-cart-trigger"
    ) as HTMLElement;
    if (openShoppingCart && releaseNewSearchEngine) openShoppingCart.click();

    if (releaseNewSearchEngine) {
      addToCart(item);
      LDClient?.track("search-engine-add-to-cart", LDClient.getContext());
      logLDMetricSent("search-engine-add-to-cart");
      toast({
        title: `${item.item} has been added to your cart!`,
        wrapperStyle: "bg-gradient-experimentation text-white !text-medium font-bold font-sohne",
      });

      return;
    }

    if (item.vendor === "vrgalaxy") {
      setOpenVRGalaxy(true);
    }
    if (item.vendor === "macrocenter") {
      setOpenMacroCenter(true);
    }
    if (item.vendor === "boominbox") {
      setOpenBoominBox(true);
    }

    LDClient?.track("search-engine-add-to-cart", LDClient.getContext());
    logLDMetricSent("search-engine-add-to-cart");
  };

  const formatResult = (item: InventoryItem) => {
    return (
      <div className="flex justify-between gap-x-5 cursor-pointer items-center mr-4">
        <span className="w-full truncate">{item.item} </span>
        {releaseNewSearchEngine ? (
          <Button className="rounded-none bg-gradient-experimentation font-sohne hover:brightness-[120%] h-auto">
            Add To Cart
          </Button>
        ) : null}
      </div>
    );
  };

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

          <main className={`flex h-full bg-ldblack pb-20 text-white flex-col font-roboto`}>
          <header className="relative h-2/3 py-28 bg-gradient-experimentation-black grid items-center justify-center">
              <img src="elipse.png" className="absolute right-0 top-0" />
              <img src="union.png" className="absolute left-0 bottom-0" />
              <div className="flex flex-col text-center px-4 sm:mx-auto items-center ">
                <h1 className="flex justify-center items-center marketplace text-7xl mx-auto pb-8 w-full lg:w-1/2 font-audimat">
                  A galaxy of stores at your fingertips
                </h1>
                <div className="w-full sm:w-3/4 lg:w-1/2">
                  <ReactSearchAutocomplete
                    items={[...VR_GALAXY_DATA, ...THE_BOOMIN_BOX_DATA, ...MACROCENTER_DATA]}
                    onSelect={handleOnSelect}
                    autoFocus
                    formatResult={formatResult}
                    fuseOptions={{
                      shouldSort: true,
                      threshold: releaseNewSearchEngine ? 0.3 : 0.6, // 0.3 more precise, 0.6 less
                      location: 0,
                      distance: 100,
                      minMatchCharLength: 1,
                      keys: ["item"],
                    }}
                    resultStringKeyName="item"
                    placeholder="Browse a Galaxy of Storefronts"
                    styling={{}}
                    showClear={true}
                    className="z-10"
                  />
                </div>
                <div className="mt-4 sm:mt-6 gap-x-2 gap-y-4 sm:gap-y-0 grid grid-cols-3 sm:flex sm:grid-cols-0  ">
                  {badgesText.map((badgeText, index) => {
                    return (
                      <Badge
                        className="text-lg border-2 bg-transparent border-gray-500 text-ldlightgray justify-center"
                        key={index}
                      >
                        {badgeText}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </header>

            <section className="mx-8 sm:mx-12 xl:mx-auto pt-14 flex flex-col gap-y-10 px-10">
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
          </main>
        </motion.main>
        )
      </AnimatePresence>
    </>
  );
}