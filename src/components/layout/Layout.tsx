import { ReactNode } from "react";
import Navbar from "./Navbar";

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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      <Navbar user={user} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;