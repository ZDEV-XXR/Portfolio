'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg hover:scale-110 transition-all"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}