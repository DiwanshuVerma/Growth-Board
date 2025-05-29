import { BellRing, Brain, ChartNoAxesCombined, Cloudy, Flame, Trophy } from "lucide-react";

export const features = [
    {
        icon: <Brain size={30} />,
        bgColor: "bg-pink-700",
        title: "Smart Habit Tracking",
        text: "Track daily, weekly, or custom habits with detailed progress analytics and streaks."
    }, {
        icon: <ChartNoAxesCombined size={30} />,
        bgColor: "bg-purple-600",
        title: "Powerful Insights & Streak Stats",
        text: "Visualize your consistency, longest streaks, and personal bests with beautiful graphs and charts."
    }, {
        icon: <BellRing size={30} />,
        bgColor: "bg-rose-700",
        title: "Reminders That Keep You On Track",
        text: "Never miss a habit with email and in-app reminders tailored to your routine."
    }, {
        icon: <Trophy size={30} />,
        bgColor: "bg-yellow-600",
        title: "Leaderboard",
        text: "Compete with others, climb the leaderboard to stay motivated."
    }, {
        icon: <Flame size={30} />,
        bgColor: "bg-orange-600",
        title: "Daily Motivation",
        text: "Get inspired with quotes, reflections, and progress summaries that keep you moving."
    }, {
        icon: <Cloudy size={30} />,
        bgColor: "bg-blue-600",
        title: "Cloud Sync Across Devices",
        text: "Access your habits anywhere, anytime — all data synced and secure in the cloud."
    }
]