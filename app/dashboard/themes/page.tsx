'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Loader2 } from 'lucide-react';

interface Theme {
  id: number;
  user_id: number;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  is_dark_mode: boolean;
}

const PRESET_THEMES = [
  { name: 'Ocean', primary: '#1a9d9d', secondary: '#0f5c5c', accent: '#22d3ee' },
  { name: 'Forest', primary: '#059669', secondary: '#065f46', accent: '#10b981' },
  { name: 'Sunset', primary: '#dc2626', secondary: '#7c2d12', accent: '#f97316' },
  { name: 'Purple', primary: '#7c3aed', secondary: '#5b21b6', accent: '#a78bfa' },
];

export default function ThemesPage() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#1a9d9d');
  const [secondaryColor, setSecondaryColor] = useState('#0f5c5c');
  const [accentColor, setAccentColor] = useState('#22d3ee');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const response = await fetch('/api/themes');
      if (response.ok) {
        const data = await response.json();
        if (data.theme) {
          setTheme(data.theme);
          setPrimaryColor(data.theme.primary_color || '#1a9d9d');
          setSecondaryColor(data.theme.secondary_color || '#0f5c5c');
          setAccentColor(data.theme.accent_color || '#22d3ee');
          setIsDarkMode(data.theme.is_dark_mode !== false);
        }
      }
    } catch (error) {
      console.error('[v0] Error fetching theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          accent_color: accentColor,
          is_dark_mode: isDarkMode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTheme(data.theme);
        // Update CSS variables
        applyTheme();
      }
    } catch (error) {
      console.error('[v0] Error saving theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const applyTheme = () => {
    const root = document.documentElement;
    // Convert hex to HSL for CSS custom properties
    root.style.setProperty('--primary', primaryColor);
    root.style.setProperty('--accent', accentColor);
  };

  const applyPreset = (preset: any) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setAccentColor(preset.accent);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading themes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Theme Customization</h2>
        <p className="text-muted-foreground">Personalize your QuizMaster experience</p>
      </div>

      {/* Preset Themes */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle>Preset Themes</CardTitle>
          <CardDescription>Choose from pre-designed color schemes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PRESET_THEMES.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="p-4 border border-border/30 rounded-lg hover:border-primary/50 transition-all text-left"
              >
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">{preset.name}</h3>
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded border border-border/50"
                      style={{ backgroundColor: preset.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded border border-border/50"
                      style={{ backgroundColor: preset.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="w-8 h-8 rounded border border-border/50"
                      style={{ backgroundColor: preset.accent }}
                      title="Accent"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle>Custom Colors</CardTitle>
          <CardDescription>Fine-tune your color palette</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Primary Color */}
            <div className="space-y-3">
              <Label className="text-foreground">Primary Color</Label>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-border/50"
                  />
                </div>
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 bg-input border-border/50 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-muted-foreground">Used for buttons and primary elements</p>
            </div>

            {/* Secondary Color */}
            <div className="space-y-3">
              <Label className="text-foreground">Secondary Color</Label>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-border/50"
                  />
                </div>
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 bg-input border-border/50 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-muted-foreground">Used for secondary buttons and backgrounds</p>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <Label className="text-foreground">Accent Color</Label>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-border/50"
                  />
                </div>
                <Input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 bg-input border-border/50 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-muted-foreground">Used for highlights and accents</p>
            </div>

            {/* Dark Mode Toggle */}
            <div className="space-y-3">
              <Label className="text-foreground">Appearance</Label>
              <div className="flex items-center gap-3 p-3 border border-border/30 rounded">
                <input
                  type="checkbox"
                  id="darkMode"
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <label htmlFor="darkMode" className="text-sm text-foreground cursor-pointer">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="border border-border/30 rounded-lg p-6 space-y-4">
            <h3 className="font-medium text-foreground">Preview</h3>
            <div className="flex gap-3 flex-wrap">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Primary Button
              </Button>
              <Button variant="outline" className="border-border/50 bg-transparent">
                Secondary Button
              </Button>
              <div
                className="px-4 py-2 rounded text-white text-sm"
                style={{ backgroundColor: accentColor }}
              >
                Accent Element
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Theme'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
