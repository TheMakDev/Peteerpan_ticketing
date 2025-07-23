import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Plus, Clock, CheckCircle, AlertCircle, LogOut } from "lucide-react";

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/auth/login?role=user");
      return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.role !== "user") {
      navigate("/");
      return;
    }
    
    setUser(userData);
    
    // Load user tickets from localStorage
    const userTickets = localStorage.getItem(`tickets_${userData.id}`) || "[]";
    setTickets(JSON.parse(userTickets));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged out successfully",
      description: "See you next time!"
    });
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, icon: Clock },
      assigned: { variant: "default" as const, icon: AlertCircle },
      "in-progress": { variant: "default" as const, icon: AlertCircle },
      resolved: { variant: "outline" as const, icon: CheckCircle },
      closed: { variant: "outline" as const, icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (!user) return null;

  const ticketStats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === "pending").length,
    inProgress: tickets.filter(t => t.status === "in-progress" || t.status === "assigned").length,
    resolved: tickets.filter(t => t.status === "resolved" || t.status === "closed").length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ticket className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">User Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{ticketStats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{ticketStats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{ticketStats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate("/user/create-ticket")}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Ticket
              </Button>
              <Button variant="outline" onClick={() => navigate("/user/tickets")}>
                <Ticket className="h-4 w-4 mr-2" />
                View All Tickets
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Your latest support requests</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
                <p className="text-muted-foreground mb-4">Create your first support ticket to get started</p>
                <Button onClick={() => navigate("/user/create-ticket")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{ticket.title}</h3>
                      <p className="text-sm text-muted-foreground">{ticket.category} • {ticket.urgency} Priority</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                ))}
                
                {tickets.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" onClick={() => navigate("/user/tickets")}>
                      View All Tickets ({tickets.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserDashboard;