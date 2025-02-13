"use client";

import React from "react";
import { useVaults } from "royco/hooks";
import { LoadingSpinner } from "@/components/composables";

/**
 * Displays vault data in 3-column card format.
 * Each card shows all relevant new columns from the updated table schema.
 */
export const VaultsTable = () => {
  // Example: you might pass in additional filter/sort/search states here
  const {
    data: vaults,
    isLoading,
    isError,
    error,
  } = useVaults({
    // Provide whatever filters/sorting/pagination you need
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

  // For demonstration, limit display to first 9 vaults
  const displayedVaults = vaults.slice(0, 9);

  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {displayedVaults.map((vault: any) => {
        const {
          id,
          chain_id,
          name,
          owner,
          partner,
          base_asset,
          apy,
          tvl,
          reward_assets,
          active,
          capacity,
          accepted_asset,
          underlying_contract,
          fee_structure,
        } = vault;

        return (
          <div
            key={id}
            className="rounded-md border border-divider bg-white p-4 shadow-sm"
          >
            <div className="mb-2 text-base font-semibold">
              {name || `Vault #${id}`}
            </div>
            <div className="text-sm text-secondary">
              <span className="font-medium">Chain ID:</span> {chain_id || "N/A"}
            </div>
            <div className="text-sm text-secondary">
              <span className="font-medium">Owner:</span> {owner || "N/A"}
            </div>
            <div className="text-sm text-secondary">
              <span className="font-medium">Partner:</span> {partner || "N/A"}
            </div>
            <div className="mt-2 text-sm text-secondary">
              <span className="font-medium">Base Asset:</span>{" "}
              {base_asset || "Unknown"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              <span className="font-medium">APY:</span> {apy ? `${apy}%` : "0%"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              <span className="font-medium">TVL:</span>{" "}
              {tvl
                ? `$${parseFloat(tvl).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}`
                : "--"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              <span className="font-medium">Active:</span>{" "}
              {active ? "Yes" : "No"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              <span className="font-medium">Capacity:</span>{" "}
              {capacity
                ? `$${parseFloat(capacity).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}`
                : "--"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              <span className="font-medium">Accepted Asset:</span>{" "}
              {accepted_asset || "--"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              <span className="font-medium">Underlying Contract:</span>{" "}
              {underlying_contract || "--"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              <span className="font-medium">Reward Assets:</span>{" "}
              {reward_assets && reward_assets.length > 0
                ? reward_assets.join(", ")
                : "--"}
            </div>
            <div className="mt-1 text-sm text-secondary">
              <span className="font-medium">Fee Structure:</span>{" "}
              {fee_structure && fee_structure.length > 0
                ? fee_structure
                    .map((feeObj: any) => {
                      const mgmt = feeObj.management_fee || "N/A";
                      const perf = feeObj.performance_fee || "N/A";
                      return `Mgmt: ${mgmt}, Perf: ${perf}`;
                    })
                    .join(" | ")
                : "--"}
            </div>
          </div>
        );
      })}
    </div>
  );
};
