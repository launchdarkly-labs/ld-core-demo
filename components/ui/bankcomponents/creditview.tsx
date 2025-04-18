import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFlags } from "launchdarkly-react-client-sdk";

import { CreditCard, Menu, Navigation } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { use, useEffect, useState } from "react";
import { get } from "lodash";

type Transaction = {
  id: number;
  date: string;
  merchant: string;
  status: string;
  amount: number;
  accounttype: string;
  user: string;
};

export function CreditAccount() {
  const { financialDBMigration, togglebankDBGuardedRelease } = useFlags();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  async function getTransactions() {
    const response = await fetch("/api/creditdata");
    let transactionsJson: Transaction[];
    if (response.status == 200) {
      const data = await response?.json();
     
      transactionsJson = data;
    } else {
      transactionsJson = [
        {
          id: 0,
          date: "",
          merchant: "",
          status: "Server Error",
          amount: 0,
          accounttype: "",
          user: "",
        },
      ];
    }
    setTransactions(transactionsJson);
    return transactionsJson;
  }

  useEffect(() => {
    getTransactions();
  }, [financialDBMigration]);

  useEffect(() => {
    getTransactions();
  }, [togglebankDBGuardedRelease]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="h-full grid p-2 text-base font-sohnelight">
          <div className="flex flex-col items-start space-y-4">
            <div className="bg-blue-300/30 rounded-full flex items-center justify-center w-10 h-10">
              <CreditCard className="text-blue-700" />
            </div>
            <div className="">
              <p className="text-zinc-500">
                <strong className="font-sohne">GSF Platinum Credit</strong>{" "}
                (***4222)
              </p>
              <p className="pt-2 text-zinc-500 sm:text-xs md:text-xs lg:text-xs xl:text-xs 2xl:text-base pb-4">
                APR 13.875%
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-zinc-500 sm:text-xs md:text-xs lg:text-xs xl:text-xs 2xl:text-base">
                Total Credit Balance:{" "}
              </p>
              <p className="balance">$1,203.00</p>
            </div>
            <div>
              <p className="text-bankdarkblue pt-4 text-xs">
                Next Due: March 15th, 2025
              </p>
            </div>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="w-full lg:w-1/2 overflow-auto" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">
            <div className="flex-col">
              <div className="flex">GSF Platinum Credit Account</div>
              {financialDBMigration === "complete" || togglebankDBGuardedRelease? (
                <div className="flex text-center items-center justify-center my-6 bg-green-200 text-zinc-500 font-sohnebuch font-extralight text-base py-2">
                  Retrieving data from DynamoDB
                </div>
              ) : (
                <div className="flex text-center items-center justify-center my-6 bg-amber-200 font-sohnebuch font-extralight text-base py-2">
                  Retrieving data from RDS
                </div>
              )}
            </div>
          </SheetTitle>
          <SheetDescription className="font-sohne">
            Transaction history for your GSF Platinum Credit Account
          </SheetDescription>
        </SheetHeader>

        <Table className="">
          <TableCaption>
            A list of your recent credit transactions.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((invoice, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{invoice.date}</TableCell>
                <TableCell>{invoice.merchant}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell className="text-right">{invoice.amount}</TableCell>
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
