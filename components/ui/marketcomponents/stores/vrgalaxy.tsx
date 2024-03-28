import { useEffect, useState } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import ProductInventoryComponent from "./ProductInventoryComponent";

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
  const { storeAttentionCallout, storeHeaders } = useFlags();
  const [inventory, setInventory] = useState([]);

  const isVisibleStoreHeaders=storeHeaders;
  const headerLabel = storeAttentionCallout;

  useEffect(() => {
    fetch("/api/storeInventory?storename=vrgalaxy")
      .then((response) => response.json())
      .then((data) => setInventory(data));
  }, []);

  const mainImg = {
    imgSrc: "gaming.png",
    alt: "VR Gaming",
  };


  return (
    <ProductInventoryComponent
      setOpen={setOpen}
      open={open}
      addToCart={addToCart}
      sheetDescription="Beats for the audiophiles in the crowd!"
      sheetTitle="The Boomin' Box"
      tableCaption="The Boomin' Box Inventory"
      inventory={inventory}
      mainImg={mainImg}
      headerLabel={headerLabel}
      isVisibleStoreHeaders={isVisibleStoreHeaders}
    />
  );
}
