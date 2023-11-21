import React, { useEffect, useRef } from "react";
import { Search, MessageCircle, Menu, PanelTopOpen, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";

//Change QRURL to the URL where you'll be hosting this app

const QRCodeImage = () => {
  const url = new URL(window.location.href);
  const QRURL = url.href;
  const qrCodeRef = useRef();

  // useEffect(() => {
  //   if (!qrCodeRef || !qrCodeRef.current || !qrCodeRef.current.style) return;

  //   if (window?.innerWidth > 640) {
  //     qrCodeRef.current.style.height = "40vh";
  //     qrCodeRef.current.style.width = "50vw";
  //   }

  //   let throttleTimer;

  //   const throttle = (callback, time) => {
  //     if (throttleTimer) return;
  //     throttleTimer = true;
  //     setTimeout(() => {
  //       callback();
  //       throttleTimer = false;
  //     }, time);
  //   };

  //   const resizeQRCode = () => {
  //     if (!qrCodeRef || !qrCodeRef.current || !qrCodeRef.current.style) return;

  //     if (window?.innerWidth > 640) {
  //       qrCodeRef.current.style.height = "40vh";
  //       qrCodeRef.current.style.width = "50vw";
  //     }

  //     if (window?.innerWidth <= 640) {
  //       qrCodeRef.current.style.height = "256px";
  //       qrCodeRef.current.style.width = "256px";
  //     }
  //   };

  //   if (window?.attachEvent) {
  //     window?.attachEvent("onresize", function () {
  //       alert("attachEvent - resize");
  //     });
  //   } else if (window?.addEventListener) {
  //     window?.addEventListener(
  //       "resize",
  //       () => {
  //         throttle(resizeQRCode, 500);
  //       },
  //       true
  //     );
  //   }

  //   return () => {
  //     window.removeEventListener(
  //       "resize",
  //       () => {
  //         throttle(resizeQRCode, 500);
  //       },
  //       false
  //     );
  //   };
  // }, []);

  return (
    // The React SDK automatically converts flag keys with dashes and periods to camelCase.
    // See this page for details: https://docs.launchdarkly.com/sdk/client-side/react/react-web#flag-keys

    <>
      <Dialog>
        <DialogTrigger asChild>
          <QrCode className="w-full h-full"/>
        </DialogTrigger>
        <DialogContent>
          <div className="">
            <h1 className="text-slate-900 text-center text-3xl sm:text-4xl 2xl:text-5xl font-semibold">
              Scan me!
            </h1>
            <div className="flex justify-center w-full h-full mt-5">
              <QRCode value={QRURL} ref={qrCodeRef} data-testid="qr-app-qr-code-image-test-id" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRCodeImage;
