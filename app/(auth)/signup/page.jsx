"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import AuthForm from "../AuthForm";
import { useState } from "react";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

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
      console.log(error);
    }
    if (!error) {
      router.push("/verify");
      console.log(error)
    }
  };
  return (
    <main>
      <h5 className="text-center text-xl my-4">Sign Up</h5>
      <AuthForm isSignUp={true} handleSubmit={handleSubmit} />
      {error && (
        <div className="flex justify-center items-center">
          <Alert
            color="failure"
            icon={HiInformationCircle}
            className="m-4 text-justify"
          >
            <span className="font-medium">Info alert!</span> {error}
          </Alert>
        </div>
      )}
    </main>
  );
}
