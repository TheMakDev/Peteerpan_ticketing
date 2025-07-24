import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { 
  Ticket, 
  Home, 
  Plus, 
  Users, 
  Wrench, 
  BarChart3, 
  LogOut,
  User,
  Settings
} from "lucide-react";

interface AppSidebarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
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

  if (!user) {
    return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
        <SidebarHeader>
          <Link to="/" className="flex items-center space-x-2 p-4">
            <Ticket className="h-8 w-8 text-primary" />
            {!collapsed && (
              <span className="text-lg font-bold text-foreground">Peterpan IT</span>
            )}
          </Link>
        </SidebarHeader>
        <SidebarContent className="flex flex-col justify-center items-center p-4">
          <Link to="/auth/login">
            <Button size="sm">Sign In</Button>
          </Link>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center space-x-2 p-4">
          <Ticket className="h-8 w-8 text-primary" />
          {!collapsed && (
            <span className="text-lg font-bold text-foreground">Peterpan IT</span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.href}
                        className={`flex items-center space-x-2 ${
                          isActive(item.href) 
                            ? "bg-muted text-primary font-medium" 
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center space-x-2 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-sm">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium truncate">{user.name}</div>
                    <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                      {user.role}
                    </Badge>
                  </div>
                )}
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
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}