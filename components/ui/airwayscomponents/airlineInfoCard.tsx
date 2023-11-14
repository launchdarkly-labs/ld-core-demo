import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="flex sm:w-[340px] h-auto border-0 relative flex-col justify-center items-center animate-fade-in grid-rows-2 bg-slate-900 z-0 !rounded-none">
      <CardHeader className="!space-y-0 !p-0">
        <img src={imgSrc.src} className="mx-auto" />
      </CardHeader>
      <div className="py-[3rem] px-[1rem]">
        <CardTitle className="flex justify-center">
          <p className="font-bold text-3xl text-gray-300 text-center">{headerTitleText}</p>
        </CardTitle>
        <CardContent className="p-0">
          <p className="text-gray-300 pt-2 text-lg text-center">{subtitleText}</p>
        </CardContent>
      </div>
    </Card>
  );
};

export default AirlineInfoCard;
