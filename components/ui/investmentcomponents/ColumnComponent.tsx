import React from "react";

const ColumnComponent = ({
  children,
  columnWrapperOverride = "",
}: {
  children: any;
  columnWrapperOverride: string;
}) => {
  return (
    <div
      className={`flex flex-col flex-1 basis-[100%] ${columnWrapperOverride} w-full sm:w-[10rem]`}
    >
      {children}{" "}
    </div>
  );
};

export default ColumnComponent;
