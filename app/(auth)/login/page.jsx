"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AuthForm from "../AuthForm";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [error, setError] = useState("");
    const handleSubmit = async (e, email, password) => {
      e.preventDefault()
      setError('')

      const supabase = createClientComponentClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setError(error.message);
      }
      if (!error) {
        router.push("/")
      }
    }
  return (
    <main>
      <h5 className="text-center text-xl my-4">Log in</h5>

      <AuthForm isSignUp={false} handleSubmit={handleSubmit} />
      {error && <div className="error">{error}</div>}
    </main>
  );
}
