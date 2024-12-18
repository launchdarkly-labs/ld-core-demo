import React, { useEffect, useRef } from "react";
import { Search, MessageCircle, Menu, PanelTopOpen, Scroll } from "lucide-react";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";

const LiveLogsPopUp = ({ textColor = "text-black" }: { textColor?: string }) => {
  const url = new URL(window.location.href);
  const QRURL = url.href;

  return (
    // The React SDK automatically converts flag keys with dashes and periods to camelCase.
    // See this page for details: https://docs.launchdarkly.com/sdk/client-side/react/react-web#flag-keys

    <>
      <Dialog>
        <DialogTrigger
          asChild
          className="h-12 w-12 fixed bg-purple-500  bottom-4 left-4 cursor-pointer rounded-md p-2"
        >
          <Scroll className={` ${textColor}`} />
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col gap-y-4 items-center">
            <h1 className="text-slate-900 text-center text-3xl sm:text-4xl 2xl:text-5xl font-semibold">
              Scan me!
            </h1>
            <div className="w-full h-full lg:w-[80%] 2xl:w-[100%] p-4 border-2 border-black rounded-md">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={QRURL}
                viewBox={`0 0 256 256`}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LiveLogsPopUp;
