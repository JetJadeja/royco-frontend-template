"use client";

import React from "react";
import { useVaults } from "royco/hooks";
import { LoadingSpinner } from "@/components/composables";

/**
 * Displays vault data in a multi-column card format,
 * matching a design that shows:
 * - Vault name, chain label, partner label, TVL in top row
 * - APY on the left, Rewards on the right
 * - Capacity usage bar, capacity text, and active state in bottom row
 */
export const VaultsTable = () => {
  const {
    data: vaults,
    isLoading,
    isError,
    error,
  } = useVaults({
    chain_id: undefined,
    page_index: 0,
    page_size: 20,
    search_key: "",
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

  // For demonstration, limit display to the first 9 vaults
  const displayedVaults = vaults.slice(0, 9);

  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {displayedVaults.map((vault: any) => {
        const {
          id,
          chain_id,
          name,
          partner,
          apy,
          tvl,
          reward_assets = [],
          active,
          capacity = 500000, // for demonstration
        } = vault;

        // For capacity usage demo
        const usedCapacityPercent = 88; // placeholder, or calculate from vault data
        const capacityDisplay = `${usedCapacityPercent}% Full`;

        return (
          <div
            key={id}
            className="flex flex-col rounded-xl border border-divider bg-white p-4 shadow-sm"
          >
            {/* Top row: Name, chain, partner, TVL */}
            <div className="flex flex-col">
              <div className="text-lg font-semibold text-black">
                {name || `Vault #${id}`}
              </div>

              <div className="mt-2 flex flex-row flex-wrap items-center gap-2 text-sm text-secondary">
                {/* Chain label (placeholder - "ETH") */}
                <div className="flex items-center rounded-full border border-divider px-2 py-1">
                  ETH
                </div>

                {/* Partner label */}
                <div className="flex items-center rounded-full border border-divider px-2 py-1">
                  {partner || "Unknown"}
                </div>

                {/* TVL */}
                <div className="flex items-center rounded-full border border-divider px-2 py-1">
                  {tvl
                    ? `$${parseFloat(tvl).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })} TVL`
                    : "$0 TVL"}
                </div>
              </div>
            </div>

            {/* Middle section: APY on left, Rewards on right */}
            <div className="mt-4 flex flex-row items-stretch justify-between gap-4">
              {/* APY card */}
              <div className="flex grow flex-col rounded-md border border-divider bg-[#FBFBF8] p-4">
                <div className="flex flex-row items-center justify-between text-secondary">
                  <span className="text-xs font-medium">APY</span>
                  {/* Info icon, if desired */}
                </div>
                <div className="mt-1 text-3xl font-bold text-black">
                  {apy ? `${parseFloat(apy).toFixed(2)}%` : "0%"}
                </div>
              </div>

              {/* Rewards card */}
              <div className="flex grow flex-col rounded-md border border-divider bg-[#FBFBF8] p-4">
                <div className="flex flex-row items-center justify-between text-secondary">
                  <span className="text-xs font-medium">Rewards</span>
                  {/* Info icon, if desired */}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {reward_assets.length > 0
                    ? reward_assets.map((asset: string, index: number) => (
                        <div
                          key={index}
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600"
                        >
                          {asset}
                        </div>
                      ))
                    : "--"}
                </div>
              </div>
            </div>

            {/* Bottom row: capacity usage, active status */}
            <div className="mt-4 flex flex-row items-center justify-between border-t border-divider pt-3 text-sm text-secondary">
              {/* Capacity bar + text */}
              <div className="flex flex-row items-center space-x-3">
                <div className="relative h-2 w-24 rounded-full bg-gray-200">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gray-500"
                    style={{ width: `${usedCapacityPercent}%` }}
                  />
                </div>
                <div className="text-black">{capacityDisplay}</div>
              </div>

              {/* Active or not */}
              <div className="flex items-center space-x-1">
                <div
                  className={`h-2 w-2 rounded-full ${
                    active ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-black">{active ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};