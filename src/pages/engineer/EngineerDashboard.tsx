import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Ticket, Clock, CheckCircle, AlertCircle, User } from "lucide-react";
import Layout from "@/components/layout/Layout";

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
    loadAssignedTickets(userData.id);
  }, [navigate]);

  const loadAssignedTickets = (engineerId: string) => {
    // Load all tickets assigned to this engineer
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const assignedTickets: any[] = [];
    
    allUsers.forEach((user: any) => {
      const userTickets = JSON.parse(localStorage.getItem(`tickets_${user.id}`) || "[]");
      const engineerTickets = userTickets.filter((ticket: any) => ticket.assignedTo === engineerId);
      assignedTickets.push(...engineerTickets.map((ticket: any) => ({
        ...ticket,
        userName: user.name,
        userEmail: user.email
      })));
    });

    setAssignedTickets(assignedTickets);
  };

  const updateTicketStatus = (ticketId: string, newStatus: string) => {
    // Find the ticket and update it
    const ticket = assignedTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    // Update in the user's tickets
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const ticketOwner = allUsers.find((u: any) => u.email === ticket.userEmail);
    
    if (ticketOwner) {
      const userTickets = JSON.parse(localStorage.getItem(`tickets_${ticketOwner.id}`) || "[]");
      const updatedUserTickets = userTickets.map((t: any) => {
        if (t.id === ticketId) {
          return { ...t, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return t;
      });
      localStorage.setItem(`tickets_${ticketOwner.id}`, JSON.stringify(updatedUserTickets));
      
      // Reload tickets
      loadAssignedTickets(user.id);
      
      toast({
        title: "Ticket updated",
        description: `Ticket status changed to ${newStatus}`
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      assigned: { variant: "default" as const, icon: AlertCircle },
      "in-progress": { variant: "default" as const, icon: Clock },
      resolved: { variant: "outline" as const, icon: CheckCircle },
      closed: { variant: "outline" as const, icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.assigned;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
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
    <Layout user={user}>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Total Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">New Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{ticketStats.assigned}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{ticketStats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{ticketStats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>My Assigned Tickets</CardTitle>
            <CardDescription>Tickets assigned to you for resolution</CardDescription>
          </CardHeader>
          <CardContent>
            {assignedTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No assigned tickets</h3>
                <p className="text-muted-foreground">You don't have any tickets assigned yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{ticket.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="secondary">{ticket.category}</Badge>
                          <Badge variant={ticket.urgency === 'high' ? 'destructive' : ticket.urgency === 'medium' ? 'default' : 'outline'}>
                            {ticket.urgency} Priority
                          </Badge>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{ticket.userName} ({ticket.userEmail})</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Created {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {ticket.status === "assigned" && (
                          <Button
                            size="sm"
                            onClick={() => updateTicketStatus(ticket.id, "in-progress")}
                          >
                            Start Work
                          </Button>
                        )}
                        {ticket.status === "in-progress" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTicketStatus(ticket.id, "resolved")}
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm">{ticket.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EngineerDashboard;