
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Landmark } from "lucide-react";
import { useRouter } from "next/router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
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

export function FederatedCheckingAccount() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);


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
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
      <div className="h-full grid p-2">
          <div className="flex flex-col items-start space-y-4">
            <div className="bg-gray-300/30 rounded-full flex items-center justify-center w-10 h-10">
              <Landmark className="text-gray-700" />
            </div>
            <div className="">
              <p className="accounttext pb-1">Checking (***2982)</p>
              <br />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-2">
              <p className="balancetext">Total Balance: </p>
              <p className="balance">$83,758</p>
            </div>
          </div>

          <div>
          </div>
        </div>
      </SheetTrigger>

      
      <SheetContent className="w-full lg:w-1/2 overflow-auto" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">
            Federated Checking Account
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
                <TableCell className="text-right">
                  {item.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SheetContent>
    </Sheet>
  );
}
