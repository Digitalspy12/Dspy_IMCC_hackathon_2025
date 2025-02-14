import * as React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <main className={`min-h-screen bg-background ${className}`}>
      {children}
    </main>
  );
};

export default Layout;