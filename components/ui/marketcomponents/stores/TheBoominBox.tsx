import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { Home, HomeIcon, Menu, Navigation } from "lucide-react";
import { useRouter } from "next/router";
import { CSCard } from "../../ldcscard";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../table";

const payments = [
  { month: "11/2023", amount: 4123, status: "cleared" },
  { month: "10/2023", amount: 4123, status: "cleared" },
  { month: "09/2023", amount: 4123, status: "cleared" },
  { month: "08/2023", amount: 4123, status: "cleared" },
  { month: "07/2023", amount: 4123, status: "cleared" },
  { month: "06/2023", amount: 4123, status: "cleared" },
  { month: "05/2023", amount: 4123, status: "cleared" },
  { month: "04/2023", amount: 4123, status: "cleared" },
  { month: "03/2023", amount: 4123, status: "cleared" },
  { month: "02/2023", amount: 4123, status: "cleared" },
  { month: "01/2023", amount: 4123, status: "cleared" },
  { month: "12/2022", amount: 4123, status: "cleared" }
];


export function TheBoominBox() {
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
      <div>
      <img src="electronics.png" alt="The Boomin' Box" className="h-[300px]" />
      </div>
      </SheetTrigger>


      <SheetContent className="w-1/2" side="right">
        
        <SheetHeader>

          <SheetTitle className="font-sohne text-2xl">
            The Boomin' Box
          </SheetTitle>


          <SheetDescription className="font-sohne">
           Beats for the audiophiles in the crowd! 
          </SheetDescription>
        </SheetHeader>
       
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
