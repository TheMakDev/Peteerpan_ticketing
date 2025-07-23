import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Wrench, Shield, Ticket } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const role = searchParams.get("role") || "user";

  const roleConfig = {
    user: {
      icon: Users,
      color: "blue",
      title: "User Login",
      description: "Access your support tickets",
      demo: { email: "user1@peterpan.com", password: "user123" }
    },
    engineer: {
      icon: Wrench,
      color: "green", 
      title: "Engineer Login",
      description: "Manage and resolve tickets",
      demo: { email: "eng1@peterpan.com", password: "eng123" }
    },
    admin: {
      icon: Shield,
      color: "purple",
      title: "Admin Login", 
      description: "System administration",
      demo: { email: "admin@peterpan.com", password: "admin123" }
    }
  };

  const config = roleConfig[role as keyof typeof roleConfig];
  const Icon = config.icon;

  useEffect(() => {
    // Check if already logged in
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      navigate(`/${user.role}/dashboard`);
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check demo credentials
    if (email === config.demo.email && password === config.demo.password) {
      const user = {
        id: Date.now(),
        email,
        role,
        name: role.charAt(0).toUpperCase() + role.slice(1) + " Demo"
      };
      
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`
      });
      
      navigate(`/${role}/dashboard`);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Use demo accounts.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  const fillDemo = () => {
    setEmail(config.demo.email);
    setPassword(config.demo.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Ticket className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Peterpan IT Solutions</h1>
          </div>
          <Badge variant="secondary">Ticketing System</Badge>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <div className={`mx-auto mb-4 p-3 bg-${config.color}-100 dark:bg-${config.color}-950 rounded-full w-fit`}>
              <Icon className={`h-8 w-8 text-${config.color}-600 dark:text-${config.color}-400`} />
            </div>
            <CardTitle>{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={fillDemo}
              >
                Use Demo Account
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
              <div className="text-xs bg-muted p-2 rounded">
                <p>{config.demo.email}</p>
                <p>{config.demo.password}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-4">
          <Button variant="link" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;