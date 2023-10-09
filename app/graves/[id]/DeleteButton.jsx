"use client";

import { TiDelete } from "react-icons/ti";
import { useTransition } from "react";
import { deleteGrave } from "../actions";

export default function DeleteButton({ id }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      className="btn-primary"
      onClick={() => startTransition(() => deleteGrave(id))}
      disabled={isPending}
    >
      {isPending && (
        <>
          <TiDelete />
          Deleting...
        </>
      )}
      {!isPending && (
        <>
          <TiDelete />
          Delete Grave
        </>
      )}
    </button>
  );
}
