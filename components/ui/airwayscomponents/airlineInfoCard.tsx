import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react"

const AirlineInfoCard = ({
  headerTitleText,
  subtitleText,
  imgSrc,
}: {
  headerTitleText: string;
  subtitleText: string;
  imgSrc: any;
}) => {
  return (
    <Card className="flex w-full h-[550px] lg:w-[340px] lg:h-[430px] border-0 flex-col animate-fade-in grid-rows-2
     bg-slate-900 z-0 !rounded-none relative">
      <CardHeader className="!space-y-0 !p-0">
        <img src={imgSrc.src} className="w-full h-full object-fit" />
      </CardHeader>
      <div className="pt-[2.5rem] px-[2.5rem] flex flex-col gap-y-2 bg-gradient-airways h-full">
        <CardTitle className="!font-normal !text-left">
          <p className=" text-2xl text-white ">{headerTitleText}</p>
        </CardTitle>
        <CardContent className="p-0 ">
          <p className="text-white pt-2 text-lg !font-normal text-left">{subtitleText}</p>
        </CardContent>

        <ArrowRight className="h-10 w-10 sm:h-6 sm:w-6 text-white cursor-pointer mt-auto absolute bottom-0 mb-6" />
      </div>
    </Card>
  );
};

export default AirlineInfoCard;
