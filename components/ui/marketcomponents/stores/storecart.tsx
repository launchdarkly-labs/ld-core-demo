import { Button } from "@/components/ui/button";
import { useContext } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LoginContext from "@/utils/contexts/login";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { useToast } from "@/components/ui/use-toast";
import galaxyMarketLogo from "@/public/market.png";
import SuggestedItems from "../suggestedItems";
import { InventoryItem } from "@/utils/typesInterface";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";

// @ts-nocheck
export function StoreCart({ cart, setCart }: { cart: any; setCart: any }) {
  const router = useRouter();
  const { isLoggedIn } = useContext(LoginContext);
  const LDClient = useLDClient();
  const { cartSuggestedItems } = useFlags();
  const { logLDMetricSent } = useContext(LiveLogsContext);

  const totalCost = (cart || []).reduce(
    (total: number, item: InventoryItem) => total + Number(item.cost),
    0
  );

  const cartNumOfItems = cart.length;
  const { toast } = useToast();

  const cartClick = () => {
    LDClient?.track("cart-accessed", LDClient.getContext(), 1);
    logLDMetricSent("cart-accessed");
  };

  const checkOut = () => {
    toast({
      title: `Checkout is successful! Enjoy your purchase!`,
      wrapperStyle: "bg-gradient-experimentation text-white font-sohne text-base",
    });

    setCart([]);
    router.push("/marketplace");
  };

  const continueShopping = () => {
    LDClient?.track("upsell-tracking", LDClient.getContext());
    logLDMetricSent("upsell-tracking");
    router.push("/marketplace");
  };

  const checkOutTracking = () => {
    LDClient?.track("customer-checkout", LDClient.getContext(), 1);
    logLDMetricSent("customer-checkout");
    LDClient?.track("in-cart-total-price", LDClient.getContext(), totalCost);
    logLDMetricSent("in-cart-total-price", totalCost);
  };

  return (
    <Sheet>
      <SheetTrigger onClick={() => cartClick()} asChild>
        <div className="relative cursor-pointer">
          <ShoppingCart className="cart" color={"white"} />
          <div className="bg-gradient-experimentation w-3 h-3 sm:w-[1rem] sm:h-[1rem] flex justify-center align-center items-center  rounded-[100%] absolute top-[-5px] right-[-10px]">
            <span className="text-white mt-[.15rem] sm:mt-1 absolute text-xs sm:text-sm ">
              {cartNumOfItems}
            </span>
          </div>
        </div>
      </SheetTrigger>

      <SheetContent className="w-full sm:w-2/3 lg:w-1/2 xl:w-1/3 overflow-auto" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl bg-gradient-experimentation text-transparent bg-clip-text">
            Cart
          </SheetTitle>
        </SheetHeader>
        <Table className="font-sohnelight">
          {/* <TableCaption>Your Items</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.length > 0 ? (
              cart?.map((item: InventoryItem, index: number) => {
                return (
                  <TableRow key={`${item.id}-${index}`}>
                    <TableCell>
                      {" "}
                      <img
                        src={`${item.image ? item.image?.src : galaxyMarketLogo.src}`}
                        alt={item.item}
                        className="h-10 w-10 sm:h-20 sm:w-20"
                      />
                    </TableCell>
                    <TableCell className="">{item.item}</TableCell>
                    <TableCell className="">${item.cost}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow key={1}>
                <TableCell className="">Add an Item!</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <hr className="my-4 border-t border-gray-200" />

        <SheetFooter>
          <div className="w-full px-4 ">
            <div className="w-full px-4 flex justify-between">
              <p className="pb-4 font-sohne">Total:</p>
              <p className="pb-4 font-sohne">${totalCost.toFixed(2)}</p>
            </div>
            <SheetTrigger onClick={isLoggedIn ? checkOut : null} asChild>
              <Button
                onClick={isLoggedIn ? checkOutTracking : null}
                className={`w-full ${
                  isLoggedIn
                    ? "bg-gradient-experimentation"
                    : "text-marketgray border-2 border-marketgray bg-transparent hover:bg-transparent"
                } hover:brightness-[120%] rounded-none`}
              >
                {isLoggedIn ? "Checkout" : "Login to Continue Checkout"}
              </Button>
            </SheetTrigger>
            {cartSuggestedItems ? (
              <SuggestedItems cart={cart} setCart={setCart} />
            ) : (
              <SheetTrigger onClick={continueShopping} asChild>
                <div className="text-center mt-4">
                  <Button className="text-md bg-gradient-experimentation hover:brightness-[120%] text-transparent bg-clip-text rounded-none">
                    Continue Shopping →
                  </Button>
                </div>
              </SheetTrigger>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
