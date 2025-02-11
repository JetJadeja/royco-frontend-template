"use client";

import React from "react";
import { useVaults } from "royco/hooks";
import { LoadingSpinner } from "@/components/composables";

/**
 * Displays vault data in 3-column card format (3 rows per page, total 9 vaults).
 * Each card shows title, base asset, tvl, manager, capacity, active status (or placeholders).
 */
export const VaultsTable = () => {
  // Example: you might pass in additional filter/sort/search states here
  const {
    data: vaults,
    isLoading,
    isError,
    error,
    count,
  } = useVaults({
    chain_id: "", // or a default chain ID value
    page_index: 0,
    page_size: 20,
    search_key: "", // adjust as needed
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center p-5">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-5">
        <p className="text-red-600">
          Error loading vaults: {error instanceof Error ? error.message : null}
        </p>
      </div>
    );
  }

  if (!vaults || vaults.length === 0) {
    return (
      <div className="p-5">
        <p>No vaults found.</p>
      </div>
    );
  }

  // For demonstration, limit display to 9 vaults (3 rows * 3 columns)
  const displayedVaults = vaults.slice(0, 9);

  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {displayedVaults.map((vault: any) => {
        const {
          id,
          name,
          title,
          base_asset,
          tvl_usd,
          manager,
          capacity_usage,
          active,
        } = vault;

        return (
          <div
            key={id}
            className="rounded-md border border-divider bg-white p-4 shadow-sm"
          >
            <div className="text-base font-semibold">
              {title || name || `Vault #${id}`}
            </div>
            <div className="mt-2 text-sm text-secondary">
              Base Asset: {base_asset || "Unknown Asset"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              TVL:{" "}
              {tvl_usd
                ? `$${tvl_usd.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}`
                : "--"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              Manager: {manager || "Unknown Manager"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              Capacity: {capacity_usage || "N/A"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              Active: {active ? "Active" : "Inactive"}
            </div>
          </div>
        );
      })}
    </div>
  );
};