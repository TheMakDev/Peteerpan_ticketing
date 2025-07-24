import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Ticket, UserCheck, Clock, CheckCircle, AlertCircle, Home } from "lucide-react";

const ManageTickets = () => {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);
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
    loadTickets();
    loadEngineers();
  }, [navigate]);

  const loadTickets = () => {
    // Load all tickets from all users
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const allTickets: any[] = [];
    
    allUsers.forEach((user: any) => {
      const userTickets = JSON.parse(localStorage.getItem(`tickets_${user.id}`) || "[]");
      allTickets.push(...userTickets.map((ticket: any) => ({
        ...ticket,
        userName: user.name,
        userEmail: user.email
      })));
    });

    setTickets(allTickets);
  };

  const loadEngineers = () => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const engineerUsers = allUsers.filter((user: any) => user.role === "engineer");
    setEngineers(engineerUsers);
  };

  const handleAssignTicket = (ticketId: string, engineerId: string) => {
    const engineer = engineers.find(e => e.id === engineerId);
    if (!engineer) return;

    // Update tickets
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          assignedTo: engineerId,
          assignedEngineer: engineer.name,
          status: "assigned"
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);

    // Update in localStorage for the specific user
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const ticketOwner = allUsers.find((u: any) => u.email === ticket.userEmail);
      
      if (ticketOwner) {
        const userTickets = JSON.parse(localStorage.getItem(`tickets_${ticketOwner.id}`) || "[]");
        const updatedUserTickets = userTickets.map((t: any) => {
          if (t.id === ticketId) {
            return { ...t, assignedTo: engineerId, assignedEngineer: engineer.name, status: "assigned" };
          }
          return t;
        });
        localStorage.setItem(`tickets_${ticketOwner.id}`, JSON.stringify(updatedUserTickets));
      }
    }

    toast({
      title: "Ticket assigned",
      description: `Ticket has been assigned to ${engineer.name}`
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      assigned: { variant: "default" as const, icon: UserCheck, color: "text-blue-600" },
      "in-progress": { variant: "default" as const, icon: AlertCircle, color: "text-blue-600" },
      resolved: { variant: "outline" as const, icon: CheckCircle, color: "text-green-600" },
      closed: { variant: "outline" as const, icon: CheckCircle, color: "text-green-600" }
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
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
              <Ticket className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Assign Tickets</h1>
                <p className="text-sm text-muted-foreground">{tickets.length} tickets total</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Tickets</CardTitle>
            <CardDescription>Assign tickets to engineers and manage their status</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
                <p className="text-muted-foreground">No support tickets have been created yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm">#{ticket.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">{ticket.title}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.userName}</div>
                          <div className="text-sm text-muted-foreground">{ticket.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getUrgencyColor(ticket.urgency)}`}>
                          {ticket.urgency}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        {ticket.assignedEngineer ? (
                          <Badge variant="secondary">{ticket.assignedEngineer}</Badge>
                        ) : (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {!ticket.assignedTo && (
                          <Select onValueChange={(value) => handleAssignTicket(ticket.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Assign" />
                            </SelectTrigger>
                            <SelectContent>
                              {engineers.map((engineer) => (
                                <SelectItem key={engineer.id} value={engineer.id}>
                                  {engineer.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ManageTickets;