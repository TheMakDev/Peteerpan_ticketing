import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  Menu, 
  Ticket, 
  Home, 
  Plus, 
  Users, 
  Wrench, 
  Shield, 
  BarChart3, 
  LogOut,
  User,
  Settings
} from "lucide-react";

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged out successfully",
      description: "See you next time!"
    });
    navigate("/");
  };

  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "user":
        return [
          { label: "Dashboard", href: "/user/dashboard", icon: Home },
          { label: "My Tickets", href: "/user/tickets", icon: Ticket },
          { label: "Create Ticket", href: "/user/create-ticket", icon: Plus }
        ];
      case "engineer":
        return [
          { label: "Dashboard", href: "/engineer/dashboard", icon: Home },
          { label: "Assigned Tickets", href: "/engineer/tickets", icon: Ticket }
        ];
      case "admin":
        return [
          { label: "Dashboard", href: "/admin/dashboard", icon: Home },
          { label: "Manage Users", href: "/admin/users", icon: Users },
          { label: "Assign Tickets", href: "/admin/tickets", icon: Ticket },
          { label: "Reports", href: "/admin/reports", icon: BarChart3 }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 border-red-200";
      case "engineer": return "bg-blue-100 text-blue-800 border-blue-200";
      case "user": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Ticket className="h-8 w-8 text-primary" />
              <div>
                <span className="text-lg font-bold text-foreground hidden sm:inline">
                  Peterpan IT
                </span>
                <span className="text-lg font-bold text-foreground sm:hidden">
                  PIT
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 px-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-medium">{user.name}</div>
                        <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                          {user.role}
                        </Badge>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-8">
                      <div className="px-2 py-4 border-b">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <Badge variant="outline" className={`text-xs mt-1 ${getRoleColor(user.role)}`}>
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {navigationItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link 
                              key={item.href} 
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                            >
                              <Button
                                variant={isActive(item.href) ? "default" : "ghost"}
                                className="w-full justify-start"
                              >
                                <Icon className="mr-3 h-4 w-4" />
                                {item.label}
                              </Button>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="border-t pt-4">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;