import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, Wrench, Shield, Ticket } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ticket className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Peterpan IT Solutions</h1>
            </div>
            <Badge variant="secondary">Ticketing System</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Our Ticketing System
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamlined support management for efficient issue resolution. Choose your role to get started.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* User Card */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-950 rounded-full w-fit">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">User Portal</CardTitle>
              <CardDescription>
                Submit and track your support tickets
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Submit new tickets</li>
                <li>• Track ticket progress</li>
                <li>• Chat with engineers</li>
                <li>• View ticket history</li>
              </ul>
              <div className="space-y-2">
                <Link to="/auth/login?role=user" className="block">
                  <Button className="w-full">User Login</Button>
                </Link>
                <Link to="/auth/signup/user" className="block">
                  <Button variant="outline" className="w-full">User Signup</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Engineer Card */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-950 rounded-full w-fit">
                <Wrench className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">Engineer Portal</CardTitle>
              <CardDescription>
                Resolve tickets and assist users
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Manage assigned tickets</li>
                <li>• Update ticket status</li>
                <li>• Communicate with users</li>
                <li>• Track performance</li>
              </ul>
              <div className="space-y-2">
                <Link to="/auth/engineer" className="block">
                  <Button variant="secondary" className="w-full">Engineer Login</Button>
                </Link>
                <Link to="/auth/signup/engineer" className="block">
                  <Button variant="outline" className="w-full">Engineer Signup</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-950 rounded-full w-fit">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">Admin Portal</CardTitle>
              <CardDescription>
                Manage system and oversee operations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Assign tickets</li>
                <li>• Manage users & engineers</li>
                <li>• View analytics</li>
                <li>• System administration</li>
              </ul>
              <div className="space-y-2">
                <Link to="/auth/login?role=admin" className="block">
                  <Button variant="outline" className="w-full">Admin Login</Button>
                </Link>
                <Link to="/auth/signup/admin" className="block">
                  <Button variant="outline" className="w-full">Admin Signup</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Accounts */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Demo Accounts</CardTitle>
              <CardDescription>Use these credentials to explore the system</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-600 dark:text-blue-400">User</h4>
                <p>user1@peterpan.com</p>
                <p>user123</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 dark:text-green-400">Engineer</h4>
                <p>eng1@peterpan.com</p>
                <p>eng123</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-600 dark:text-purple-400">Admin</h4>
                <p>admin@peterpan.com</p>
                <p>admin123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
