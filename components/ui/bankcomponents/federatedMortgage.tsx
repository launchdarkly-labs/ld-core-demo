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
import { CSCard } from "../ldcscard";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

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

export function FederatedMortgage() {
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
      <div className="h-full grid p-2">

          <div className="flex flex-col items-start space-y-4">
            <div className="bg-blue-300/30 rounded-full flex items-center justify-center w-10 h-10">
              <HomeIcon className="text-blue-700" />
            </div>
            <div className="">
              <p className="accounttext">Federated Mortgage Account (***6503)</p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-2">
              <p className="balancetext">Remaining Balance: </p>
              <p className="balance">$457,321</p>
              <p className="aprtext">APR 2.875</p>
              </div>
              <div>
              <p className="duetext">Next Due: 14th</p>
            </div>
          </div>

       
</div>
      </SheetTrigger>
      <SheetContent className="w-1/2" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">
            Federated Mortgage Account
          </SheetTitle>
          <SheetDescription className="font-sohne">
            Your home loan balance statement
          </SheetDescription>
        </SheetHeader>

        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((invoice, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{invoice.month}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>Checking</TableCell>
                <TableCell className="text-right">
                  ${invoice.amount}
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
}
