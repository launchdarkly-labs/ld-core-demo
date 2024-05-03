import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CreditCard} from "lucide-react";
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

export function FederatedCreditAccount() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

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
        <div className="h-full grid p-2 text-sm font-sohnelight text-zinc-500">
          <div className="flex flex-col items-start space-y-4">
            <div className="bg-gray-300/30 rounded-full flex items-center justify-center w-10 h-10">
              <CreditCard className="text-gray-700" />
            </div>
            <div className="">
              <p className="font-sohne">External federated credit</p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-zinc-400 text-sm font-sohnelight">
                Total credit balance:{" "}
              </p>
              <p className="balance">$1,203.00</p>
            </div>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="w-full lg:w-1/2 overflow-auto" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">
            Federated Credit Account
          </SheetTitle>
          <SheetDescription className="font-sohne">
            Understand the Balance of Your Credit Account
          </SheetDescription>
        </SheetHeader>

        <Table className="">
          <TableCaption>Your Credit Account Transactions</TableCaption>
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
