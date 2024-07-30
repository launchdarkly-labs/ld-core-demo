import { THE_BOOMIN_BOX_DATA } from "@/utils/constants";

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
 
  const mainImg = {
    imgSrc: "electronics.png",
    alt: "The Boomin' Box"
  }

  return (
    <ProductInventoryComponent
      setOpen={setOpen}
      open={open}
      addToCart={addToCart}
      sheetTitle="The Boomin' Box"
      tableCaption="The Boomin' Box Inventory"
      inventory={THE_BOOMIN_BOX_DATA}
      mainImg = {mainImg}
    />
  );
}
