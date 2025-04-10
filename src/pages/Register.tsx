
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FaceDetection from "@/components/FaceDetection";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const Register = () => {
  const [personName, setPersonName] = useState("");
  const [personId, setPersonId] = useState("");
  const [showFaceCapture, setShowFaceCapture] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userId } = useAuth();
  
  const registerUserMutation = useMutation(api.users.registerUser);

  const handleStartRegistration = () => {
    if (!personName.trim() || !personId.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both name and ID",
      });
      return;
    }
    setShowFaceCapture(true);
  };

  const handleFaceDetected = async (faceData: any) => {
    try {
      setIsSubmitting(true);
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Register user in Convex
      await registerUserMutation({
        name: personName,
        userId: userId,
        personId: personId,
        faceDescriptor: faceData.descriptor,
      });
      
      toast({
        title: "Registration successful",
        description: `${personName} has been registered successfully`,
      });
      
      // Navigate to home after successful registration
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error registering face:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "There was an error registering the face. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="container mx-auto max-w-4xl py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            User Registration
          </h1>
          <p className="mt-2 text-neutral-600">
            Register a new user by capturing their face data
          </p>
        </div>

        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>Register New User</CardTitle>
            <CardDescription>
              Enter user details and capture their face to register in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showFaceCapture ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id">Employee/Student ID</Label>
                  <Input
                    id="id"
                    placeholder="EMP12345"
                    value={personId}
                    onChange={(e) => setPersonId(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleStartRegistration}
                  disabled={isSubmitting}
                >
                  Continue to Face Registration
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-neutral-100 p-3 text-sm">
                  <p className="font-medium text-neutral-800">
                    Registering: {personName} (ID: {personId})
                  </p>
                  <p className="mt-1 text-neutral-600">
                    Please position your face in the center of the frame
                  </p>
                </div>
                
                <FaceDetection
                  mode="registration"
                  personName={personName}
                  onFaceDetected={handleFaceDetected}
                />
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowFaceCapture(false)}
                  disabled={isSubmitting}
                >
                  Back to User Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
