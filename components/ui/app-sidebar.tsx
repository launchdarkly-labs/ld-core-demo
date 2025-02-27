import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import { PulseLoader } from "react-spinners";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";
import { Highlight, themes } from "prism-react-renderer";

export function AppSidebar() {
  const { currentLDFlagEnvValues, liveLogs } = useContext(LiveLogsContext);
  const [toggleCodeBoxObj, setToggleCodeBoxObj] = useState({});

  return (
    <Sidebar side={"right"} variant={"sidebar"} collapsible={"offcanvas"}>
      {/* <SidebarHeader /> */}
      <SidebarContent className="bg-white flex flex-col p-4" id="sidebar-content">
        <Tabs defaultValue="env_values" className="">
          <TabsList className="w-full grid  grid-cols-1 lg:grid-cols-1 mb-4 h-[5rem]">
            <TabsTrigger value="env_values" className="text-wrap truncate">
              Current Values in your Environment
            </TabsTrigger>
            <TabsTrigger value="live_logs" className="">
              Live Logs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="env_values">
            <div className="mb-4 text-center border-[1px] border-slate-500 rounded-lg p-2 flex items-center justify-center gap-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <h2>Connected to LaunchDarkly</h2>
            </div>
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
          <TabsContent value="live_logs">
            <div className="flex  bg-gray-200 w-max rounded-md items-center gap-x-2 py-1 px-2 mb-4">
              <h2 className="text-xs">Monitoring Events </h2>
              <PulseLoader className="" size={6} speedMultiplier={0.5} color={"gray"} />
            </div>

            {liveLogs.toReversed().map((log: any, index: number) => {
              return (
                <Card className="mb-2" key={index}>
                  <CardContent className="p-4 w-full overflow-x-auto">
                    <div className={` ${log.color} rounded-md py-1 px-2 w-max mb-10 text-xs`}>
                      {log.type}
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
                        {`${
                          log.date.getMonth() + 1
                        }/${log.date.getDate()}/${log.date.getFullYear()} ${log.date.getHours()}:${log.date.getMinutes()}:${log.date.getSeconds()}`}
                      </div>
                    </div>
                    {/* @ts-ignore */}
                    {toggleCodeBoxObj[index] ? (
                      <div className="w-full ">
                        <Highlight theme={themes.shadesOfPurple} code={log.log} language="tsx">
                          {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre
                              style={style}
                              className="w-full overflow-x-auto p-4 text-wrap rounded-lg  shadow-lg "
                            >
                              {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })}>
                                  <span className="mr-2">{i + 1}</span>
                                  {line.map((token, key) => (
                                    <span
                                      key={key}
                                      {...getTokenProps({ token })}
                                      className={className}
                                    />
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
