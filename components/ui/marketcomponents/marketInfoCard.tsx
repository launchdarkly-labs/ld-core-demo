import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react"

const MarketInfoCard = ({
  headerTitleText,
  subtitleText,
  imgSrc,
}: {
  headerTitleText: string;
  subtitleText: string;
  imgSrc: any;
}) => {
  return (
    <div className="flex w-full h-full sm:w-[375px] sm:h-[375px] border-0 flex-col grid-rows-2
    bg-market-header text-white shadow-2xl z-0 !rounded-none relative">
      <div className="!space-y-0 !p-0">
      <img src={imgSrc} className="w-full h-60 object-fill ov" />
            </div>
      <div className="p-8 flex flex-col gap-y-2 bg-market-header h-full">
        <div className="font-sohne text-white">
          <p className=" text-2xl">{headerTitleText}</p>
        </div>
        <div className="p-0 ">
          <p className=" pt-2 text-lg font-sohnelight text-left">{subtitleText}</p>
        </div>
      </div>
    </div>
  );
};

export default MarketInfoCard;