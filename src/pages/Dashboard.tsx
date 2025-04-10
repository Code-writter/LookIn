
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";

// Mock data - will be replaced with actual Convex data
const mockAttendanceData = [
  {
    id: "1",
    name: "John Doe",
    date: "2025-04-10",
    timeIn: "08:45 AM",
    status: "Present",
  },
  {
    id: "2",
    name: "Jane Smith",
    date: "2025-04-10",
    timeIn: "09:02 AM",
    status: "Present",
  },
  {
    id: "3",
    name: "Michael Johnson",
    date: "2025-04-10",
    timeIn: "08:55 AM",
    status: "Present",
  },
  {
    id: "4",
    name: "Emily Davis",
    date: "2025-04-10",
    timeIn: "",
    status: "Absent",
  },
];

const Dashboard = () => {
  const { isLoaded, userId, sessionId, getToken, has } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);

  useEffect(() => {
    // Check if user is admin
    const checkUserRole = async () => {
      if (isLoaded && userId) {
        // In a real app, we'd check the user's role from Clerk
        // For now, we'll assume the user is an admin if they're authenticated
        const hasAdminRole = has({ role: "admin" });
        setIsAdmin(hasAdminRole);

        if (!hasAdminRole) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this page.",
            variant: "destructive",
          });
        }
      }
    };

    checkUserRole();
  }, [isLoaded, userId, has, toast]);

  // In the future, this would fetch data from Convex
  useEffect(() => {
    // Fetch attendance data from Convex would go here
    // For now, we're using mock data
  }, []);

  const presentCount = attendanceData.filter(
    (record) => record.status === "Present"
  ).length;
  const absentCount = attendanceData.filter(
    (record) => record.status === "Absent"
  ).length;
  const attendanceRate = Math.round(
    (presentCount / attendanceData.length) * 100
  );

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="container mx-auto py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-neutral-600">
            View and manage attendance records
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Present</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{presentCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{absentCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{attendanceRate}%</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>
              View all attendance records for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Attendance records for today</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time In</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.timeIn || "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          record.status === "Present"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
