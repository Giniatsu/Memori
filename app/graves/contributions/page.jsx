"use client";
import { Suspense } from "react";
import GravesList from "./GravesList";
import Loading from "../../(dashboard)/loading";

export default function Graves() {
  return (
    <main>
      <nav>
        <div className="text-center mt-5">
          <h1 className="font-bold text-2xl">Your Contributed Graves</h1>
          <small>Available graves to locate.</small>
        </div>
      </nav>

      <Suspense fallback={<Loading />}>
        <GravesList />
      </Suspense>
    </main>
  );
}
