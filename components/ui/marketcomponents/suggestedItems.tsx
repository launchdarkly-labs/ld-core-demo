import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import galaxyMarketLogo from '@/public/market.png'
import { useLDClient } from "launchdarkly-react-client-sdk";
import { VR_GALAXY_DATA } from "@/utils/constants";
interface InventoryItem {
    id: number;
    vendor: string;
    item: string;
    cost: string;
    image?: StaticImageData;
}

export default function SuggestedItems({ cart, setCart }: { cart: any, setCart: any }) {


    const LDClient = useLDClient();


    const totalCost = (cart || []).reduce(
        (total: number, item: InventoryItem) => total + Number(item.cost),
        0
      );

    const addedSuggestedItemToCart = (item: InventoryItem) => {
        setCart([...cart, item]);
        LDClient?.track("upsell-tracking", LDClient.getContext());
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full my-4  font-sohne ">
            <h3 className="flex flex-col items-center bg-gradient-experimentation text-transparent bg-clip-text my-4">
                Suggested Items
            </h3>
            <Carousel showArrows={true} autoPlay={true} infiniteLoop={true} className="">
                {VR_GALAXY_DATA.slice(5, 8).map(item => (
                    <div key={item.id} className="flex flex-col items-center">
                        <img src={`${item.image ? item.image?.src : galaxyMarketLogo.src}`} alt={item.item} />
                        <div className="flex flex-col items-center ">
                            <p className="legend mb-12">{item.item} - ${item.cost}</p>
                            <button className="legend  !bg-gradient-experimentation" onClick={() => addedSuggestedItemToCart(item)}>Add To Cart</button>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
