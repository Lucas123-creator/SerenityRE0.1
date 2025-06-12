import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const DarkModeToggle = () => {
  const [dark, setDark] = useState(false);

  // On mount: check localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem('serenity-theme');
    if (saved) {
      setDark(saved === 'dark');
      document.documentElement.classList.toggle('dark', saved === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDark(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  // Toggle dark mode
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('serenity-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <button
      className="p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Toggle dark mode"
      onClick={toggle}
    >
      <span className="sr-only">Toggle dark mode</span>
      <span className="block transition-transform duration-300">
        {dark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
      </span>
    </button>
  );
}; 