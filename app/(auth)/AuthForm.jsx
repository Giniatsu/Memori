"use client"

import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useState } from "react"

export default function AuthForm(props,{ handleSubmit }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <div className="flex justify-center items-center">
      <Card className="w-3/4 max-w-sm">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => handleSubmit(e, email, password)}
        >
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            Sign in to our platform
          </h5>
          <div>
            <div className="mb-2 block">
              <Label value="Your email" />
            </div>
            <TextInput
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label value="Your password" />
            </div>
            <TextInput
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex items-start">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Link
              href="#"
              className="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
            >
              Lost Password?
            </Link>
          </div>
          <Button type="submit">{props.isSignUp ? "Sign Up" : "Login"}</Button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            {props.isSignUp ? "Already have an account?" : "Not Registered?"}{" "}
            <Link
              href={props.isSignUp ? "/login" : "/signup"}
              className="text-blue-700 hover:underline dark:text-blue-500"
            >
              {props.isSignUp ? "Login to your account" : "Create account"}
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
