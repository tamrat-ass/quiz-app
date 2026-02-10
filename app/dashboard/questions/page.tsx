'use client';

import React from "react"

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
import { Trash2, Edit2, Plus, Upload } from 'lucide-react';

interface Question {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  created_at: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('[v0] Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQuestions(questions.filter((q) => q.id !== questionId));
      }
    } catch (error) {
      console.error('[v0] Error deleting question:', error);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/questions/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setUploadError(data.error || 'Upload failed');
        return;
      }

      // Refresh questions list
      fetchQuestions();
      setUploadError('');
    } catch (error) {
      setUploadError('An error occurred during upload');
      console.error('[v0] Upload error:', error);
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || question.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === 'all' || question.category === filterCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const categories = [...new Set(questions.map((q) => q.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Questions</h2>
          <p className="text-muted-foreground">Manage your question library</p>
        </div>
        <div className="flex gap-2">
          <label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelUpload}
              disabled={isUploading}
              className="hidden"
            />
            <Button asChild disabled={isUploading} className="cursor-pointer bg-secondary hover:bg-secondary/90 text-foreground">
              <span>
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Import Excel'}
              </span>
            </Button>
          </label>
          <Link href="/dashboard/questions/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              New Question
            </Button>
          </Link>
        </div>
      </div>

      {uploadError && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded">
          {uploadError}
        </div>
      )}

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find questions by title, difficulty, or category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-input border-border/50"
          />
          <div className="flex gap-2 flex-wrap">
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-40 bg-input border-border/50">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            {categories.length > 0 && (
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40 bg-input border-border/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat || ''}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading questions...</div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No questions found. {questions.length === 0 ? 'Create your first question to get started.' : ''}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="flex items-center justify-between p-4 rounded border border-border/20 hover:border-primary/30 hover:bg-secondary/30 transition-all"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{question.title}</h3>
                    <div className="flex gap-2 mt-2">
                      {question.category && (
                        <span className="text-xs px-2 py-1 bg-secondary/50 text-muted-foreground rounded">
                          {question.category}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        question.difficulty === 'easy'
                          ? 'bg-green-500/20 text-green-400'
                          : question.difficulty === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/dashboard/questions/${question.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
