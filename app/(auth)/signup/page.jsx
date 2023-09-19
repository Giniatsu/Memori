"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import AuthForm from "../AuthForm";
import { useState } from "react";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const handleSubmit = async (e, email, password) => {
    e.preventDefault();

    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
    if (!error) {
      router.push("/verify");
    }
  };
  return (
    <main>
      <h5 className="text-center text-xl my-4">Sign Up</h5>
      <AuthForm isSignUp={true} handleSubmit={handleSubmit} />
      {error && <div className="error">{error}</div>}
    </main>
  );
}
