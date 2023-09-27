import React from "react";
import Link from "next/link";
import { FaSearchLocation } from "react-icons/fa";
import { RiMapPinAddFill } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";
import { HiOutlineAdjustments } from "react-icons/hi";
import { MdAccountCircle } from "react-icons/md";

export default function BottomNavbar() {
  return (
    <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        <button
          data-tooltip-target="tooltip-home"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 rounded-l-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <Link href="/">
            <AiFillHome
              size={25}
              className="mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            />
          </Link>
          <span className="sr-only">Home</span>
        </button>
        <div
          id="tooltip-home"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Home
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <button
          data-tooltip-target="tooltip-wallet"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <Link href="/search">
            <FaSearchLocation
              size={25}
              className="mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            />
          </Link>
          <span className="sr-only">Search</span>
        </button>
        <div
          id="tooltip-wallet"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Search a grave
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <div className="flex items-center justify-center">
          <button
            data-tooltip-target="tooltip-new"
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
          >
            <RiMapPinAddFill size={25} />
            <span className="sr-only">Contribute</span>
          </button>
        </div>
        <div
          id="tooltip-new"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Create new grave
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <button
          data-tooltip-target="tooltip-settings"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <HiOutlineAdjustments
            size={25}
            className="mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          />
          <span className="sr-only">Settings</span>
        </button>
        <div
          id="tooltip-settings"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Settings
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <button
          data-tooltip-target="tooltip-profile"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 rounded-r-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <Link href="/account">
            <MdAccountCircle
              size={25}
              className="mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
            />
          </Link>
          <span className="sr-only">Profile</span>
        </button>
        <div
          id="tooltip-profile"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Profile
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>
    </div>
  );
}
