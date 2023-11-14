import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AirlineInfoCard = ({headerTitleText, subtitleText, imgSrc}: {headerTitleText: string, subtitleText: string, imgSrc: string} ) => {
  return (
    <Card className="flex w-[320px] h-auto border-0 relative flex-col justify-center items-center animate-fade-in grid-rows-2 bg-slate-900 z-0">
      <CardHeader>
        <img src={imgSrc} className="mx-auto" />
      </CardHeader>
      <CardTitle className="flex justify-center p-2 py-4">
        <p className="font-bold text-3xl text-gray-300 font-audimat text-center">
          {headerTitleText}
        </p>
      </CardTitle>
      <CardContent>
        <p className="text-gray-300 font-robotolight pt-2 text-lg text-center">
          {subtitleText}
        </p>
      </CardContent>
    </Card>
  );
};

export default AirlineInfoCard;
