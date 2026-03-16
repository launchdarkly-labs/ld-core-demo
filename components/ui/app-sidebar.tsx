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
import { Clock, Eye, EyeOff, Trash2, Terminal } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";
import { Highlight, themes } from "prism-react-renderer";

interface BackendLog {
  timestamp: string;
  level: string;
  message: string;
  name: string;
  sessionId?: string;
}

function BackendLogsPanel() {
  const [logs, setLogs] = useState<BackendLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/logs/stream");

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onmessage = (event) => {
      try {
        const logEntry: BackendLog = JSON.parse(event.data);
        if (logEntry.level === "HEARTBEAT") return;
        setLogs((prev) => [...prev, logEntry]);
      } catch {}
    };
    eventSource.onerror = () => setIsConnected(false);

    return () => eventSource.close();
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getLogColor = (log: BackendLog) => {
    if (log.name === "guardrails-on") return "text-green-400 font-bold";
    if (log.name === "guardrails-off") return "text-red-400 font-bold";
    if (log.name === "toxicity-resend") return "text-red-400 font-bold";
    if (log.level === "ERROR") return "text-red-400";
    if (log.level === "WARN") return "text-yellow-400";
    return "text-gray-300";
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden -mx-4 -mb-4" style={{ minHeight: "calc(100vh - 10rem)" }}>
      <div className="flex items-center justify-between px-3 py-2 bg-[#2d2d2d] border-b border-[#3e3e3e] shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-semibold font-mono">Backend Terminal</span>
          <span
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" : "bg-gray-500"
            }`}
          />
        </div>
        <button
          onClick={() => setLogs([])}
          className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded hover:bg-[#3e3e3e]"
          title="Clear logs"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
        {logs.length === 0 ? (
          <div className="text-gray-500 py-4">
            <p>Waiting for logs...</p>
            {!isConnected && <p className="text-red-400 mt-2">Not connected to server</p>}
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`mb-1 ${getLogColor(log)}`}>
              <span className="whitespace-pre-wrap break-words">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}

export function AppSidebar() {
  const { currentLDFlagEnvValues, liveLogs } = useContext(LiveLogsContext);
  const [toggleCodeBoxObj, setToggleCodeBoxObj] = useState({});

  return (
    <Sidebar side={"right"} variant={"sidebar"} collapsible={"offcanvas"}>
      {/* <SidebarHeader /> */}
      <SidebarContent className="bg-white flex flex-col p-4" id="sidebar-content">
        <Tabs defaultValue="env_values" className="">
          <TabsList className="w-full grid grid-cols-1 lg:grid-cols-1 mb-4 h-[7.5rem]">
            <TabsTrigger value="env_values" className="text-wrap truncate">
              Current Values in your Environment
            </TabsTrigger>
            <TabsTrigger value="live_logs" className="">
              Live Logs
            </TabsTrigger>
            <TabsTrigger value="backend_logs" className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" />
              Backend Logs
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
          <TabsContent value="backend_logs" className="flex-1">
            <BackendLogsPanel />
          </TabsContent>
        </Tabs>
      </SidebarContent>
      {/* <SidebarFooter /> */}
    </Sidebar>
  );
}
