import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { PulseLoader } from "react-spinners";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Clock, Eye, EyeOff } from "lucide-react";

import { useContext, useEffect, useState } from "react";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";
import { Highlight, themes } from "prism-react-renderer";

export function AppSidebar() {
  const { currentLDFlagEnvValues, liveLogs } = useContext(LiveLogsContext);
  const [toggleCodeBoxObj, setToggleCodeBoxObj] = useState({});

  const x = `
    client.on('change:flag-key-123abc', (value, previous) => {
        console.log('flag-key-123abc changed:', value, '(' + previous + ')');
    });
  `;

  return (
    <Sidebar side={"right"} variant={"inset"} collapsible={"offcanvas"}>
      {/* <SidebarHeader /> */}
      <SidebarContent className="bg-white flex flex-col p-4" id="sidebar-content">
        <Tabs defaultValue="account" className="">
          <TabsList>
            <TabsTrigger value="account">Current Values in your Environment</TabsTrigger>
            <TabsTrigger value="password">Live Logs</TabsTrigger>
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
          <TabsContent value="password">
            <div className="flex  bg-gray-200 w-full rounded-md items-center gap-x-2 p-1 mb-4">
              <h2 className="text-xs">Monitoring Events </h2>
              <PulseLoader className="h-4" size={8} speedMultiplier={0.5} color={"gray"} />
            </div>

            {liveLogs.map((log: any, index: number) => {
              return (
                <Card className="mb-2" key={index}>
                  <CardContent className="p-4 w-full overflow-x-auto">
                    <div className="bg-gray-200 rounded-md p-1 w-full mb-10 text-xs">
                      New Flag Change Event Received
                    </div>
                    <div className="flex justify-between items-center mb-4  text-xs text-gray-500">
                      <div
                        onClick={() => {
                          setToggleCodeBoxObj((prevState) => {
                            //@ts-ignore
                            return { ...prevState, [index]: !toggleCodeBoxObj[index] };
                          });
                        }}
                      >
                        {/* @ts-ignore */}
                        {toggleCodeBoxObj[index] ? (
                          <p className="flex gap-x-2 items-center cursor-pointer">
                            <span>
                              {" "}
                              <EyeOff className="h-5 w-5 " />
                            </span>{" "}
                            Collapse
                          </p>
                        ) : (
                          <p className="flex gap-x-2 items-center cursor-pointer">
                            <span>
                              <Eye className="h-5 w-5" />
                            </span>{" "}
                            Details
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span>
                          <Clock className="h-5 w-5" />
                        </span>
                        {log.date.getMonth() +
                          1 +
                          "/" +
                          log.date.getDate() +
                          "/" +
                          log.date.getFullYear()}
                      </div>
                    </div>
                    {/* @ts-ignore */}
                    {toggleCodeBoxObj[index] ? (
                      <div className="w-full ">
                        <Highlight
                          theme={themes.shadesOfPurple}
                          code={JSON.stringify(log.log, null, 4)}
                          language="tsx"
                        >
                          {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre style={style} className="w-full overflow-x-auto p-4 text-wrap rounded-lg  shadow-lg ">
                              {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })}>
                                  <span className="mr-2">{i + 1}</span>
                                  {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} className={className} />
                                  ))}
                                </div>
                              ))}
                            </pre>
                          )}
                        </Highlight>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </SidebarContent>
      {/* <SidebarFooter /> */}
    </Sidebar>
  );
}
