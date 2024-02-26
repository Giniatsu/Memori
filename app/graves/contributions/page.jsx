"use client"
import { Suspense } from "react";
import GravesList from "./GravesList";
import Loading from "../../(dashboard)/loading";

export default function Graves() {
  return (
    <main>
      <nav>
        <div>
          <h2>Your Contributed Graves</h2>
          <p>
            <small>Available graves to locate.</small>
          </p>
        </div>
      </nav>

      <Suspense fallback={<Loading />}>
        <GravesList />
      </Suspense>
    </main>
  );
}
