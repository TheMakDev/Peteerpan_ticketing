import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: ReactNode;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

const Layout = ({ children, user }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-primary/10 via-background to-secondary/5 flex">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur">
            <SidebarTrigger className="ml-2" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;