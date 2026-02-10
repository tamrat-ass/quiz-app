'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function NewQuestionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    questionText: '',
    sectionId: '1',
    roundId: '1',
    questionTypeId: '1',
    questionNumber: '1',
    options: ['', '', '', ''],
    correctAnswer: '0',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.questionText.trim()) {
        setError('Question text is required');
        return;
      }

      if (formData.options.some((opt) => !opt.trim())) {
        setError('All options must be filled');
        return;
      }

      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          questionNumber: parseInt(formData.questionNumber),
          sectionId: parseInt(formData.sectionId),
          roundId: parseInt(formData.roundId),
          questionTypeId: parseInt(formData.questionTypeId),
          correctAnswer: parseInt(formData.correctAnswer),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create question');
        return;
      }

      router.push('/dashboard/questions');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('[v0] Create question error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/questions">
            <Button variant="ghost" className="mb-4 text-cyan-400 hover:text-cyan-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Questions
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Create New Question</h1>
          <p className="text-gray-400 mt-2">Add a new question to your question bank</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Details Card */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Question Details</CardTitle>
              <CardDescription className="text-gray-400">Enter the question information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Text */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Question Text *</label>
                <textarea
                  name="questionText"
                  value={formData.questionText}
                  onChange={handleInputChange}
                  placeholder="Enter your question here"
                  disabled={isLoading}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition disabled:opacity-50"
                />
              </div>

              {/* Row for Section, Round, Type */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Section ID</label>
                  <Input
                    type="number"
                    name="sectionId"
                    value={formData.sectionId}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Round ID</label>
                  <Input
                    type="number"
                    name="roundId"
                    value={formData.roundId}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Question Type ID</label>
                  <Input
                    type="number"
                    name="questionTypeId"
                    value={formData.questionTypeId}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* Question Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Question Number</label>
                <Input
                  type="number"
                  name="questionNumber"
                  value={formData.questionNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Answer Options Card */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Answer Options</CardTitle>
              <CardDescription className="text-gray-400">Enter 4 answer options and select the correct one</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium text-gray-300">Option {index + 1} *</label>
                      <Input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Enter option ${index + 1}`}
                        disabled={isLoading}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={index}
                        checked={formData.correctAnswer === index.toString()}
                        onChange={(e) => setFormData((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <label className="text-sm text-gray-400">Correct</label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">{error}</div>}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Link href="/dashboard/questions">
              <Button type="button" variant="outline" disabled={isLoading} className="border-slate-600 text-gray-300 hover:bg-slate-700 bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating...' : 'Create Question'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
