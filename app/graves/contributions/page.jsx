"use client"
import { Suspense } from "react";
import GravesList from "./GravesList";
import Loading from "../../(dashboard)/loading";

export default function Graves() {
  return (
    <main>
      <nav>
        <div className="text-center">
          <h1 className="font-bold text-2xl">Your Contributed Graves</h1>
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
