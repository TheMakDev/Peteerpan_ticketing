import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import EngineerLoginPage from "./pages/auth/EngineerLoginPage";
import UserSignupPage from "./pages/auth/UserSignupPage";
import EngineerSignupPage from "./pages/auth/EngineerSignupPage";
import AdminSignupPage from "./pages/auth/AdminSignupPage";
import UserDashboard from "./pages/user/UserDashboard";
import UserTickets from "./pages/user/UserTickets";
import CreateTicketPage from "./pages/user/CreateTicketPage";
import EngineerDashboard from "./pages/engineer/EngineerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageTickets from "./pages/admin/ManageTickets";
import ViewReports from "./pages/admin/ViewReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/engineer" element={<EngineerLoginPage />} />
          <Route path="/auth/signup/user" element={<UserSignupPage />} />
          <Route path="/auth/signup/engineer" element={<EngineerSignupPage />} />
          <Route path="/auth/signup/admin" element={<AdminSignupPage />} />
          
          {/* User Routes */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/tickets" element={<UserTickets />} />
          <Route path="/user/create-ticket" element={<CreateTicketPage />} />
          
          {/* Engineer Routes */}
          <Route path="/engineer/dashboard" element={<EngineerDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/engineers" element={<ManageUsers />} />
          <Route path="/admin/tickets" element={<ManageTickets />} />
          <Route path="/admin/reports" element={<ViewReports />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
