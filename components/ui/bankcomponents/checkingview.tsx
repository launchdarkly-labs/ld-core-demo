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
import { AreaChartIcon, Banknote, Menu, Navigation } from "lucide-react";
import { useRouter } from "next/router";
import { CSCard } from "../ldcscard";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { checkData } from "@/lib/checkingdata";
import { useEffect, useState } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import { CiMoneyCheck1 } from "react-icons/ci";

type Transaction = {
  id: number;
  date: string;
  merchant: string;
  status: string;
  amount: number;
  accounttype: string;
  user: string;
};

type CheckingAccountProps = {
  wealthManagement: any; // replace 'any' with the actual type if known
};

export function CheckingAccount({ wealthManagement }: CheckingAccountProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  const { financialDBMigration } = useFlags();

  async function getTransactions() {
    const response = await fetch("/api/checkingdata");
    let transactionsJson: Transaction[];
    if (response.status == 200) {
      const data = await response.json();
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="h-full grid p-2 text-base font-sohnelight">
          <div className="flex flex-col items-start space-y-4">
            <div className="bg-blue-300/30 rounded-full flex items-center justify-center w-10 h-10">
              <CiMoneyCheck1 className="text-blue-700 h-8 w-8" />
            </div>
            <div className="pb-1">
              <p className="text-base text-zinc-500">
                <strong className="font-sohne">Platinum Checking</strong>{" "}
                (***2982)
              </p>
              <p className="text-zinc-500 sm:text-xs md:text-xs lg:text-xs xl:text-xs 2xl:text-base">
                No Fee Checking
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-start">
            <div className="space-y-2">
              <p className="text-zinc-500 sm:text-xs md:text-xs lg:text-xs xl:text-xs 2xl:text-base">
                Total Checking Balance:{" "}
              </p>
              <p className="balance">$83,758.52</p>
            </div>
          </div>

          <div></div>
        </div>
      </SheetTrigger>
      <SheetContent className="w-full lg:w-1/2 overflow-auto" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">
            <div className="flex-col">
              <div className="flex">Checking Account</div>
              {financialDBMigration === "complete" ? (
                <div className="flex text-center items-center justify-center my-6 bg-green-200 text-zinc-500 font-sohnebuch font-extralight text-base py-2">
                  Retrieving data from DynamoDB
                </div>
              ) : (
                <div className="flex text-center items-center justify-center my-6 bg-amber-200 font-sohnebuch font-extralight text-base py-2">
                  Retrieving Data from RDS
                </div>
              )}
            </div>
          </SheetTitle>
          <SheetDescription className="font-sohne">
            Understand the Balance of Your Checking Accounts
          </SheetDescription>
        </SheetHeader>

        <Table className="">
          <TableCaption>
            <Button
              className="flex rounded-none bg-blue-700 text-lg font-sohnelight"
              onClick={getTransactions}
            >
              Refresh Data
            </Button>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{item.date}</TableCell>
                <TableCell>{item.merchant}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell className="text-right">
                  {item.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SheetContent>
    </Sheet>
  );
}
