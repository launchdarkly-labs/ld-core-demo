import { Button } from "@/components/ui/button";
import {
  Sheet,
  // SheetClose,
  SheetContent,
  SheetDescription,
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

import { useLDClient } from "launchdarkly-react-client-sdk";
import { useToast } from "@/components/ui/use-toast";

interface InventoryItem {
  id: string | number;
  item: string;
  cost: number;
}

const ProductInventoryComponent = ({
  setOpen,
  open,
  addToCart,
  sheetTitle,
  sheetDescription,
  tableCaption,
  inventory,
  mainImg,
  isVisibleStoreHeaders,
  headerLabel,
}: {
  setOpen: any;
  open: boolean;
  addToCart: any;
  sheetTitle?: string;
  sheetDescription?: string;
  tableCaption?: string;
  inventory: object;
  mainImg: any;
  isVisibleStoreHeaders?: boolean;
  headerLabel?: string;
}) => {
  const LDClient = useLDClient();
  const { toast } = useToast();

  async function storeOpened() {
    LDClient?.track("store-accessed", LDClient.getContext(), 1);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        asChild
        onClick={() => {
          isVisibleStoreHeaders ? storeOpened() : null;
        }}
      >
        <div className="relative flex items-center justify-center ">
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
              className="flex justify-center absolute top-[-30px] z-10 bg-gradient-experimentation px-2 py-2 w-2/3 shadow-xl "
            >
              <p className="flex items-center font-sohne mx-auto uppercase text-white text-xl text-center">
                {headerLabel}
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

      <SheetContent className="w-3/4 lg:w-1/2" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl  bg-gradient-experimentation text-transparent bg-clip-text">
            {sheetTitle}
          </SheetTitle>

          <SheetDescription className="font-sohne">{sheetDescription}</SheetDescription>
        </SheetHeader>
        <Table className="">
          <TableCaption>{tableCaption}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item: InventoryItem, index:number) => (
              <TableRow key={`${item.id}-${index}`}>
                <TableCell>{item.item}</TableCell>
                <TableCell>${item.cost}</TableCell>
                <TableCell>
                  <div>
                    <Button
                      className="rounded-none bg-gradient-experimentation font-sohne hover:brightness-[120%]"
                      onClick={() => {
                        toast({
                          title: `${item.item} has been added to your cart!`,
                          wrapperStyle: "bg-gradient-experimentation text-white font-sohne"
                        });
                        addToCart(item);
                      }}
                    >
                      Buy Now
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductInventoryComponent;
