import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Home } from "lucide-react";
import Layout from "@/components/layout/Layout";

const CreateTicketPage = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    urgency: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create new ticket
      const newTicket = {
        id: Date.now().toString(),
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        assignedTo: null
      };

      // Get existing tickets
      const existingTickets = localStorage.getItem(`tickets_${user.id}`) || "[]";
      const tickets = JSON.parse(existingTickets);
      
      // Add new ticket
      tickets.push(newTicket);
      
      // Save to localStorage
      localStorage.setItem(`tickets_${user.id}`, JSON.stringify(tickets));

      toast({
        title: "Ticket created successfully!",
        description: `Your ticket #${newTicket.id.slice(0, 8)} has been submitted.`
      });

      navigate("/user/dashboard");
    } catch (error) {
      toast({
        title: "Error creating ticket",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Layout user={user}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-4">
          {/* <Button variant="ghost" onClick={() => navigate("/user/dashboard")}>
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button> */}
          <div>
            <h1 className="text-2xl font-bold">Create Support Ticket</h1>
            <p className="text-muted-foreground">Describe your issue and we'll help you resolve it</p>
          </div>
        </div>
        
        <Card className="mt-6 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>New Support Ticket</CardTitle>
            <CardDescription>Please provide as much detail as possible to help us assist you better</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  name="category" 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardware">Hardware Issues</SelectItem>
                    <SelectItem value="software">Software Problems</SelectItem>
                    <SelectItem value="network">Network/Connectivity</SelectItem>
                    <SelectItem value="account">Account & Access</SelectItem>
                    <SelectItem value="email">Email Issues</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select 
                  name="urgency" 
                  value={formData.urgency} 
                  onValueChange={(value) => setFormData(prev => ({...prev, urgency: value}))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How urgent is this issue?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Can wait a few days</SelectItem>
                    <SelectItem value="medium">Medium - Need help within 24 hours</SelectItem>
                    <SelectItem value="high">High - Urgent, affecting work</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please describe your issue in detail. Include any error messages, steps that led to the problem, and what you've already tried..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    "Creating..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Create Ticket
                    </>
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/user/dashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateTicketPage;