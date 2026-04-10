'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  LogIn,
  TrendingUp,
  DollarSign,
  LogOut,
  PencilRuler,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ currentPage, isOpen = false, onToggle }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const navigationItems = [
    // { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'employees', label: 'Employees', icon: Users, href: '/employees' },
    { id: 'design', label: 'Design', icon: PencilRuler, href: '/design' },

    { id: 'entries', label: 'Work Entries', icon: LogIn, href: '/entries' },
    // { id: 'advances', label: 'Advances', icon: TrendingUp, href: '/advances' },
    // { id: 'salary', label: 'Salary', icon: DollarSign, href: '/salary' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static w-64 bg-gradient-to-b from-primary to-primary/80 text-white flex flex-col h-screen shadow-xl z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-white/20">
          {/* <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center font-bold text-primary">
            PG
          </div>
          <div>
            <h1 className="text-xl font-bold">Patel Garments</h1>
            <p className="text-xs text-white/70">Employee Management</p>
          </div>
        </div> */}
          <img className='w-100' src="/logo_name.png" alt="" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onToggle}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/80 hover:bg-white/10'
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 text-white transition-all duration-300 font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <p className="mt-4 text-xs text-white/50 text-center leading-relaxed">
            Designed & Managed by <br />
            <a
              href="http://radhesoftwaresolutions.soon.it/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/80"
            >
              Radhe Software Solutions
            </a>
            {/* <span className="font-medium text-white/70" >
            Radhe Software Solutions
          </span> */}
          </p>
        </div>
      </aside>
    </>
  );
}
