'use client'

import { Suspense } from "react";
import SearchList from "./SearchList";
import Loading from "../../(dashboard)/loading";

export default function Results() {
  return (
    <main>
      <nav>
        <div>
          <h2>Search results</h2>
          <p>
            <small>Available graves to locate.</small>
          </p>
        </div>
      </nav>

      <Suspense fallback={<Loading />}>
        <SearchList />
      </Suspense>
    </main>
  );
}
