import React from "react";

interface SignUpProgressIndicatorProps {
  pageNumber: number;
}

export default function SignUpProgressIndicator({ pageNumber }: SignUpProgressIndicatorProps) {
  const steps = [1, 2, 3];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-medium ${
              step <= pageNumber
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < pageNumber ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
} 