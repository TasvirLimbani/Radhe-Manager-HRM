'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bell, Settings, User, Menu } from 'lucide-react';

interface TopNavProps {
  pageTitle: string;
  onToggleSidebar?: () => void;
}

export function TopNav({ pageTitle, onToggleSidebar }: TopNavProps) {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 animate-fade-in">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        {/* <button className="relative p-2 text-gray-600 hover:text-primary transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full animate-pulse-glow"></span>
        </button>

        <button className="p-2 text-gray-600 hover:text-primary transition-colors">
          <Settings size={20} />
        </button> */}

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{user?.name || 'User'}</p>
            <p className="text-sm font-medium text-gray-800">{user?.email || 'User'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
