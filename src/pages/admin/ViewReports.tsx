import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BarChart3, Users, Ticket, Clock, TrendingUp, Home } from "lucide-react";
import Layout from "@/components/layout/Layout";

const ViewReports = () => {
  const [user, setUser] = useState<any>(null);
  const [reportData, setReportData] = useState({
    totalUsers: 0,
    totalEngineers: 0,
    totalTickets: 0,
    pendingTickets: 0,
    assignedTickets: 0,
    resolvedTickets: 0,
    ticketsByCategory: {} as Record<string, number>,
    ticketsByUrgency: {} as Record<string, number>,
    engineerWorkload: [] as any[]
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/auth/login?role=admin");
      return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.role !== "admin") {
      navigate("/");
      return;
    }
    
    setUser(userData);
    generateReports();
  }, [navigate]);

  const generateReports = () => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const users = allUsers.filter((u: any) => u.role === "user");
    const engineers = allUsers.filter((u: any) => u.role === "engineer");

    // Load all tickets
    const allTickets: any[] = [];
    allUsers.forEach((user: any) => {
      const userTickets = JSON.parse(localStorage.getItem(`tickets_${user.id}`) || "[]");
      allTickets.push(...userTickets);
    });

    // Calculate statistics
    const ticketsByCategory: Record<string, number> = {};
    const ticketsByUrgency: Record<string, number> = {};
    const engineerTicketCount: Record<string, number> = {};

    allTickets.forEach(ticket => {
      ticketsByCategory[ticket.category] = (ticketsByCategory[ticket.category] || 0) + 1;
      ticketsByUrgency[ticket.urgency] = (ticketsByUrgency[ticket.urgency] || 0) + 1;
      
      if (ticket.assignedTo) {
        engineerTicketCount[ticket.assignedTo] = (engineerTicketCount[ticket.assignedTo] || 0) + 1;
      }
    });

    const engineerWorkload = engineers.map(engineer => ({
      name: engineer.name,
      email: engineer.email,
      assignedTickets: engineerTicketCount[engineer.id] || 0
    }));

    setReportData({
      totalUsers: users.length,
      totalEngineers: engineers.length,
      totalTickets: allTickets.length,
      pendingTickets: allTickets.filter(t => t.status === "pending").length,
      assignedTickets: allTickets.filter(t => t.status === "assigned").length,
      resolvedTickets: allTickets.filter(t => t.status === "resolved").length,
      ticketsByCategory,
      ticketsByUrgency,
      engineerWorkload
    });
  };

  if (!user) return null;

  return (
    <Layout user={user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Active accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Engineers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalEngineers}</div>
              <p className="text-xs text-muted-foreground">Available staff</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Total Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalTickets}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{reportData.pendingTickets}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{reportData.assignedTickets}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{reportData.resolvedTickets}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          {/* Tickets by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Category</CardTitle>
              <CardDescription>Distribution of tickets across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(reportData.ticketsByCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="capitalize">{category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${(count / Math.max(...Object.values(reportData.ticketsByCategory))) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tickets by Urgency */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Urgency</CardTitle>
              <CardDescription>Priority distribution of all tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(reportData.ticketsByUrgency).map(([urgency, count]) => (
                  <div key={urgency} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          urgency === 'high' ? 'bg-red-500' :
                          urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                      />
                      <span className="capitalize">{urgency}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            urgency === 'high' ? 'bg-red-500' :
                            urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${(count / Math.max(...Object.values(reportData.ticketsByUrgency))) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engineer Workload */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Engineer Workload</CardTitle>
            <CardDescription>Current ticket assignments per engineer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.engineerWorkload.map((engineer, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium">{engineer.name}</p>
                    <p className="text-sm text-muted-foreground">{engineer.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{engineer.assignedTickets}</div>
                    <p className="text-xs text-muted-foreground">
                      {engineer.assignedTickets === 0 ? 'No tickets' : 
                       engineer.assignedTickets === 1 ? '1 ticket' : 
                       `${engineer.assignedTickets} tickets`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ViewReports;