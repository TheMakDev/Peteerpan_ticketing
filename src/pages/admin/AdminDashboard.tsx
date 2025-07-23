import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Wrench, Ticket, BarChart3, UserPlus, Settings } from "lucide-react";
import Layout from "@/components/layout/Layout";

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTickets: 15,
    activeUsers: 8,
    engineers: 3,
    pendingTickets: 5,
    resolvedToday: 7
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
  }, [navigate]);

  if (!user) return null;

  return (
    <Layout user={user}>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Total Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTickets}</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">+1 new today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Engineers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.engineers}</div>
              <p className="text-xs text-muted-foreground">All active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingTickets}</div>
              <p className="text-xs text-muted-foreground">Need assignment</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolvedToday}</div>
              <p className="text-xs text-muted-foreground">87% resolution rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                className="justify-center h-auto p-4 flex-col text-center"
                onClick={() => navigate("/admin/users")}
              >
                <UserPlus className="h-6 w-6 mb-2" />
                <span className="text-sm">Add User</span>
              </Button>
              <Button 
                variant="outline" 
                className="justify-center h-auto p-4 flex-col text-center"
                onClick={() => navigate("/admin/engineers")}
              >
                <Wrench className="h-6 w-6 mb-2" />
                <span className="text-sm">Manage Engineers</span>
              </Button>
              <Button 
                variant="outline" 
                className="justify-center h-auto p-4 flex-col text-center"
                onClick={() => navigate("/admin/tickets")}
              >
                <Ticket className="h-6 w-6 mb-2" />
                <span className="text-sm">Assign Tickets</span>
              </Button>
              <Button 
                variant="outline" 
                className="justify-center h-auto p-4 flex-col text-center"
                onClick={() => navigate("/admin/reports")}
              >
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-sm">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New ticket created", user: "John Doe", time: "5 minutes ago", type: "ticket" },
                  { action: "Ticket resolved", user: "Engineer Mike", time: "15 minutes ago", type: "resolved" },
                  { action: "User registered", user: "Jane Smith", time: "1 hour ago", type: "user" },
                  { action: "Ticket assigned", user: "Engineer Sarah", time: "2 hours ago", type: "assigned" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.user}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{activity.type}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Server Status</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Database</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email Service</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Backup Status</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Updated</Badge>
                </div>
                <div className="pt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;