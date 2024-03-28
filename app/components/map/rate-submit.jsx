"use client";

import { useFormStatus } from "react-dom";
import { Button } from "flowbite-react";
import { MdRateReview } from "react-icons/md";
import { Spinner } from "flowbite-react";

export default function RateSubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="whitespace-nowrap">
      {pending && (
        <>
          <Spinner aria-label="addgrave spinner" size="sm" />
          <span className="pl-2">Rating...</span>
        </>
      )}
      {!pending && (
        <>
          <MdRateReview className="mr-2 h-4 w-4" />
          <span>Rate</span>
        </>
      )}
    </Button>
  );
}
