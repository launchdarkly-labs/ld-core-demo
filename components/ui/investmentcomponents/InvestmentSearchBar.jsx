import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const InvestmentSearchBar = () => {
  const onSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form className="w-full mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 mb-4" onSubmit={onSubmit}>
      <div className="flex gap-x-4">
        <label htmlFor="investment-search" className="sr-only">
          Search
        </label>
        <Input
          classInputWrapperOverride="!w-full"
          classInputOverride ="!bg-white"
          id="name"
          name="name"
          type="name"
          placeholder="Search"
        />
        <Button classButtonOverride="!bg-button !text-button-text">Submit</Button>
      </div>
    </form>
  );
};

export default InvestmentSearchBar;
