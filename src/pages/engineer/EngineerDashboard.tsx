import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Clock, CheckCircle, AlertCircle, LogOut, User } from "lucide-react";

const EngineerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [assignedTickets, setAssignedTickets] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/auth/login?role=engineer");
      return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.role !== "engineer") {
      navigate("/");
      return;
    }
    
    setUser(userData);
    
    // Load assigned tickets (simulate assigned tickets)
    const tickets = [
      {
        id: 1,
        title: "Email not working",
        description: "Cannot send emails from Outlook",
        category: "Email",
        urgency: "High",
        status: "assigned",
        createdAt: new Date().toISOString(),
        userName: "John Doe",
        userEmail: "john@example.com"
      },
      {
        id: 2,
        title: "Software installation request",
        description: "Need Adobe Photoshop installed",
        category: "Software",
        urgency: "Medium",
        status: "in-progress",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        userName: "Jane Smith",
        userEmail: "jane@example.com"
      }
    ];
    setAssignedTickets(tickets);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged out successfully",
      description: "See you next time!"
    });
    navigate("/");
  };

  const updateTicketStatus = (ticketId: number, newStatus: string) => {
    setAssignedTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );
    
    toast({
      title: "Ticket Updated",
      description: `Ticket status changed to ${newStatus}`
    });
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
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      low: { variant: "outline" as const, className: "border-green-500 text-green-700" },
      medium: { variant: "outline" as const, className: "border-yellow-500 text-yellow-700" },
      high: { variant: "outline" as const, className: "border-red-500 text-red-700" }
    };
    
    const config = urgencyConfig[urgency.toLowerCase() as keyof typeof urgencyConfig];
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {urgency}
      </Badge>
    );
  };

  if (!user) return null;

  const ticketStats = {
    total: assignedTickets.length,
    assigned: assignedTickets.filter(t => t.status === "assigned").length,
    inProgress: assignedTickets.filter(t => t.status === "in-progress").length,
    resolved: assignedTickets.filter(t => t.status === "resolved").length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Engineer Dashboard</h1>
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
              <CardTitle className="text-sm font-medium">Assigned Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{ticketStats.assigned}</div>
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

        {/* Assigned Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Tickets</CardTitle>
            <CardDescription>Tickets requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            {assignedTickets.length === 0 ? (
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tickets assigned</h3>
                <p className="text-muted-foreground">You're all caught up! New tickets will appear here when assigned.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {assignedTickets.map((ticket) => (
                  <Card key={ticket.id} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{ticket.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{ticket.category}</Badge>
                            {getUrgencyBadge(ticket.urgency)}
                            {getStatusBadge(ticket.status)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{ticket.description}</p>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {ticket.userName} ({ticket.userEmail})
                        </div>
                        <div>
                          Created: {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {ticket.status === "assigned" && (
                          <Button 
                            size="sm"
                            onClick={() => updateTicketStatus(ticket.id, "in-progress")}
                          >
                            Start Working
                          </Button>
                        )}
                        {ticket.status === "in-progress" && (
                          <Button 
                            size="sm"
                            onClick={() => updateTicketStatus(ticket.id, "resolved")}
                          >
                            Mark Resolved
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Add Comment
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EngineerDashboard;