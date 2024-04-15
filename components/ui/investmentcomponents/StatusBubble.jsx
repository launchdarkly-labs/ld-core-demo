import React from 'react'
import clsx from "clsx";

const statusStyles = {
    success: "bg-green-100 text-green-800",
    processing: "bg-yellow-100 text-yellow-800",
    failed: "bg-gray-100 text-gray-800",
  };

const StatusBubble = ({status}) => {
  return (
    <span
    className={clsx(
      statusStyles[status],
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
    )}
  >
    {status}
  </span>
  )
}

export default StatusBubble