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
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { checkData } from "@/lib/checkingdata";
import { useEffect, useState } from "react";

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

  async function getTransactions() {
    const response = await fetch("/api/checkingdata");
    const transactionsJson: Transaction[] = await response.json();
    setTransactions(transactionsJson);
    return transactionsJson;
  }

  useEffect(() => {
    getTransactions();
  }, []);

  console.log(wealthManagement);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="h-full grid p-2">
          <div className="flex flex-col items-start space-y-4">
            <div className="bg-blue-300/30 rounded-full flex items-center justify-center w-10 h-10">
              <Banknote className="text-blue-700" />
            </div>
            <div className="pb-1">
              <p className="accounttext">Checking (***2982)</p>
             <br /> 
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-2">
              <p className="balancetext">Total Checking Balance: </p>
              <p className="balance">$83,758</p>
            </div>
          </div>

          <div>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="w-1/2 overflow-y-scroll" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">
            Checking Account
          </SheetTitle>
          <SheetDescription className="font-sohne">
            Understand the Balance of Your Checking Accounts
          </SheetDescription>
        </SheetHeader>

        <Table className="">
          <TableCaption>Your Checking Account Transactions</TableCaption>
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
                <TableCell className="text-right">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SheetContent>
    </Sheet>
  );
}
