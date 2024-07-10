import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowRight } from "lucide-react";
import { truncateString } from "@/utils/utils";

const NewsCards = ({ newsCardContent }: { newsCardContent: any }) => {
  return (
    <div
      className="flex w-full h-full border-0 flex-col grid-rows-2
     bg-white shadow-2xl rounded-none "
    >

      <div
        className=" font-sohne text-black mx-8 my-6 flex flex-col gap-y-2 bg-white  h-full sm:h-[20rem] lg:h-[10rem] 
      overflow-y-auto text-ellipsis "
      >
        <p className=" text-2xl">{newsCardContent?.title}</p>
        <p className=" pt-2 text-lg font-sohnelight text-left">
          {truncateString(newsCardContent?.newsCategory, 100)}
        </p>
      </div>
      <img src={newsCardContent?.imgSrc} className="w-full h-[15rem] object-cover" />
    </div>
  );
};

export default NewsCards;
