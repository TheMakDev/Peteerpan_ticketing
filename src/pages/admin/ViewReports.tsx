import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BarChart3, Users, Ticket, Clock, TrendingUp, Home } from "lucide-react";

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
    // Load users
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const users = allUsers.filter((u: any) => u.role === "user");
    const engineers = allUsers.filter((u: any) => u.role === "engineer");

    // Load all tickets
    const allTickets: any[] = [];
    allUsers.forEach((user: any) => {
      const userTickets = JSON.parse(localStorage.getItem(`tickets_${user.id}`) || "[]");
      allTickets.push(...userTickets.map((ticket: any) => ({
        ...ticket,
        userName: user.name,
        userEmail: user.email
      })));
    });

    // Calculate statistics
    const ticketsByCategory: Record<string, number> = {};
    const ticketsByUrgency: Record<string, number> = {};
    const engineerTicketCount: Record<string, number> = {};

    allTickets.forEach(ticket => {
      // Category stats
      ticketsByCategory[ticket.category] = (ticketsByCategory[ticket.category] || 0) + 1;
      
      // Urgency stats
      ticketsByUrgency[ticket.urgency] = (ticketsByUrgency[ticket.urgency] || 0) + 1;
      
      // Engineer workload
      if (ticket.assignedTo) {
        engineerTicketCount[ticket.assignedTo] = (engineerTicketCount[ticket.assignedTo] || 0) + 1;
      }
    });

    // Engineer workload with names
    const engineerWorkload = engineers.map(engineer => ({
      name: engineer.name,
      email: engineer.email,
      ticketCount: engineerTicketCount[engineer.id] || 0
    }));

    setReportData({
      totalUsers: users.length,
      totalEngineers: engineers.length,
      totalTickets: allTickets.length,
      pendingTickets: allTickets.filter(t => t.status === "pending").length,
      assignedTickets: allTickets.filter(t => t.status === "assigned" || t.status === "in-progress").length,
      resolvedTickets: allTickets.filter(t => t.status === "resolved" || t.status === "closed").length,
      ticketsByCategory,
      ticketsByUrgency,
      engineerWorkload
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Reports & Analytics</h1>
                <p className="text-sm text-muted-foreground">System performance overview</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Active user accounts</p>
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
              <p className="text-xs text-muted-foreground">Support engineers</p>
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
              <p className="text-xs text-muted-foreground">All time tickets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Resolution Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.totalTickets > 0 
                  ? Math.round((reportData.resolvedTickets / reportData.totalTickets) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Tickets resolved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticket Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Status</CardTitle>
              <CardDescription>Current ticket distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  Pending
                </span>
                <div className="text-right">
                  <div className="font-bold">{reportData.pendingTickets}</div>
                  <div className="text-xs text-muted-foreground">
                    {reportData.totalTickets > 0 
                      ? Math.round((reportData.pendingTickets / reportData.totalTickets) * 100)
                      : 0}%
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  In Progress
                </span>
                <div className="text-right">
                  <div className="font-bold">{reportData.assignedTickets}</div>
                  <div className="text-xs text-muted-foreground">
                    {reportData.totalTickets > 0 
                      ? Math.round((reportData.assignedTickets / reportData.totalTickets) * 100)
                      : 0}%
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  Resolved
                </span>
                <div className="text-right">
                  <div className="font-bold">{reportData.resolvedTickets}</div>
                  <div className="text-xs text-muted-foreground">
                    {reportData.totalTickets > 0 
                      ? Math.round((reportData.resolvedTickets / reportData.totalTickets) * 100)
                      : 0}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Category</CardTitle>
              <CardDescription>Issue type distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(reportData.ticketsByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="capitalize">{category}</span>
                  <div className="text-right">
                    <div className="font-bold">{count}</div>
                    <div className="text-xs text-muted-foreground">
                      {reportData.totalTickets > 0 
                        ? Math.round((count / reportData.totalTickets) * 100)
                        : 0}%
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tickets by Urgency */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Urgency</CardTitle>
              <CardDescription>Priority level distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(reportData.ticketsByUrgency).map(([urgency, count]) => (
                <div key={urgency} className="flex items-center justify-between">
                  <span className={`capitalize font-medium ${
                    urgency === 'high' ? 'text-red-600' : 
                    urgency === 'medium' ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {urgency}
                  </span>
                  <div className="text-right">
                    <div className="font-bold">{count}</div>
                    <div className="text-xs text-muted-foreground">
                      {reportData.totalTickets > 0 
                        ? Math.round((count / reportData.totalTickets) * 100)
                        : 0}%
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Engineer Workload */}
          <Card>
            <CardHeader>
              <CardTitle>Engineer Workload</CardTitle>
              <CardDescription>Tickets assigned per engineer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportData.engineerWorkload.map((engineer) => (
                <div key={engineer.email} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{engineer.name}</div>
                    <div className="text-sm text-muted-foreground">{engineer.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{engineer.ticketCount}</div>
                    <div className="text-xs text-muted-foreground">tickets</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ViewReports;