import { THE_BOOMIN_BOX_DATA } from "@/utils/constants";
import ProductInventoryComponent from "./ProductInventoryComponent";
import type { AddToCartFunction } from "@/experimentation-automation/typescriptTypesInterface";

export function TheBoominBox({
  addToCart,
  open,
  setOpen,
}: {
  addToCart: AddToCartFunction;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
