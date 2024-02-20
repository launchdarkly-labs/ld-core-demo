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

import { Home, HomeIcon, Menu, Navigation, Sparkle } from "lucide-react";
import { useRouter } from "next/router";
import { CSCard } from "../../ldcscard";
import { animate, motion } from "framer-motion";
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
import { useEffect, useState } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";

interface InventoryItem {
  id: string | number;
  item: string;
  cost: number;
}

// @ts-nocheck
export function VRgalaxy({
  headerLabel,
  storeHeaders,
  addToCart,
  open,
  setOpen,
}: {
  headerLabel: string;
  storeHeaders: string;
  addToCart: any;
  open: boolean;
  setOpen: any;
}) {
  const LDClient = useLDClient();
  const router = useRouter();

  const [inventory, setInventory] = useState([]);

 

  useEffect(() => {
    fetch("/api/storeInventory?storename=vrgalaxy")
      .then((response) => response.json())
      .then((data) => setInventory(data));
  }, []);

  async function storeOpened() {
    LDClient?.track("store-accessed", LDClient.getContext(), 1);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        onClick={() => {
          storeOpened();
        }}
        asChild
      >
        <div className="relative flex items-center justify-center">
          {storeHeaders && (
            <motion.div
              initial={{ scale: 0, x: "-100%" }}
              animate={{ scale: 1.15, x: "0%" }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1.5,
              }}
              className="flex justify-center absolute top-[-30px] z-10 bg-gradient-experimentation px-2 py-2 w-2/3 shadow-xl "
            >
              <p className="flex items-center font-sohne mx-auto uppercase text-white text-xl text-center">
                {headerLabel}
              </p>
            </motion.div>
          )}
          <img src="gaming.png" alt="VR Gaming" className="h-[300px] sm:h-[350px] z-0" />
        </div>
      </SheetTrigger>

      <SheetContent className="w-3/4 lg:w-1/2" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">
            Welcome to VR Galaxy
          </SheetTitle>

          <SheetDescription className="font-sohne">
            Your home for todays VR equipment!
          </SheetDescription>
        </SheetHeader>
        <Table>
          <TableCaption>VR Galaxy Inventory</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item: InventoryItem) => (
              <TableRow key={item.id}>
                <TableCell>{item.item}</TableCell>
                <TableCell>{item.cost}</TableCell>
                <TableCell>
                  <div>
                    <Button
                      className="store rounded-none bg-blue-600 font-sohne"
                      onClick={() => addToCart(item)}
                    >
                      Buy Now
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
