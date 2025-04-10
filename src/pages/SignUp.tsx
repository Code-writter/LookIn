
import React from "react";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";

const SignUp = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="container mx-auto flex max-w-4xl flex-col items-center py-12">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-neutral-900">
          Sign Up
        </h1>
        <div className="w-full max-w-md">
          <ClerkSignUp
            path="/signup"
            routing="path"
            signInUrl="/signin"
            afterSignUpUrl="/"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
