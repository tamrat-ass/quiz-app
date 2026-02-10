'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Menu, X, LogOut, Settings, Users, Gamepad2, HelpCircle } from 'lucide-react';

interface User {
  id: number;
  email: string;
  full_name: string;
  role_name: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const navigationItems = [
    { href: '/dashboard', label: 'Overview', icon: Gamepad2, visible: true },
    { href: '/dashboard/games', label: 'Games', icon: Gamepad2, visible: true },
    { href: '/dashboard/questions', label: 'Questions', icon: HelpCircle, visible: user?.role_name !== 'player' },
    { href: '/dashboard/users', label: 'Users', icon: Users, visible: user?.role_name === 'admin' },
    { href: '/dashboard/activity', label: 'Activity Log', icon: Settings, visible: user?.role_name === 'admin' },
    { href: '/dashboard/themes', label: 'Themes', icon: Settings, visible: true },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`bg-card border-r border-border/50 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 border-b border-border/30 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold text-primary">QuizMaster</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto text-primary"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* User Info */}
        {isSidebarOpen && (
          <div className="p-4 border-b border-border/30">
            <p className="text-sm font-medium text-foreground truncate">{user?.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
              {user?.role_name?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems
            .filter((item) => item.visible)
            .map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
                >
                  <item.icon className="w-5 h-5" />
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </Button>
              </Link>
            ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start border-border/50 text-destructive hover:bg-destructive/10 bg-transparent"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Top Bar */}
        <header className="bg-card border-b border-border/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <div className="text-sm text-muted-foreground">Welcome back, {user?.full_name}!</div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
