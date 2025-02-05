import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <main className="flex flex-col h-screen p-4 gap-4">{children}</main>
    </div>
  );
};

export default Layout;