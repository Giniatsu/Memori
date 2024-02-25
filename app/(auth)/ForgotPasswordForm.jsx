"use client";

import { Button, Card, Label, TextInput, Alert } from "flowbite-react";
import { HiMail } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function ForgotPassword(props) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        setIsVerified(true)
      }
    })
  }, [])
  
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/api/auth/forgot-password`,
      });
      if (error) {
        throw error;
      }
      setSuccessMessage("Password reset email sent successfully!");
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      setErrorMessage("Error sending password reset email. Please try again later.");
    }
    setSubmitting(false)
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true)
    try {
      if (newPassword !== confirmNewPassword) {
        throw new Error("Passwords do not match");
      }
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        throw error;
      }
      setSuccessMessage("Password updated successfully!");

      router.push("/");
    } catch (error) {
      console.error("Error updating password:", error.message);
      setErrorMessage("Error updating password. Please try again later.");
    }
    setSubmitting(false)
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-3/4 max-w-sm">
        {!isVerified && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
              Forgot Password
            </h5>
            <div>
              <div className="mb-2 block">
                <Label value="Your email" />
              </div>
              <TextInput
                icon={HiMail}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="name@company.com"
                required
              />
            </div>
            <Button disabled={submitting} type="submit">Reset Password</Button>
            {successMessage && <Alert type="success">{successMessage}</Alert>}
            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
          </form>
        )}
        {isVerified && (
          <form className="flex flex-col gap-4" onSubmit={handlePasswordUpdate}>
            <div>
              <div className="mb-2 block">
                <Label value="New Password" />
              </div>
              <TextInput
                icon={RiLockPasswordFill}
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                placeholder="Enter your new password"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Confirm New Password" />
              </div>
              <TextInput
                icon={RiLockPasswordFill}
                type="password"
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                value={confirmNewPassword}
                placeholder="Confirm your new password"
                required
              />
            </div>
            <Button disabled={submitting} type="submit">Update Password</Button>
            {successMessage && <Alert type="success">{successMessage}</Alert>}
            {errorMessage && <Alert type="error">{errorMessage}</Alert>}
          </form>
        )}
      </Card>
    </div>
  );
}

