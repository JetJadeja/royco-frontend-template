"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MobileMenu, SearchBar } from "../explore/_components";
import "../explore/local.css";

import { ColumnToggler, Sorter } from "../explore/_components/ui";
import { Pagination } from "../explore/_components/pagination";
import { Protector } from "../protector";
import { MAX_SCREEN_WIDTH } from "@/components/constants";
import { VaultsTable } from "./_components/vaults-table";
import { VaultStats } from "./_components/vault-stats";
import { VaultTableMenu } from "./_components/vault-table-menu";

const Page = () => {
  const Content = () => {
    return (
      <div className="hide-scrollbar flex flex-col items-center bg-[#FBFBF8] px-3 md:px-12">
        {/**
         * @title Header Bar
         * @description Header Tilte + Tagline + Stats
         */}
        <div
          className={cn(
            "mt-9 flex w-full shrink-0 flex-col items-start justify-center px-3 pt-3 md:mt-12 md:px-12 lg:flex-row lg:items-center lg:justify-between",
            "gap-7 md:gap-3 xl:gap-12",
            MAX_SCREEN_WIDTH,
            "px-0 md:px-0"
          )}
        >
          <div className="flex flex-col items-start justify-start">
            <h2 className="heading-2 text-black">Vaults</h2>
            <div className="body-1 mt-2 text-secondary">
              Access Royco Markets through strategies run by great partners.
            </div>
          </div>

          <VaultStats className="flex-1" />
        </div>

        <div
          className={cn(
            "hide-scrollbar flex w-full flex-row items-start space-x-0 p-3 pb-12 md:p-12 lg:space-x-3",
            "mt-7 md:mt-0",
            MAX_SCREEN_WIDTH,
            "px-0 md:px-0"
          )}
        >
          <div
            style={{
              height: "fit-content",
              maxHeight: "80vh",
            }}
            className="hidden w-3/12 md:max-h-[80vh] lg:block"
          >
            <VaultTableMenu />
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 lg:w-9/12">
            <div className="flex w-full flex-col items-center justify-between md:flex-row">
              <div className="mr-3 hidden md:flex lg:hidden">
                <MobileMenu />
              </div>

              <SearchBar />

              <div className="hidden h-[2.875rem] w-fit flex-row items-center space-x-3 md:flex">
                {/* <Sorter /> */}

                <ColumnToggler />
              </div>

              <div className="mt-3 flex w-full flex-row items-center justify-between space-x-2 md:hidden">
                <div className="flex h-full flex-row space-x-2">
                  <MobileMenu />
                </div>

                <div className="flex w-fit flex-row items-center space-x-3">
                  {/* <Sorter /> */}
                  <ColumnToggler />
                </div>
              </div>
            </div>

            <VaultsTable />

            <Pagination />
          </div>
        </div>

        {/* <RoycoRoyalty /> */}
      </div>
    );
  };

  const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG ?? "default";

  if (
    frontendTag === "internal" ||
    frontendTag === "testnet"
    // || frontendTag === "boyco"
  ) {
    return <Protector children={<Content />} />;
  } else {
    return <Content />;
  }
};

export default Page;
