import React from 'react';
import { cn } from "@/utils/utils"

export const CSCard = ({className, cardTitle, cardSubtitle,  icon}: {className: string, cardTitle: string, cardSubtitle: string,  icon: any}) => {
  return (
    <div className={cn("card w-full p-10 rounded-2xl text-white  font-sohned", className)}>
      <div className="flex flex-col justify-between gap-y-6 items-start">
        <img src={icon.src} alt={cardTitle} className='h-8 w-8'/>
        <div className="flex flex-col gap-y-2">
        <p className='text-xl font-medium'>{cardTitle}</p>
        <p className='text-base font-normal'>{cardSubtitle}</p>
        </div>

      </div>
    </div>
  );
};


