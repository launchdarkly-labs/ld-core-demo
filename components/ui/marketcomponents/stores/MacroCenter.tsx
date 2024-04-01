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
    fetch("/api/storeInventory?storename=macrocenter")
      .then((response) => response.json())
      .then((data) => setInventory(data));
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
