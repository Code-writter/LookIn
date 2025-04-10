
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FaceDetection from "@/components/FaceDetection";
import Navbar from "@/components/Navbar";
import { Clock, Check } from "lucide-react";

type AttendanceRecord = {
  id: string;
  name: string;
  time: string;
  date: string;
};

const Attendance = () => {
  const [recognizedPerson, setRecognizedPerson] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: "1",
      name: "John Doe",
      time: "08:45 AM",
      date: "2025-04-10",
    },
    {
      id: "2",
      name: "Jane Smith",
      time: "09:02 AM",
      date: "2025-04-10",
    },
    {
      id: "3",
      name: "Michael Johnson",
      time: "08:55 AM",
      date: "2025-04-10",
    },
  ]);
  const { toast } = useToast();

  const handleFaceRecognized = (personName: string) => {
    setRecognizedPerson(personName);

    // In a real app, send this data to your backend
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      name: personName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
    };

    setAttendanceRecords([newRecord, ...attendanceRecords]);

    toast({
      title: "Attendance Marked",
      description: `${personName}'s attendance has been recorded successfully`,
    });
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
                {attendanceRecords.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="border-b text-left">
                      <tr>
                        <th className="pb-2 font-medium text-neutral-700">Name</th>
                        <th className="pb-2 font-medium text-neutral-700">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record) => (
                        <tr key={record.id} className="border-b border-neutral-100">
                          <td className="py-3">{record.name}</td>
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
