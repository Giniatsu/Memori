"use client";

import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function UpdateButton() {
  const { pending } = useFormStatus();

  return (
    <button className="btn-primary" disabled={pending}>
      {pending && <span>Updating...</span>}
      {!pending && <span>Update</span>}
    </button>
  );
}
