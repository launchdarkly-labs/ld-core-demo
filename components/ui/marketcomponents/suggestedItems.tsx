
import { useEffect, useState, useContext } from "react";
import vrgame from "@/public/marketplace/vrgalaxy_image/vrgame.svg";
import vrcamera from "@/public/marketplace/vrgalaxy_image/vrcamera.svg";
import vrheadset from "@/public/marketplace/vrgalaxy_image/vrheadset.svg";
import vrsoftware from "@/public/marketplace/vrgalaxy_image/vrsoftware.svg";
import vrtreadmill from "@/public/marketplace/vrgalaxy_image/vrtreadmill.svg";
import hapticgloves from "@/public/marketplace/vrgalaxy_image/hapticgloves.svg";
import vrheadsetcleaningkit from "@/public/marketplace/vrgalaxy_image/vrheadsetcleaningkit.svg";
import vrcontrollers from "@/public/marketplace/vrgalaxy_image/vrcontrollers.svg";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import galaxyMarketLogo from '@/public/market.png'
import { useLDClient } from "launchdarkly-react-client-sdk";
import { InventoryItem } from "@/utils/typesInterface";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";

export default function SuggestedItems({ cart, setCart }: { cart: any, setCart: any }) {

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const LDClient = useLDClient();
    const { logLDMetricSent } = useContext(LiveLogsContext);

    const totalCost = (cart || []).reduce(
        (total: number, item: InventoryItem) => total + Number(item.cost),
        0
      );

    const addedSuggestedItemToCart = (item: InventoryItem) => {
        setCart([...cart, item]);
        LDClient?.track("upsell-tracking", LDClient.getContext());
        logLDMetricSent("upsell-tracking");
    }

    useEffect(() => {
        const data:InventoryItem[] = [
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
        ];
        setInventory(data);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full ">
            <div className="flex flex-col items-center font-sohne bg-gradient-experimentation text-transparent bg-clip-text">
                Suggested Items
            </div>
            <Carousel showArrows={true} autoPlay={true} infiniteLoop={true}>
                {inventory.map(item => (
                    <div key={item.id} className="flex flex-col items-center">
                        <img src={`${item.image ? item.image?.src : galaxyMarketLogo.src}`} alt={item.item} />
                        <div className="flex flex-col items-center ">
                            <p className="legend mb-12">{item.item} - ${item.cost}</p>
                            <button className="legend " onClick={() => addedSuggestedItemToCart(item)}>Add To Cart</button>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}