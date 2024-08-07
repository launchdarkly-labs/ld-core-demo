import { MACROCENTER_DATA } from "@/utils/constants";
import type { AddToCartFunction } from "@/experimentation-automation/typescriptTypesInterface";
import ProductInventoryComponent from "./ProductInventoryComponent";

export function MacroCenter({
  addToCart,
  open,
  setOpen,
}: {
  addToCart: AddToCartFunction;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {

  const mainImg: object = {
    imgSrc: "computers.png",
    alt: "MacroCenter",
  };

  return (
    <ProductInventoryComponent
      setOpen={setOpen}
      open={open}
      addToCart={addToCart}
      // sheetDescription="Computer Parts and Consumer Electronics!"
      sheetTitle="MacroCenter"
      tableCaption="MacroCenter Inventory"
      inventory={MACROCENTER_DATA}
      mainImg={mainImg}
    />
  );
}
