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

export function CreditAccount() {
  const { financialDBMigration } = useFlags()
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  async function getTransactions() {
    const response = await fetch("/api/creditdata");
    const transactionsJson: Transaction[] = await response.json();
    setTransactions(transactionsJson);
    return transactionsJson;
  }

  useEffect(() => {
    getTransactions();
  }, [financialDBMigration]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="h-full grid p-2">

          <div className="flex flex-col items-start space-y-4">
            <div className="bg-blue-300/30 rounded-full flex items-center justify-center w-10 h-10">
              <CreditCard className="text-blue-700" />
            </div>
            <div className="">
              <p className="accounttext">Platinum Credit (***3487)</p>
              <p className="aprtext pt-2">APR $13.875</p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-2">
              <p className="balancetext">Total Credit Balance: </p>
              <p className="balance">$1,203</p>
              
              </div>
              <div>
              <p className="duetext">Next Due: 23rd</p>
            </div>
          </div>

       
</div>
      </SheetTrigger>
      <SheetContent className="w-full lg:w-1/2 overflow-auto" side="right">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">
            GSF Platinum Credit Account
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
            {transactions.map((invoice,i) => (
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
