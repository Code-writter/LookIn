
import React from "react";
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";

const SignIn = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="container mx-auto flex max-w-4xl flex-col items-center py-12">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-neutral-900">
          Sign In
        </h1>
        <div className="w-full max-w-md">
          <ClerkSignIn
            path="/signin"
            routing="path"
            signUpUrl="/signup"
            afterSignInUrl="/"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
