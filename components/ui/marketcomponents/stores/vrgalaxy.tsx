import { useEffect, useState } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import ProductInventoryComponent from "./ProductInventoryComponent";
import vrgame from "@/public/marketplace/vrgalaxy_image/vrgame.svg";
import vrcamera from "@/public/marketplace/vrgalaxy_image/vrcamera.svg";
import vrheadset from "@/public/marketplace/vrgalaxy_image/vrheadset.svg";
import vrsoftware from "@/public/marketplace/vrgalaxy_image/vrsoftware.svg";
import vrtreadmill from "@/public/marketplace/vrgalaxy_image/vrtreadmill.svg";
import hapticgloves from "@/public/marketplace/vrgalaxy_image/hapticgloves.svg";
import vrheadsetcleaningkit from "@/public/marketplace/vrgalaxy_image/vrheadsetcleaningkit.svg";
import vrcontrollers from "@/public/marketplace/vrgalaxy_image/vrcontrollers.svg";

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
    const data = [
      {
      "id": 1,
      "vendor": "vrgalaxy",
      "item": "VR Headset - Advanced Model",
      "cost": "499.99",
      "image": vrheadset
      },
      {
      "id": 2,
      "vendor": "vrgalaxy",
      "item": "Wireless VR Controllers (Pair)",
      "cost": "119.99",
      "image": vrcontrollers
      },
      {
      "id": 3,
      "vendor": "vrgalaxy",
      "item": "VR Treadmill for Immersive Movement",
      "cost": "899.99",
      "image": vrtreadmill
      },
      {
      "id": 4,
      "vendor": "vrgalaxy",
      "item": "Haptic Feedback Gloves",
      "cost": "259.99",
      "image": hapticgloves
      },
      {
      "id": 5,
      "vendor": "vrgalaxy",
      "item": "Virtual Reality Game - Space Adventure",
      "cost": "59.99",
      "image": vrgame
      },
      {
      "id": 6,
      "vendor": "vrgalaxy",
      "item": "VR Headset Cleaning Kit",
      "cost": "29.99",
      "image": vrheadsetcleaningkit
      },
      {
      "id": 7,
      "vendor": "vrgalaxy",
      "item": "360° VR Camera",
      "cost": "349.99",
      "image": vrcamera
      },
      {
      "id": 8,
      "vendor": "vrgalaxy",
      "item": "Virtual Reality Development Software",
      "cost": "199.99",
      "image": vrsoftware
      },
      {
      "id": 9,
      "vendor": "vrgalaxy",
      "item": "Adjustable VR Headset Stand",
      "cost": "39.99",
      },
      {
      "id": 10,
      "vendor": "vrgalaxy",
      "item": "Virtual Reality Experience Ticket - Underwater World",
      "cost": "14.99",
      }
      ];
      setInventory(data);
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
      sheetTitle="Welcome to VR Galaxy"
      tableCaption="VR Galaxy Inventory"
      inventory={inventory}
      mainImg={mainImg}
      headerLabel={headerLabel}
      isVisibleStoreHeaders={isVisibleStoreHeaders}
    />
  );
}