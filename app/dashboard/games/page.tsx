'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Play, Edit2, Plus } from 'lucide-react';

interface Game {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        const data = await response.json();
        setGames(data.games);
      }
    } catch (error) {
      console.error('[v0] Error fetching games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGame = async (gameId: number) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGames(games.filter((g) => g.id !== gameId));
      }
    } catch (error) {
      console.error('[v0] Error deleting game:', error);
    }
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || game.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-muted/50 text-muted-foreground';
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-secondary/50 text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Games</h2>
          <p className="text-muted-foreground">Create and manage quiz games</p>
        </div>
        <Link href="/dashboard/games/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Create Game
          </Button>
        </Link>
      </div>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find games by title or status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-input border-border/50"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 bg-input border-border/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle>Games ({filteredGames.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading games...</div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No games found. {games.length === 0 ? 'Create your first game to get started.' : ''}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="border border-border/30 rounded-lg p-4 hover:border-primary/30 hover:bg-secondary/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">{game.title}</h3>
                      {game.description && (
                        <p className="text-sm text-muted-foreground mt-1">{game.description}</p>
                      )}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ml-2 ${getStatusColor(game.status)}`}>
                      {game.status}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground mb-4">
                    Created: {new Date(game.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    {game.status === 'active' && (
                      <Link href={`/game/${game.id}`} className="flex-1">
                        <Button variant="default" size="sm" className="w-full bg-primary hover:bg-primary/90">
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </Link>
                    )}
                    {(game.status === 'draft' || user?.role_name !== 'player') && (
                      <Link href={`/dashboard/games/${game.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-border/50 bg-transparent">
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    )}
                    {user?.role_name !== 'player' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteGame(game.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
