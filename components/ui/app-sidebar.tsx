import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useContext } from "react";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";

export function AppSidebar() {
  const { currentLDFlagEnvValues } = useContext(LiveLogsContext);

  return (
    <Sidebar side={"right"} variant={"inset"} collapsible={"offcanvas"}>
      {/* <SidebarHeader /> */}
      <SidebarContent className="bg-white flex flex-col p-4" id="sidebar-content">
        <Tabs defaultValue="account" className="">
          <TabsList>
            <TabsTrigger value="account">Current Values in your Environment</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className="border-[1px] border-slate-500 rounded-lg p-2">
              <Table className="">
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <>
                    {currentLDFlagEnvValues.map((value: any, index: number) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{value[0]}</TableCell>
                          <TableCell>{JSON.stringify(value[1])}</TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </SidebarContent>
      {/* <SidebarFooter /> */}
    </Sidebar>
  );
}
