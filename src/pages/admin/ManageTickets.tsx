import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Ticket, UserCheck, Clock, CheckCircle, AlertCircle, Home } from "lucide-react";
import Layout from "@/components/layout/Layout";

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

  const handleReassignTicket = (ticketId: string) => {
    // Reset assignment
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          assignedTo: null,
          assignedEngineer: null,
          status: "pending"
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);

    // Update in localStorage
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const ticketOwner = allUsers.find((u: any) => u.email === ticket.userEmail);
      
      if (ticketOwner) {
        const userTickets = JSON.parse(localStorage.getItem(`tickets_${ticketOwner.id}`) || "[]");
        const updatedUserTickets = userTickets.map((t: any) => {
          if (t.id === ticketId) {
            return { ...t, assignedTo: null, assignedEngineer: null, status: "pending" };
          }
          return t;
        });
        localStorage.setItem(`tickets_${ticketOwner.id}`, JSON.stringify(updatedUserTickets));
      }
    }

    toast({
      title: "Ticket unassigned",
      description: "Ticket is now available for reassignment"
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
            <Ticket className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Assign Tickets</h1>
          </div>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ticket Assignment</CardTitle>
            <CardDescription>Assign pending tickets to engineers</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tickets available</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Engineer</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                      <TableCell className="font-medium">{ticket.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ticket.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            ticket.urgency === "high" ? "destructive" : 
                            ticket.urgency === "medium" ? "default" : "secondary"
                          }
                        >
                          {ticket.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {ticket.status === "pending" && <Clock className="h-4 w-4 text-yellow-500" />}
                          {ticket.status === "assigned" && <UserCheck className="h-4 w-4 text-blue-500" />}
                          {ticket.status === "resolved" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          <Badge 
                            variant={
                              ticket.status === "pending" ? "secondary" :
                              ticket.status === "assigned" ? "default" : "outline"
                            }
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {ticket.assignedTo ? (
                          <span className="text-sm">{engineers.find(e => e.id === ticket.assignedTo)?.name || "Unknown"}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {ticket.status === "pending" && (
                          <Select 
                            onValueChange={(engineerId) => handleAssignTicket(ticket.id, engineerId)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Assign to..." />
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
                        {ticket.status === "assigned" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReassignTicket(ticket.id)}
                          >
                            Reassign
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ManageTickets;