"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { isBefore, endOfDay } from "date-fns";

type FlightCalendarProps = {
  date: any;
  setDate: any;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function FlightCalendar({ date, setDate, className }: FlightCalendarProps) {
  //   const [date, setDate] = React.useState<DateRange | undefined>({
  //     from: new Date(2022, 0, 20),
  //     to: addDays(new Date(2022, 0, 20), 20),
  //   });

  return (
    <div className={cn("w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn("w-full rounded-none flex gap-x-2 justify-between")}>
            <span className="border-b-[1px] flex items-center gap-2 border-airlinelightgray pb-1">
              <span>{date?.from && format(date.from, "MM/dd/yy")}</span>{" "}
              <CalendarIcon className="text-airlinelightgray h-4 w-4" />
            </span>
            <span className="border-b-[1px] flex items-center gap-2 border-airlinelightgray pb-1">
              <span> {date?.to && format(date.to, "MM/dd/yy")}</span>{" "}
              <CalendarIcon className="text-airlinelightgray h-4 w-4" />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={(date) => isBefore(date, endOfDay(new Date()))}
            classNames={{
              day_selected:
                "bg-airlinedarkblue text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-airlinepink focus:text-primary-foreground",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
