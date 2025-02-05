import { useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  // SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../table";

import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import galaxyMarketLogo from "@/public/market.png";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { InventoryItem } from "@/utils/typescriptTypesInterfaceIndustry";
import type { AddToCartFunction } from "@/utils/typescriptTypesInterfaceIndustry";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";

const ProductInventoryComponent = ({
  setOpen,
  open,
  addToCart,
  sheetTitle,
  inventory,
  mainImg,
  isVisibleStoreHeaders,
  headerLabel,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  addToCart: AddToCartFunction;
  sheetTitle?: string;
  tableCaption?: string;
  inventory: InventoryItem[];
  mainImg: { imgSrc: string; alt: string };
  isVisibleStoreHeaders?: boolean;
  headerLabel?: string;
}) => {
  const LDClient = useLDClient();
  const releaseNewShortenCollectionsPage:string = useFlags()[
    "release-new-shorten-collections-page"
  ]?.includes("new-shorten-collections-page") || "";
  const { toast } = useToast();
  const { logLDMetricSent } = useContext(LiveLogsContext);
  const [showAllItems, setShowAllItems] = useState<boolean>(false);

  async function storeOpened():Promise<void> {
    LDClient?.track("store-accessed", LDClient.getContext(), 1);
    logLDMetricSent("store-accessed");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        asChild
        onClick={() => {
          storeOpened();
        }}
      >
        <div className="relative flex items-center justify-center">
          {isVisibleStoreHeaders && (
            <motion.div
              initial={{ scale: 0, x: "-100%" }}
              animate={{ scale: 1.15, x: "0%" }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1.5,
              }}
              className="flex justify-center absolute top-[10px] right-[20px] z-[1] bg-[#EBFF38] px-4 pt-2 pb-[2rem] h-auto marketplace-item-banner-cutout"
            >
              <p className="flex font-sohne uppercase text-xs text-black text-center flex-col justify-around mb-1.5 w-full">
                {headerLabel
                  ?.split("")
                  .map((char, index) =>
                    char === " " ? <span key={index}>&nbsp;</span> : <span key={index}>{char}</span>
                  )}
              </p>
            </motion.div>
          )}
          <img
            src={mainImg?.imgSrc}
            alt={mainImg?.alt}
            className="h-[300px] sm:h-[350px] cursor-pointer hover:brightness-[120%]"
          />
        </div>
      </SheetTrigger>

      <SheetContent className="w-full lg:w-1/2 overflow-auto" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl  bg-gradient-experimentation text-transparent bg-clip-text">
            {sheetTitle}
          </SheetTitle>
        </SheetHeader>
        <Table className="">
          <TableCaption
            className="bg-gradient-experimentation text-transparent bg-clip-text font-bold text-base cursor-pointer hover:brightness-125"
            onClick={() => setShowAllItems((prev) => !prev)}
          >
            {showAllItems === false ? "Show More" : "Show Less"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory?.map((item: InventoryItem, index: number) => {
              if (index > 2 && showAllItems === false && releaseNewShortenCollectionsPage)
                return null;
              return (
                <TableRow key={`${item.id}-${index}`}>
                  <TableCell>
                    {
                      <img
                        src={`${item.image ? item.image?.src : galaxyMarketLogo.src}`}
                        alt={item.item}
                        className="h-10 w-10 sm:h-20 sm:w-20"
                      />
                    }
                  </TableCell>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>${item.cost}</TableCell>
                  <TableCell>
                    <div>
                      <Button
                        className="rounded-none bg-gradient-experimentation font-sohne hover:brightness-[120%] h-auto"
                        onClick={() => {
                          toast({
                            title: `${item.item} has been added to your cart!`,
                            wrapperStyle:
                              "bg-gradient-experimentation text-white !text-medium font-bold font-sohne",
                          });
                          addToCart(item);
                        }}
                      >
                        Add To Cart
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductInventoryComponent;
