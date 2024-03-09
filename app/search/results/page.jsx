'use client'

import { Suspense } from "react";
import SearchList from "./SearchList";
import Loading from "../../(dashboard)/loading";

export default function Results() {
  return (
    <main>
      <nav>
        <div className="text-center mt-5">
          <h1 className="font-bold text-2xl">Search Results</h1>
          <small>Available graves to locate.</small>
        </div>
      </nav>

      <Suspense fallback={<Loading />}>
        <SearchList />
      </Suspense>
    </main>
  );
}
