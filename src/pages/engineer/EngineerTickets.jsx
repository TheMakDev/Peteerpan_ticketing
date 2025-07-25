import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  MessageSquare,
  Home,
  Play,
  CheckCircle2
} from "lucide-react";
import Layout from "@/components/layout/Layout";

const EngineerTickets = () => {
  const [user, setUser] = useState(null);
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [workNote, setWorkNote] = useState("");
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

  const loadAssignedTickets = (engineerId) => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const assignedTickets = [];
    
    allUsers.forEach((user) => {
      const userTickets = JSON.parse(localStorage.getItem(`tickets_${user.id}`) || "[]");
      const engineerTickets = userTickets.filter((ticket) => ticket.assignedTo === engineerId);
      assignedTickets.push(...engineerTickets.map((ticket) => ({
        ...ticket,
        userName: user.name,
        userEmail: user.email,
        workNotes: ticket.workNotes || []
      })));
    });

    // Sort by priority and status
    assignedTickets.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const statusOrder = { assigned: 3, "in-progress": 2, resolved: 1 };
      
      if (a.urgency !== b.urgency) {
        return priorityOrder[b.urgency] - priorityOrder[a.urgency];
      }
      return statusOrder[b.status] - statusOrder[a.status];
    });

    setAssignedTickets(assignedTickets);
  };

  const updateTicketStatus = (ticketId, newStatus, note = "") => {
    const ticket = assignedTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const ticketOwner = allUsers.find((u) => u.email === ticket.userEmail);
    
    if (ticketOwner) {
      const userTickets = JSON.parse(localStorage.getItem(`tickets_${ticketOwner.id}`) || "[]");
      const updatedUserTickets = userTickets.map((t) => {
        if (t.id === ticketId) {
          const workNotes = t.workNotes || [];
          if (note) {
            workNotes.push({
              id: Date.now().toString(),
              note,
              timestamp: new Date().toISOString(),
              engineerName: user.name,
              status: newStatus
            });
          }
          return { 
            ...t, 
            status: newStatus, 
            updatedAt: new Date().toISOString(),
            workNotes
          };
        }
        return t;
      });
      localStorage.setItem(`tickets_${ticketOwner.id}`, JSON.stringify(updatedUserTickets));
      
      loadAssignedTickets(user.id);
      setWorkNote("");
      setSelectedTicket(null);
      
      toast({
        title: "Ticket updated",
        description: `Ticket status changed to ${newStatus.replace('-', ' ')}`
      });
    }
  };

  const addWorkNote = (ticketId, note) => {
    if (!note.trim()) return;
    
    const ticket = assignedTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const ticketOwner = allUsers.find((u) => u.email === ticket.userEmail);
    
    if (ticketOwner) {
      const userTickets = JSON.parse(localStorage.getItem(`tickets_${ticketOwner.id}`) || "[]");
      const updatedUserTickets = userTickets.map((t) => {
        if (t.id === ticketId) {
          const workNotes = t.workNotes || [];
          workNotes.push({
            id: Date.now().toString(),
            note,
            timestamp: new Date().toISOString(),
            engineerName: user.name,
            status: t.status
          });
          return { 
            ...t, 
            workNotes,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      });
      localStorage.setItem(`tickets_${ticketOwner.id}`, JSON.stringify(updatedUserTickets));
      
      loadAssignedTickets(user.id);
      setWorkNote("");
      
      toast({
        title: "Work note added",
        description: "Your work note has been saved"
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      assigned: { variant: "secondary", icon: AlertCircle, color: "text-orange-600" },
      "in-progress": { variant: "default", icon: Clock, color: "text-blue-600" },
      resolved: { variant: "outline", icon: CheckCircle, color: "text-green-600" }
    };
    
    const config = statusConfig[status] || statusConfig.assigned;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const getPriorityColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'low': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950';
    }
  };

  if (!user) return null;

  return (
    <Layout user={user}>
      <div className="container mx-auto px-4 py-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            
            <div className="flex items-center space-x-2">
              <Ticket className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">My Assigned Tickets</h1>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            {assignedTickets.length} ticket{assignedTickets.length !== 1 ? 's' : ''} assigned
          </Badge>
        </div>

        {/* Tickets Grid */}
        {assignedTickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assigned tickets</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You don't have any tickets assigned yet. Check back later for new assignments.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignedTickets.map((ticket) => (
              <Card key={ticket.id} className={`${getPriorityColor(ticket.urgency)} transition-all hover:shadow-md`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{ticket.title}</CardTitle>
                    <Badge 
                      variant={ticket.urgency === 'high' ? 'destructive' : ticket.urgency === 'medium' ? 'default' : 'secondary'}
                      className="shrink-0"
                    >
                      {ticket.urgency}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{ticket.category}</Badge>
                    {getStatusBadge(ticket.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="truncate">{ticket.userName}</span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm line-clamp-3">{ticket.description}</p>
                  
                  {/* Timestamps */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Work Notes Count */}
                  {ticket.workNotes && ticket.workNotes.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>{ticket.workNotes.length} work note{ticket.workNotes.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 pt-2">
                    {ticket.status === "assigned" && (
                      <Button
                        size="sm"
                        onClick={() => updateTicketStatus(ticket.id, "in-progress")}
                        className="w-full"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Work
                      </Button>
                    )}
                    
                    {ticket.status === "in-progress" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTicketStatus(ticket.id, "resolved")}
                        className="w-full"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Resolved
                      </Button>
                    )}
                    
                    {ticket.status !== "resolved" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary" size="sm" className="w-full">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Work Note
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add Work Note</DialogTitle>
                            <DialogDescription>
                              Document your progress on this ticket
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-sm mb-2">{ticket.title}</h4>
                              <p className="text-sm text-muted-foreground">ID: {ticket.id}</p>
                            </div>
                            <Textarea
                              placeholder="Describe what you've done or found..."
                              value={workNote}
                              onChange={(e) => setWorkNote(e.target.value)}
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => addWorkNote(ticket.id, workNote)}
                                disabled={!workNote.trim()}
                                className="flex-1"
                              >
                                Add Note
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {/* View Details Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{ticket.title}</DialogTitle>
                          <DialogDescription>
                            Ticket ID: {ticket.id} • Customer: {ticket.userName}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Ticket Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm">Category</h4>
                              <Badge variant="outline">{ticket.category}</Badge>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Priority</h4>
                              <Badge variant={ticket.urgency === 'high' ? 'destructive' : ticket.urgency === 'medium' ? 'default' : 'secondary'}>
                                {ticket.urgency}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Status</h4>
                              {getStatusBadge(ticket.status)}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Created</h4>
                              <p className="text-sm">{new Date(ticket.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          {/* Description */}
                          <div>
                            <h4 className="font-medium text-sm mb-2">Description</h4>
                            <p className="text-sm bg-muted p-3 rounded">{ticket.description}</p>
                          </div>
                          
                          {/* Work Notes */}
                          {ticket.workNotes && ticket.workNotes.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm mb-3">Work Notes</h4>
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {ticket.workNotes.map((note) => (
                                  <div key={note.id} className="bg-muted p-3 rounded">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                      <span className="font-medium text-sm">{note.engineerName}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(note.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm">{note.note}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EngineerTickets;