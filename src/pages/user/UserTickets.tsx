import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ticket, ArrowLeft, Search, Filter, Clock, CheckCircle, AlertCircle, Plus, Home } from "lucide-react";
import Layout from "@/components/layout/Layout";

const UserTickets = () => {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
    const ticketData = JSON.parse(userTickets);
    setTickets(ticketData);
    setFilteredTickets(ticketData);
  }, [navigate]);

  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter]);

  if (!user) return null;

  return (
    <Layout user={user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/user/dashboard")}>
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <Ticket className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">My Support Tickets</h1>
            </div>
          </div>
          
          <Button onClick={() => navigate("/user/create-ticket")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Ticket
          </Button>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Tickets</CardTitle>
            <CardDescription>Track and manage your support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No tickets found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {tickets.length === 0 
                    ? "You haven't created any support tickets yet." 
                    : "No tickets match your current search or filter."}
                </p>
                <Button onClick={() => navigate("/user/create-ticket")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Ticket
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
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
                          {ticket.status === "assigned" && <AlertCircle className="h-4 w-4 text-blue-500" />}
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
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()}
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

export default UserTickets;