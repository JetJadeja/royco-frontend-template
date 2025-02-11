"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface VaultPaginationProps extends React.HTMLAttributes<HTMLDivElement> {}

export const VaultPagination: React.FC<VaultPaginationProps> = ({
  className,
  ...props
}) => {
  // Dummy pagination state for vaults
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Dummy total number of pages

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div
      className={cn("flex items-center justify-center gap-4 py-4", className)}
      {...props}
    >
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="btn btn-sm"
      >
        Previous
      </button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="btn btn-sm"
      >
        Next
      </button>
    </div>
  );
};
