"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FlightCalendarProps = {
    date: any
    setDate: any
    className?: string;
  } & React.HTMLAttributes<HTMLDivElement>;


export function FlightCalendar({date,
    setDate,
    className,
}: FlightCalendarProps) {
//   const [date, setDate] = React.useState<DateRange | undefined>({
//     from: new Date(2022, 0, 20),
//     to: addDays(new Date(2022, 0, 20), 20),
//   });

  return (
    <div className={cn("w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
        <Button
  id="date"
  variant={"outline"}
  className={cn(
    "w-full text-5xl justify-start text-left font-audimat border-0 border-b-2 bg-transparent hover:bg-transparent hover:text-white border-white/40 rounded-none"
  )}
>
  <div className="mb-6"> {/* Add margin-bottom here */}
    {!date?.from && !date?.to ? 
    (<div className="flex items-center">   
      Depart - Return
      <CalendarIcon size={28} className="ml-20" />
    </div>):(
        <div>
        {date?.from && format(date.from, 'MM/dd/yy')} - {date?.to && format(date.to, 'MM/dd/yy')}
      </div>
    )}
  </div>
</Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
