
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { UserCheck, UserPlus, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="mb-16 mt-8 grid items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
                Vision Attendance Hub
              </h1>
              <p className="mb-6 text-xl text-neutral-600">
                Modern face recognition system for tracking attendance seamlessly and securely.
              </p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                <Button onClick={() => navigate("/attendance")} size="lg">
                  Mark Attendance
                </Button>
                <Button variant="outline" onClick={() => navigate("/register")} size="lg">
                  Register New User
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-72 w-72 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 p-6 shadow-lg">
                <div className="absolute -left-4 -top-4 h-24 w-24 rounded-xl bg-neutral-800 p-4"></div>
                <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-xl bg-neutral-700 p-4"></div>
                <div className="absolute bottom-12 left-12 h-16 w-16 rounded-xl bg-neutral-900 p-4"></div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="my-24">
            <h2 className="mb-12 text-center text-3xl font-bold text-neutral-900">
              Key Features
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">Face Recognition</h3>
                <p className="text-neutral-600">
                  Advanced facial recognition for quick and accurate attendance marking.
                </p>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                  <UserPlus className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">Easy Registration</h3>
                <p className="text-neutral-600">
                  Simple user onboarding process with facial data capture.
                </p>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">Attendance Reports</h3>
                <p className="text-neutral-600">
                  Detailed attendance insights and reports for easy monitoring.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="my-16 rounded-2xl bg-neutral-900 p-8 text-center text-white md:p-12">
            <h2 className="mb-4 text-3xl font-bold">Ready to get started?</h2>
            <p className="mb-6 text-lg text-neutral-300">
              Implement our facial recognition attendance system today.
            </p>
            <Button onClick={() => navigate("/register")} variant="outline" className="bg-white text-neutral-900 hover:bg-neutral-100">
              Start Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
