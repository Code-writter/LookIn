
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserRound, Home, Calendar, Users, LayoutDashboard } from "lucide-react";
import { useAuth, SignInButton, SignOutButton } from "@clerk/clerk-react";
import { ModeToggle } from "@/hooks/mode-toggle";

const Navbar = () => {
  const { isSignedIn, has } = useAuth();
  const isAdmin = has?.({ role: "admin" }) || false;

  return (
    <nav className=" max-w-96  border-b border-neutral-200 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-1">
          <UserRound className="h-6 w-6 text-neutral-800" />
          <span className=" font-[Orbitron] text-lg font-semibold text-neutral-800">
            NAME
          </span>
        </div>
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link to="/" className="flex items-center text-neutral-600 hover:text-neutral-900">
            <Home className="mr-1 h-4 w-4" /> Home
          </Link>
          
          {isSignedIn && (
            <>
              <Link to="/register" className="flex items-center text-neutral-600 hover:text-neutral-900">
                <Users className="mr-1 h-4 w-4" /> Register
              </Link>
              <Link to="/attendance" className="flex items-center text-neutral-600 hover:text-neutral-900">
                <Calendar className="mr-1 h-4 w-4" /> Attendance
              </Link>
              
              {isAdmin && (
                <Link to="/dashboard" className="flex items-center text-neutral-600 hover:text-neutral-900">
                  <LayoutDashboard className="mr-1 h-4 w-4" /> Dashboard
                </Link>
              )}
            </>
          )}
          
          {isSignedIn ? (
            <SignOutButton>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </SignOutButton>
          ) : (
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
          )}
          <div>
            <ModeToggle />
          </div>
        </div>
        <Button variant="outline" size="icon" className="md:hidden">
          <span className="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
