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
      mainImg = {mainImg}
    />
  );
}
