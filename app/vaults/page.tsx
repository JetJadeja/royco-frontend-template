"use client";

import React from "react";
import { cn } from "@/lib/utils";
// TODO: Implement the VaultsTable component similar to MarketsTable
import { VaultsTable } from "./_components/vaults-table";

const Page = () => {
  return (
    <div
      className={cn(
        "flex min-h-screen w-full flex-col items-center bg-[#FBFBF8] p-12",
        "px-3 py-3 md:px-12"
      )}
    >
      <h1 className="mb-6 text-3xl font-bold">Vaults</h1>
      {/* Render a table or list of vaults below */}
      <VaultsTable />
    </div>
  );
};

export default Page;
