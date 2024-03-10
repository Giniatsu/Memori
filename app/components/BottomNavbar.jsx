"use client";
import React from "react";
import Link from "next/link";
import { FaSearchLocation } from "react-icons/fa";
import { RiMapPinAddFill } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";
import { GiGraveyard } from "react-icons/gi";
import { MdAccountCircle } from "react-icons/md";
import { usePathname } from "next/navigation";

export default function BottomNavbar() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        <Link
          href="/"
          className="inline-flex flex-col items-center justify-center px-5 border-gray-200 border-x hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600"
        >
          <AiFillHome
            size={25}
            className={`mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${
              pathname === "/" ? "!text-blue-600 dark:text-blue-500" : ""
            }`}
          />
          <span
            className={`text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${
              pathname === "/" ? "!text-blue-600 dark:text-blue-500" : ""
            }`}
          >
            Home
          </span>
        </Link>
        <Link
          href="/search"
          className="inline-flex flex-col items-center justify-center px-5 border-r border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600"
        >
          <FaSearchLocation
            size={25}
            className={`mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${
              pathname === "/search" ? "!text-blue-600 dark:text-blue-500" : ""
            }`}
          />
          <span
            className={`text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${
              pathname === "/search" ? "!text-blue-600 dark:text-blue-500" : ""
            }`}
          >
            Search
          </span>
        </Link>

        <Link
          href="/graves"
          className="inline-flex flex-col items-center justify-center px-5 border-r border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600"
        >
          <RiMapPinAddFill
            size={25}
            className={`mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${
              pathname === "/graves" ? "!text-blue-600 dark:text-blue-500" : ""
            }`}
          />
          <span
            className={`text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${
              pathname === "/graves" ? "!text-blue-600 dark:text-blue-500" : ""
            }`}
          >
            New
          </span>
        </Link>

        <Link
          href="/graves/contributions"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
          <GiGraveyard
            size={25}
            className={`mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${
              pathname === "/graves/contributions"
                ? "!text-blue-600 dark:text-blue-500"
                : ""
            }`}
          />
          <span
            className={`text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${
              pathname === "/graves/contributions"
                ? "!text-blue-600 dark:text-blue-500"
                : ""
            }`}
          >
            Entries
          </span>
        </Link>
        <Link
          href="/account"
          className="inline-flex flex-col items-center justify-center px-5 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 group border-x dark:border-gray-600"
        >
          <MdAccountCircle
            size={25}
            className={`mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${
              pathname === "/account" ? "!text-blue-600 dark:text-blue-500" : ""
            }`}
          />
          <span
            className={`text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${
              pathname === "/account" ? "!text-blue-600 dark:text-blue-500" : ""
            }`}
          >
            Profile
          </span>
        </Link>
      </div>
    </div>
  );
}
