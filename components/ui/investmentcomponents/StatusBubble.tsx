import React from "react";

const statusStyles = {
  success: "bg-[#D9F9EB] text-investmentgreen",
  processing: "bg-[#FCF6E2] text-[#EEC340]",
  failed: "bg-gray-100 text-gray-800",
};

const StatusBubble = ({ status }: { status: string }) => {
  return (
    <span
      className={` ${statusStyles[status]} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize`}
    >
      {status}
    </span>
  );
};

export default StatusBubble;
