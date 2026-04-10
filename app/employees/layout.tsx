'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { ReactNode, useEffect, useState, createContext, useContext } from 'react';

const SidebarContext = createContext<{ onToggleSidebar: () => void } | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    return { onToggleSidebar: () => { } };
  }
  return context;
};

export default function EmployeesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <SidebarContext.Provider value={{ onToggleSidebar: toggleSidebar }}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          currentPage="employees"
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
