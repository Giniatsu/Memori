"use client";

import React from "react";
import InstallPWAButton from "./InstallPWAButton";

const InstructionManual = () => {
  return (
    <div className="p-8 rounded shadow-md max-w-lg bg-white mt-4">
      <h1 class="font-extrabold dark:text-white mb-4">Welcome To MeMori!</h1>
      <ul className="list-disc pl-4">
        <li className="text-gray-700 mb-2">
          To Search for graves entries, please proceed to the search page, you
          can open a map to the grave entry by pressing the navigate button to
          each corresponding grave.
        </li>
        <li className="text-gray-700 mb-2">
          To Add graves entries, please Login your account.
        </li>
        <li className="text-gray-700 mb-2">
          When successfully navigating to graves, please press the End Tracking
          button in the navigation screen to give the Grave Entry some comments
          and ratings. This helps other users know how accurate the grave
          entries are!
        </li>
        <li className="text-gray-700 mb-2">
          If you haven&apos;t yet, please Install this app as PWA for a better
          experience!
        </li>
        <InstallPWAButton />
      </ul>
    </div>
  );
};

export default InstructionManual;
