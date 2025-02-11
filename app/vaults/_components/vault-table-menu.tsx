"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { isEqual } from "lodash";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { Switch } from "../../../components/ui/switch";
import { usePathname } from "next/navigation";

// Import shared UI components, which can be reused as-is
// import { ViewSelector } from "../../explore/_components/ui";
// If needed, you can also import AssetsFilter, ChainsFilter, etc.
import { PoolTypeFilter } from "../../explore/_components/ui/pool-type-filter";
import { AssetsFilter } from "../../explore/_components/ui/assets-filter";
import { ChainsFilter } from "../../explore/_components/ui/chains-filter";

// Import our vault-specific view selector
import { VaultViewSelector } from "./vault-view-selector";

// Dummy vault explore hook to manage vault view state for filtering and sorting
const useVaultExplore = () => {
  const [vaultView, setVaultView] = useState("default");
  const [vaultAll, setVaultAll] = useState(true);
  return { vaultView, setVaultView, vaultAll, setVaultAll };
};

// Dummy hook to simulate fetching vault data for the table menu
const useEnrichedVaults = (_params: {
  sorting: any;
  filters: any[];
  page_index: number;
  search_key: string;
  custom_token_data: any[];
}) => {
  // Return static dummy data: count of vaults
  return { isLoading: false, isError: false, isRefetching: false, count: 0 };
};

// Define table menu props
type TableMenuProps = React.HTMLAttributes<HTMLDivElement> & {};

export const VaultTableMenu = React.forwardRef<HTMLDivElement, TableMenuProps>(
  ({ className }, ref) => {
    const pathname = usePathname();
    // For vaults, the verified filter might not apply, but we mimic the same pattern
    const showVerifiedVault = useMemo(
      () => (pathname === "/vaults" ? true : false),
      [pathname]
    );

    // Use our dummy vault explore hook
    const { vaultView, setVaultView, vaultAll, setVaultAll } =
      useVaultExplore();

    // Placeholder data state for count, mimicking the behavior in the explore TableMenu
    const [placeholderDatas, setPlaceholderDatas] = useImmer([null, null]);

    // Dummy variables for vault filters and sorting
    const vaultSorting = {};
    const vaultFilters: any[] = [];
    const vaultSearchKey = "";
    const vaultPageIndex = 1;
    const customTokenData: any[] = [];

    // Use our dummy hook to simulate vault data
    const { isLoading, isError, isRefetching, count } = useEnrichedVaults({
      sorting: vaultSorting,
      filters: vaultFilters,
      page_index: vaultPageIndex,
      search_key: vaultSearchKey,
      custom_token_data: customTokenData,
    });

    // Update placeholderDatas with the latest vault count
    useEffect(() => {
      if (!isLoading && count != null && !isEqual(count, placeholderDatas[1])) {
        setPlaceholderDatas((prevDatas: any) => {
          const newData = [...prevDatas, count];
          if (newData.length > 2) {
            return newData.slice(1);
          }
          return newData;
        });
      }
    }, [count, isLoading, placeholderDatas, setPlaceholderDatas]);

    return (
      <div
        ref={ref}
        style={{ height: "fit-content" }}
        className={cn(
          "flex h-full w-full shrink-0 flex-col overflow-y-scroll rounded-[1.25rem] border border-divider bg-white md:max-h-[80vh]",
          className
        )}
      >
        <div className="body-2 sticky top-0 z-20 flex h-16 shrink-0 flex-row place-content-center items-center justify-between border-b border-divider bg-white px-5 text-primary">
          <h3 className="flex flex-row items-center gap-2">
            <div className="tabular-nums">
              {isLoading ? (
                <LoadingSpinner className="inline-block h-4 w-4" />
              ) : (
                <SpringNumber
                  previousValue={placeholderDatas[0] || 0}
                  currentValue={count || 0}
                  numberFormatOptions={{
                    style: "decimal",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }}
                />
              )}
            </div>
            Vaults
          </h3>
          {/* Additional header elements (e.g., toggle switches) can be added here if needed */}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-4">
            <VaultViewSelector />
            <div className="body-2 mt-4 flex flex-col gap-2 text-primary">
              <h5 className="">Input Asset</h5>

              <div className="flex flex-wrap gap-2">
                <AssetsFilter />
              </div>
            </div>
            <div className="body-2 mt-[1.375rem] flex flex-col gap-2 text-primary">
              <h5 className="">Chain</h5>

              <div className="flex flex-wrap gap-2">
                <ChainsFilter />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
