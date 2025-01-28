import { useEffect, useState } from "react";

import ProductInventoryComponent from "./ProductInventoryComponent";

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
 
  const [inventory, setInventory] = useState([]);

  const mainImg = {
    imgSrc: "electronics.png",
    alt: "The Boomin' Box"
  }

  useEffect(() => {

    const data = [
      {
      "id": 21,
      "vendor": "boominbox",
      "item": "VR Headset - Advanced Model",
      "cost": "499.99"
      },
      {
      "id": 22,
      "vendor": "boominbox",
      "item": "Bluetooth Noise-Canceling Headphones",
      "cost": "299.99"
      },
      {
      "id": 23,
      "vendor": "boominbox",
      "item": "Wireless Earbuds - Waterproof Edition",
      "cost": "159.99"
      },
      {
      "id": 24,
      "vendor": "boominbox",
      "item": "High-Fidelity Turntable",
      "cost": "349.99"
      },
      {
      "id": 25,
      "vendor": "boominbox",
      "item": "Portable Bluetooth Speaker - Rugged Design",
      "cost": "119.99"
      },
      {
      "id": 26,
      "vendor": "boominbox",
      "item": "Studio Monitor Speakers (Pair)",
      "cost": "499.99"
      },
      {
      "id": 27,
      "vendor": "boominbox",
      "item": "Multi-Channel Home Theater System",
      "cost": "999.99"
      },
      {
      "id": 28,
      "vendor": "boominbox",
      "item": "Digital Audio Interface - Pro Series",
      "cost": "229.99"
      },
      {
      "id": 29,
      "vendor": "boominbox",
      "item": "Smart Home Sound System with Voice Control",
      "cost": "399.99"
      },
      {
      "id": 30,
      "vendor": "boominbox",
      "item": "Professional DJ Mixer",
      "cost": "699.99"
      }
      ]
      setInventory(data);
  }, []);

  return (
    <ProductInventoryComponent
      setOpen={setOpen}
      open={open}
      addToCart={addToCart}
      sheetTitle="The Boomin' Box"
      tableCaption="The Boomin' Box Inventory"
      inventory={inventory}
      mainImg = {mainImg}
    />
  );
}