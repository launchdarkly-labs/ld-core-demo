import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { Home, HomeIcon, Menu, Navigation, ShoppingCart } from "lucide-react";
import { useRouter } from "next/router";
import { CSCard } from "../../ldcscard";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";

interface InventoryItem {
  id: string | number;
  item: string;
  cost: number;
}
// @ts-nocheck
export function StoreCart({ cart, setCart }:{cart: any, setCart: any}) {
  const router = useRouter();

  const LDClient = useLDClient()

  const totalCost = (cart || []).reduce((total: number, item: InventoryItem) => total + Number(item.cost), 0);  

  const cartClick = () => {
    LDClient?.track('cart-accessed', LDClient.getContext(), 1) 
  }

  const checkOut = () => {
    setCart([]);
    router.push("/marketplace");
  };

  const checkOutTracking = () => {
    LDClient?.track('customer-checkout', LDClient.getContext(), 1)
  }

  return (
    <Sheet>
      <SheetTrigger onClick={() => cartClick()} asChild>
        <div>
          <ShoppingCart className="cart" color={"white"} className="cursor-pointer"/>
        </div>
      </SheetTrigger>

      <SheetContent className="w-full sm:w-1/2 lg:w-1/3" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">Your Cart</SheetTitle>

          <SheetDescription className="font-sohne">
            Ready for Checkout?
          </SheetDescription>
        </SheetHeader>
        <Table>
          {/* <TableCaption>Your Items</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart?.map((item: InventoryItem) => (
              <TableRow key={item.id}>
                <TableCell className="font-sohnelight">{item.item}</TableCell>
                <TableCell className="font-sohnelight">{item.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <SheetFooter>
          <div className="mr-16 mt-10">
            <p className="pb-4 font-sohne ml-auto">
              Transaction Total: ${totalCost}
            </p>
            <SheetTrigger onClick={checkOut} asChild>
              <Button onClick={checkOutTracking} className="checkout w-full">
                Checkout
              </Button>
            </SheetTrigger>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
