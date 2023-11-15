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

import { Home, HomeIcon, Menu, Navigation } from "lucide-react";
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
import { useEffect, useState } from "react";

interface InventoryItem {
  id: string | number;
  item: string;
  cost: number;
}

export function VRgalaxy() {
  const router = useRouter();

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetch('/api/storeInventory?storename=vrgalaxy')
      .then(response => response.json())
      .then(data => setInventory(data));
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
      <div>
        <img src="gaming.png" alt="VR Gaming" className="h-[300px]" />
      </div>
      </SheetTrigger>


      <SheetContent className="w-1/2" side="right">
        
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
                  <Button>Buy Now</Button>
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
