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
      className="w-1/2 whitespace-nowrap"
    >
      {isPending && (
        <>
          <MdDeleteForever className="mr-1 h-5 w-5" />
          Deleting Grave...
        </>
      )}
      {!isPending && (
        <>
          <MdDeleteForever className="mr-1 h-5 w-5" />
          Delete Grave
        </>
      )}
    </Button>
  );
}
