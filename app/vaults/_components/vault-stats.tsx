"use client";

import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { produce } from "immer";
import { isEqual } from "lodash";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";

// Placeholder hook for vault stats. In the future, replace with a hook that fetches real vault stats data.
const useEnrichedVaultStats = () => {
  // Placeholder data: deposits, vault_tvl, earnings
  const data = {
    volume: 0,
    vault_tvl: 0,
    rewards: 0,
  };
  const isLoading = false;
  const isRefetching = false;
  return { data, isLoading, isRefetching };
};

export const VaultStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data, isLoading, isRefetching } = useEnrichedVaultStats();

  const [placeholderDatas, setPlaceholderDatas] = useImmer([
    { deposits: 0, vault_tvl: 0, earnings: 0 },
    { deposits: 0, vault_tvl: 0, earnings: 0 },
  ]);

  useEffect(() => {
    if (
      !isLoading &&
      data !== undefined &&
      data !== null &&
      !isEqual(data, placeholderDatas[1])
    ) {
      setPlaceholderDatas((prevDatas: any) => {
        return produce(prevDatas, (draft: any) => {
          draft.push(data);
          if (draft.length > 2) {
            draft.shift();
          }
        });
      });
    }
  }, [data, isLoading, isRefetching, placeholderDatas, setPlaceholderDatas]);

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-3 place-content-center items-center justify-end gap-3 lg:w-fit xl:flex xl:flex-nowrap",
        className
      )}
      {...props}
    >
      {[
        { key: "volume", name: "Total Volume" },
        { key: "vault_tvl", name: "Total Value Locked" },
        { key: "rewards", name: "Rewards" },
      ].map((item) => (
        <div
          key={`vault-stats:${item.key}`}
          className="flex flex-col items-start rounded-xl border border-divider bg-white p-3 pb-1"
        >
          <div className="caption text-secondary">{item.name}</div>
          <div className="money-3 mt-1 w-full text-primary">
            <AnimatePresence mode="sync">
              {data ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <SpringNumber
                    // @ts-ignore
                    previousValue={placeholderDatas[0][item.key]}
                    // @ts-ignore
                    currentValue={data[item.key] || 0}
                    numberFormatOptions={{
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                  />
                </motion.div>
              ) : (
                <div className="relative flex w-full flex-col place-content-center items-center">
                  <div className="text-transparent">.</div>
                  <div className="absolute inset-0 flex flex-col place-content-center items-center">
                    <LoadingSpinner className="h-5 w-5" />
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
});
