import { useEffect, useState } from "react";

import ProductInventoryComponent from "./ProductInventoryComponent";

export function MacroCenter({
  addToCart,
  open,
  setOpen,
}: {
  addToCart: any;
  open: boolean;
  setOpen: any;
}) {

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const data = [
      {
      "id": 11,
      "vendor": "macrocenter",
      "item": "High-Performance Graphics Card - 8GB",
      "cost": "699.99"
      },
      {
      "id": 12,
      "vendor": "macrocenter",
      "item": "Gaming Motherboard - RGB Lighting",
      "cost": "259.99"
      },
      {
      "id": 13,
      "vendor": "macrocenter",
      "item": "Solid State Drive (SSD) - 1TB",
      "cost": "129.99"
      },
      {
      "id": 14,
      "vendor": "macrocenter",
      "item": "DDR4 RAM - 16GB Kit (2x8GB)",
      "cost": "89.99"
      },
      {
      "id": 15,
      "vendor": "macrocenter",
      "item": "Modular Power Supply - 750W",
      "cost": "119.99"
      },
      {
      "id": 16,
      "vendor": "macrocenter",
      "item": "CPU Cooler - Liquid Cooling System",
      "cost": "139.99"
      },
      {
      "id": 17,
      "vendor": "macrocenter",
      "item": "Full-Tower PC Case - Tempered Glass",
      "cost": "199.99"
      },
      {
      "id": 18,
      "vendor": "macrocenter",
      "item": "Wireless Gaming Keyboard and Mouse Combo",
      "cost": "99.99"
      },
      {
      "id": 19,
      "vendor": "macrocenter",
      "item": "27-inch Gaming Monitor - 144Hz",
      "cost": "329.99"
      },
      {
      "id": 20,
      "vendor": "macrocenter",
      "item": "Internal Sound Card - 7.1 Surround",
      "cost": "79.99"
      }
      ];
      setInventory(data);
  }, []);

  const mainImg = {
    imgSrc: "computers.png",
    alt: "MacroCenter",
  };

  return (
    <ProductInventoryComponent
      setOpen={setOpen}
      open={open}
      addToCart={addToCart}
      sheetDescription="Computer Parts and Consumer Electronics!"
      sheetTitle="MacroCenter"
      tableCaption="MacroCenter Inventory"
      inventory={inventory}
      mainImg={mainImg}
    />
  );
}