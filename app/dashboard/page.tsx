'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Users, HelpCircle, TrendingUp, Plus } from 'lucide-react';

interface Stats {
  totalGames: number;
  totalQuestions: number;
  totalUsers: number;
  recentActivity: Array<{ id: number; action: string; created_at: string }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalGames: 0,
    totalQuestions: 0,
    totalUsers: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('[v0] Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Games',
      value: stats.totalGames,
      description: 'Games created',
      icon: Gamepad2,
      color: 'text-primary',
      link: '/dashboard/games',
    },
    {
      title: 'Total Questions',
      value: stats.totalQuestions,
      description: 'Questions in library',
      icon: HelpCircle,
      color: 'text-accent',
      link: '/dashboard/questions',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      description: 'Registered users',
      icon: Users,
      color: 'text-primary',
      link: '/dashboard/users',
      visible: user?.role_name === 'admin',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Link href="/dashboard/games/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </Link>
        <Link href="/dashboard/questions/new">
          <Button variant="outline" className="border-border/50 hover:bg-secondary bg-transparent">
            <Plus className="mr-2 h-4 w-4" />
            New Question
          </Button>
        </Link>
        {user?.role_name === 'admin' && (
          <Link href="/dashboard/users">
            <Button variant="outline" className="border-border/50 hover:bg-secondary bg-transparent">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards
          .filter((card) => card.visible !== false)
          .map((card) => (
            <Link key={card.title} href={card.link}>
              <Card className="border-border/50 bg-card hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? '...' : card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest actions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading activity...</div>
          ) : stats.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No recent activity</div>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <span className="text-sm font-medium">{activity.action}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card className="border-border/50 bg-card bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Quick guide to get you started with QuizMaster</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">1.</span>
              <span>Create your first question in the Questions section</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">2.</span>
              <span>Organize questions into a game</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">3.</span>
              <span>Launch the game and invite players</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">4.</span>
              <span>Track results and activity in real-time</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
