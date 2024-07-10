import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowRight } from "lucide-react";
import { truncateString } from "@/utils/utils";

const NewsCards = ({ newsCardContent }: { newsCardContent: any }) => {
  return (
    <div
      className="flex w-full h-full border-0 flex-col grid-rows-2
      shadow-2xl rounded-none bg-gradient-airways "
    >
      <div
        className=" font-sohne text-white mx-8 my-8 flex flex-col gap-y-10  h-full sm:h-[20rem] lg:h-[10rem] 
      overflow-y-auto text-ellipsis "
      >
        <p className=" text-base font-sohnelight">{newsCardContent?.newsCategory}</p>
        <p className=" pt-2 text-2xl  text-left">
          {truncateString(newsCardContent?.title, 100)}
        </p>
      </div>
      <img src={newsCardContent?.imgSrc} className="w-full h-[15rem] object-cover" />
    </div>
  );
};

export default NewsCards;
