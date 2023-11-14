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
    <Card className="flex sm:w-[340px] sm:h-[430px] border-0 flex-col relative animate-fade-in grid-rows-2 bg-slate-900 z-0 !rounded-none">
      <CardHeader className="!space-y-0 !p-0">
        <img src={imgSrc.src} className="w-full h-full" />
      </CardHeader>
      <div className="p-[2.5rem] flex flex-col gap-y-2">
        <CardTitle className="flex justify-center !font-normal">
          <p className=" text-3xl text-gray-300 text-center">{headerTitleText}</p>
        </CardTitle>
        <CardContent className="p-0 ">
          <p className="text-gray-300 pt-2 text-lg !font-normal text-center">{subtitleText}</p>
        </CardContent>

        <ArrowRight className="h-6 w-6 text-airlinePurple cursor-pointer mt-auto" />
      </div>
    </Card>
  );
};

export default AirlineInfoCard;
