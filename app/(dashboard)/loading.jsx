"use client";
import { Alert, Spinner } from "flowbite-react";
export default function Loading() {
  return (
    <main className="flex justify-center">
      <Alert color="info" className="m-4">
        <span className="font-medium">
          <Spinner color="success" aria-label="Success spinner example" />{" "}
          Loading...
        </span>
        Hopefully not for too long :
      </Alert>
    </main>
  );
}
