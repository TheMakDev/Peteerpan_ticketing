import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Eye, EyeOff } from "lucide-react";

const EngineerLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Demo engineer accounts
  const demoAccounts = [
    { id: "eng1", email: "eng1@peterpan.com", password: "eng123", name: "Mike Johnson" },
    { id: "eng2", email: "eng2@peterpan.com", password: "eng123", name: "Sarah Wilson" },
    { id: "eng3", email: "eng3@peterpan.com", password: "eng123", name: "David Chen" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check demo accounts
      const engineer = demoAccounts.find(
        acc => acc.email === formData.email && acc.password === formData.password
      );

      if (engineer) {
        const userData = {
          id: engineer.id,
          name: engineer.name,
          email: engineer.email,
          role: "engineer"
        };

        localStorage.setItem("currentUser", JSON.stringify(userData));
        
        toast({
          title: "Login successful!",
          description: `Welcome back, ${engineer.name}`
        });

        navigate("/engineer/dashboard");
      } else {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setFormData({
      email: account.email,
      password: account.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Peterpan IT</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Engineer Portal</h1>
          <p className="text-muted-foreground">Sign in to manage support tickets</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your engineer credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="engineer@peterpan.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo Accounts</CardTitle>
            <CardDescription className="text-xs">Click to use demo credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.id}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleDemoLogin(account)}
              >
                <Wrench className="h-3 w-3 mr-2" />
                {account.name} - {account.email}
              </Button>
            ))}
          </CardContent>
        </Card> */}

        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EngineerLoginPage;