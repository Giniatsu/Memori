"use client";

import { useFormStatus } from "react-dom";
import { Button } from "flowbite-react";
import { TbGrave } from "react-icons/tb";
import { Spinner } from "flowbite-react";

export default function SubmitButton({ buttonText = "", loadingText = ""}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="whitespace-nowrap">
      {pending && (
        <>
          <Spinner aria-label="addgrave spinner" size="sm" />
          <span className="pl-2">{loadingText}</span>
        </>
      )}
      {!pending && (
        <>
          <TbGrave className="mr-2 h-4 w-4" />
          <span>{buttonText}</span>
        </>
      )}
    </Button>
  );
}
