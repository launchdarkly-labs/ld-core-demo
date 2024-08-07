import { useFlags } from "launchdarkly-react-client-sdk";
import ProductInventoryComponent from "./ProductInventoryComponent";
import { VR_GALAXY_DATA } from "@/utils/constants";
import type { AddToCartFunction } from "@/utils/typescriptTypesInterfaceMarketplace";

export function VRGalaxy({
  addToCart,
  open,
  setOpen,
}: {
  addToCart: AddToCartFunction;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { storeAttentionCallout }: { storeAttentionCallout: string } = useFlags();

  const headerLabel = storeAttentionCallout;

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
