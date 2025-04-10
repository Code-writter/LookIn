
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FaceDetection from "@/components/FaceDetection";
import Navbar from "@/components/Navbar";
import { Clock, Check } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@clerk/clerk-react";

type AttendanceRecord = {
  _id: string;
  personName: string;
  time: string;
  date: string;
};

const Attendance = () => {
  const [recognizedPerson, setRecognizedPerson] = useState<string | null>(null);
  const { toast } = useToast();
  const { userId } = useAuth();
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch face descriptors for recognition
  const faceDescriptors = useQuery(api.users.getAllFaceDescriptors);
  
  // Fetch today's attendance records
  const attendanceRecords = useQuery(api.attendance.getTodayAttendance, { date: today }) as AttendanceRecord[] | undefined;
  
  // Mark attendance mutation
  const markAttendanceMutation = useMutation(api.attendance.markAttendance);

  const handleFaceRecognized = async (personName: string, personId: string) => {
    try {
      setRecognizedPerson(personName);
      
      if (!userId) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "You must be signed in to mark attendance",
        });
        return;
      }

      // Mark attendance in Convex
      const result = await markAttendanceMutation({
        userId: userId,
        personName: personName,
        personId: personId,
        date: today,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      if (result.status === "already_marked") {
        toast({
          title: "Already Marked",
          description: `${personName}'s attendance was already marked today`,
        });
      } else {
        toast({
          title: "Attendance Marked",
          description: `${personName}'s attendance has been recorded successfully`,
        });
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="container mx-auto max-w-6xl py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Attendance System
          </h1>
          <p className="mt-2 text-neutral-600">
            Mark attendance by face recognition
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Face Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <FaceDetection
                mode="recognition"
                onFaceRecognized={handleFaceRecognized}
                faceDescriptors={faceDescriptors || []}
              />

              {recognizedPerson && (
                <div className="mt-4 rounded-md bg-green-50 p-4 text-green-800">
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-600" />
                    <p className="font-medium">Welcome, {recognizedPerson}!</p>
                  </div>
                  <p className="mt-1 text-sm text-green-700">
                    Your attendance has been marked successfully.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Attendance</CardTitle>
              <div className="flex items-center text-sm text-neutral-500">
                <Clock className="mr-1 h-4 w-4" />
                {new Date().toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[350px] overflow-y-auto">
                {attendanceRecords && attendanceRecords.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="border-b text-left">
                      <tr>
                        <th className="pb-2 font-medium text-neutral-700">Name</th>
                        <th className="pb-2 font-medium text-neutral-700">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record) => (
                        <tr key={record._id} className="border-b border-neutral-100">
                          <td className="py-3">{record.personName}</td>
                          <td className="py-3">{record.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-neutral-500">No attendance records today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
