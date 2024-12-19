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
  console.log("currentLDFlagEnvValues", currentLDFlagEnvValues.length);
  return (
    <Sidebar side={"right"} variant={"inset"} collapsible={"offcanvas"}>
      {/* <SidebarHeader /> */}
      <SidebarContent className="bg-white">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Current Values in your Environment</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Table>
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
                    if (typeof value[1] !== ( "string")) {return}
                    return (
                      <TableRow key={index}>
                  
                        <TableCell>{value[0]}</TableCell>
                        <TableCell>{value[1]}</TableCell>
                      </TableRow>
                    );
                  })}
                </>
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </SidebarContent>
      {/* <SidebarFooter /> */}
    </Sidebar>
  );
}
