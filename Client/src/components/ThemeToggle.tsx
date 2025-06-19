import { useState } from 'react';

type ThemeToggleProps = {
  setThemeProp: (theme: string) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ setThemeProp }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || 'dark')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setThemeProp(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-14 py-[2px] rounded-full cursor-pointer bg-slate-800 text-white"
    >
      <span className={`transition-all duration-300 transform ${theme === 'light' ? 'translate-x-1' : 'translate-x-9'}`}>
        {theme === 'light' ? '🌞' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;
