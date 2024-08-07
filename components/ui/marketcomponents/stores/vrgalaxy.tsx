import { useFlags } from "launchdarkly-react-client-sdk";
import ProductInventoryComponent from "./ProductInventoryComponent";
import { VR_GALAXY_DATA } from "@/utils/constants";
// @ts-nocheck
export function VRGalaxy({
  addToCart,
  open,
  setOpen,
}: {
  addToCart: any;
  open: boolean;
  setOpen: any;
}) {
  const { storeAttentionCallout } = useFlags();

  const headerLabel:string = storeAttentionCallout;

  const mainImg = {
    imgSrc: "gaming.png",
    alt: "VR Gaming",
  };

  return (
    <ProductInventoryComponent
      setOpen={setOpen}
      open={open}
      addToCart={addToCart}
      sheetTitle="Welcome to VR Galaxy"
      tableCaption="VR Galaxy Inventory"
      inventory={VR_GALAXY_DATA}
      mainImg={mainImg}
      headerLabel={headerLabel}
      isVisibleStoreHeaders={headerLabel ? true : false}
    />
  );
}