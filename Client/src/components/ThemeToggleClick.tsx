import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggleClick() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border border-neutral-500/30 dark:border-white/20 bg-white/10 text-white dark:bg-black/10 dark:text-black transition-all"
    >
      {theme === "dark" ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-black" />}
    </button>
  );
}
