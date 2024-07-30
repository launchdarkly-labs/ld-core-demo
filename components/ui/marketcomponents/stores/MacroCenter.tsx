import { MACROCENTER_DATA } from "@/utils/constants";

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
      inventory={MACROCENTER_DATA}
      mainImg={mainImg}
    />
  );
}
