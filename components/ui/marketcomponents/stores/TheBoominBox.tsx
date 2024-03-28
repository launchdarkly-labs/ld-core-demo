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
import { useEffect, useState } from "react";
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
} from "../../table";

import inventorySlidingPage from "./ProductInventoryComponent";
import ProductInventoryComponent from "./ProductInventoryComponent";

interface InventoryItem {
  id: string | number;
  item: string;
  cost: number;
}

//TODO: open, setopen, addtocart needs to be a wrapper function or hook
export function TheBoominBox({
  addToCart,
  open,
  setOpen,
}: {
  addToCart: any;
  open: boolean;
  setOpen: any;
}) {
  const router = useRouter();

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetch("/api/storeInventory?storename=boominbox")
      .then((response) => response.json())
      .then((data) => setInventory(data));
  }, []);

  return (
    <ProductInventoryComponent
      setOpen={setOpen}
      open={open}
      addToCart={addToCart}
      sheetDescription = "Beats for the audiophiles in the crowd!"
      sheetTitle="The Boomin' Box"
      tableCaption="The Boomin' Box Inventory"
      inventory={inventory}
    />
  );
}
