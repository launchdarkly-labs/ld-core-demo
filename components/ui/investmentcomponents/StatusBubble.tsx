import React from "react";

const statusStyles = {
  success: "bg-[#D9F9EB] text-investmentgreen",
  processing: "bg-[#FCF6E2] text-[#EEC340]",
  failed: "bg-gray-100 text-gray-800",
};

type StatusType = keyof typeof statusStyles;

const getStatusStyle = (status: string): string => {
  return statusStyles[status as StatusType] || statusStyles.failed;
};

interface StatusBubbleProps {
  status: string;
}

const StatusBubble = ({ status }: StatusBubbleProps) => {
  return (
    <span
      className={` ${getStatusStyle(status)} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize`}
    >
      {status}
    </span>
  );
};

export default StatusBubble;
