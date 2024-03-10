"use client";

import { MdDeleteForever } from "react-icons/md";
import { useTransition } from "react";
import { deleteGrave } from "../actions";
import { Button } from "flowbite-react";

export default function DeleteButton({ id }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      color="gray"
      onClick={() => startTransition(() => deleteGrave(id))}
      disabled={isPending}
    >
      {isPending && (
        <>
          <MdDeleteForever className="mr-3 h-4 w-4" />
          Deleting...
        </>
      )}
      {!isPending && (
        <>
          <MdDeleteForever className="mr-3 h-4 w-4" />
          Delete
        </>
      )}
    </Button>
  );
}
