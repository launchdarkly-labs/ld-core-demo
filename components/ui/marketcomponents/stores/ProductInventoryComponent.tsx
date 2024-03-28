import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
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
  mainImg
}: {
  setOpen: any;
  open: boolean;
  addToCart: any;
  sheetTitle: string,
  sheetDescription: string;
  tableCaption: string,
  inventory: object,
  mainImg: any
}) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="cursor-pointer hover:brightness-[120%]">
          <img src={mainImg?.imgSrc} alt={mainImg?.alt} className="h-[300px] sm:h-[350px]" />
        </div>
      </SheetTrigger>

      <SheetContent className="w-3/4 lg:w-1/2" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl  bg-gradient-experimentation text-transparent bg-clip-text">{sheetTitle}</SheetTitle>

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
            {inventory.map((item: InventoryItem) => (
              <TableRow key={item.id}>
                <TableCell>{item.item}</TableCell>
                <TableCell>${item.cost}</TableCell>
                <TableCell>
                  <div>
                    <Button
                      className="rounded-none bg-gradient-experimentation font-sohne"
                      onClick={() => addToCart(item)}
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
