import React from 'react';
import { cn } from "@/lib/utils"

export const CSCard = ({className, herotext}: {className: any, herotext: any}) => {
  return (
    <div className={cn("card w-full py-12 rounded-2xl text-white", className)}>
      <div className="card-content p-4">
        <p className='font-sohned text-lg'>{herotext}</p>
      </div>
    </div>
  );
};


