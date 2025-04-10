
import React from "react";
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
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Dashboard = () => {
  const { isLoaded, userId, has } = useAuth();
  const { toast } = useToast();
  
  // Get statistics from Convex
  const stats = useQuery(api.attendance.getUserStatistics);
  
  // Get all attendance records
  const attendanceData = useQuery(api.attendance.getAllAttendance);

  React.useEffect(() => {
    // Check if user is admin
    const checkUserRole = async () => {
      if (isLoaded && userId) {
        const hasAdminRole = has({ role: "admin" });
        
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
              <p className="text-3xl font-bold">{stats?.presentToday || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.absentToday || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.attendanceRate || 0}%</p>
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
              <TableCaption>Complete attendance records</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time In</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData && attendanceData.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell className="font-medium">{record.personName}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.time}</TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                        Present
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
