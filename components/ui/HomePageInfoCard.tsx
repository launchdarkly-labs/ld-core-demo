import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowRight } from "lucide-react";

const HomePageInfoCard = ({
  headerTitleText,
  subtitleText,
  imgSrc,
}: {
  headerTitleText: string;
  subtitleText: string;
  imgSrc: any;
}) => {
  return (
    <div
      className="flex w-full h-full sm:w-[375px] border-0 flex-col grid-rows-2
     bg-white shadow-2xl z-0 !rounded-none relative"
    >
      <img src={imgSrc} className="w-full h-[15rem] object-cover" />
      <div className="p-8 flex flex-col gap-y-2 bg-white h-full">
        <div className="font-sohne text-black">
          <p className=" text-2xl">{headerTitleText}</p>
        </div>
        <div className="p-0 ">
          <p className=" pt-2 text-lg font-sohnelight text-left">{subtitleText}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePageInfoCard;
