"use client";

import React from "react";
import { useVaults } from "royco/hooks";
import { LoadingSpinner } from "@/components/composables";

import { getSupportedToken } from "royco/constants";
import { TokenDisplayer } from "@/components/common";

/**
 * Formats a number to a compact string with K/M/B suffix
 * e.g., 1234 -> 1.2K, 1234567 -> 1.2M, 1234567890 -> 1.2B
 */
const formatCompactNumber = (value: number): string => {
  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  });

  // Format the number using the formatter
  let formatted = formatter.format(value);

  // Convert the notation to uppercase (k -> K, m -> M, b -> B)
  formatted = formatted
    .replace(/k/i, "K")
    .replace(/m/i, "M")
    .replace(/b/i, "B");

  return formatted;
};

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

  const displayedVaults = vaults.slice(0, 9);

  return (
    <div className="grid w-full grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
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
          capacity,
        } = vault;

        // Format TVL value as a number
        const tvlValue = tvl ? parseFloat(tvl) : 0;
        const formattedTVL = tvlValue ? formatCompactNumber(tvlValue) : "0";

        // Calculate used capacity percent based on TVL / capacity (maxing out at 100%)
        let usedCapacityPercent = 0;
        if (capacity && parseFloat(capacity) > 0) {
          usedCapacityPercent = Math.min(
            (tvlValue / parseFloat(capacity)) * 100,
            100
          );
        }
        const capacityDisplay = `${usedCapacityPercent.toFixed(0)}% Full`;

        return (
          <div
            key={id}
            className="flex min-h-[240px] flex-col overflow-hidden rounded-xl border border-gray-200/50 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          >
            {/* Title and Badges Container */}
            <div className="space-y-4">
              {/* Title */}
              <h3 className="text-xl leading-tight text-gray-900">
                {name || `Vault #${id}`}
              </h3>

              {/* Badges row */}
              <div className="flex items-center gap-2">
                {/* Chain Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white px-3 py-1.5 shadow-sm">
                  <span className="h-5 w-5 rounded-full bg-[#627EEA]" />
                  <span className="text-sm font-light text-gray-700">ETH</span>
                </div>

                {/* VEDA Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white px-3 py-1.5 shadow-sm">
                  <span className="text-base">🔒</span>
                  <span className="text-sm font-light text-gray-700">VEDA</span>
                </div>

                {/* TVL Badge */}
                <div className="inline-flex items-center rounded-full border border-gray-200/80 bg-white px-3 py-1.5 shadow-sm">
                  <span className="text-sm font-light text-gray-700">
                    ${formattedTVL} TVL
                  </span>
                </div>
              </div>
            </div>

            {/* APY and Rewards Section */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* APY Card */}
              <div className="flex flex-col rounded-lg border border-gray-200/80 bg-[#FBFBF8] p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">APY</span>
                  <div className="h-4 w-4 rounded-full border border-gray-300 text-center text-[10px] leading-4 text-gray-400">
                    i
                  </div>
                </div>
                <div className="text-[2rem] font-medium leading-tight text-gray-900">
                  {apy ? `${parseFloat(apy).toFixed(2)}%` : "0%"}
                </div>
              </div>

              {/* Rewards Card */}
              <div className="flex flex-col rounded-lg border border-gray-200/80 bg-[#FBFBF8] p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Rewards
                  </span>
                  <div className="h-4 w-4 rounded-full border border-gray-300 text-center text-[10px] leading-4 text-gray-400">
                    i
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {reward_assets?.length > 0 && (
                    <TokenDisplayer
                      tokens={reward_assets.map((tokenId: string) =>
                        getSupportedToken(tokenId)
                      )}
                      symbols={false}
                      hover
                      bounce
                      size={5}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-auto flex items-center justify-between border-t border-gray-200/80 pt-3">
              <div className="flex items-center gap-2">
                <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gray-400"
                    style={{ width: `${usedCapacityPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {capacityDisplay}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    active ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-xs font-medium text-gray-500">
                  {active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
