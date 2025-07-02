// Client/src/pages/TwitterSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { loginAsUser } from "@/features/auth/authSlice";
import axios from "axios";

export default function TwitterSuccess() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // If using JWT in URL:
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      try {
        // Fetch user info with token
        axios.get(`${import.meta.env.VITE_BACKEND_API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          const user = res.data;
          localStorage.setItem("user", JSON.stringify({ token, user }));
          dispatch(loginAsUser({ token, user }));
          navigate("/habits");
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
  }, [dispatch, navigate]);

  return  <div className="flex flex-col md:flex-row gap-6 p-6 bg-[#041107] min-h-1/2 mt-20 text-white">

            {/* Left: Create Habit */}
            <div className="w-full md:w-1/2 bg-[#0a1e14] p-6 rounded-xl shadow-md animate-pulse">
                <div className="h-6 w-1/3 bg-gray-700 rounded mb-6" />

                <div className="space-y-4">
                    <div className="h-10 bg-gray-800 rounded" />
                    <div className="h-24 bg-gray-800 rounded" />
                    <div className="h-10 w-32 bg-gray-800 rounded" />
                    <div className="h-10 bg-gray-800 rounded" />
                    <div className="h-10 bg-green-900 rounded mt-4" />
                </div>
            </div>

            {/* Right: Habits List */}
            <div className="w-full md:w-1/2 bg-[#0a1e14] p-6 rounded-xl shadow-md animate-pulse">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-6 w-1/4 bg-gray-700 rounded" />
                    <div className="h-8 w-24 bg-gray-800 rounded" />
                </div>

                <div className="space-y-6">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="p-4 border border-green-900 rounded space-y-2">
                            <div className="h-4 w-1/3 bg-gray-700 rounded" />
                            <div className="h-4 w-1/2 bg-gray-800 rounded" />
                            <div className="h-2 w-full bg-gray-900 rounded" />
                            <div className="h-1 w-2/3 bg-red-900 rounded" />
                            <div className="flex justify-between items-center pt-2">
                                <div className="h-6 w-16 bg-gray-800 rounded" />
                                <div className="flex space-x-3">
                                    <div className="h-6 w-6 bg-gray-700 rounded" />
                                    <div className="h-6 w-6 bg-gray-700 rounded" />
                                    <div className="h-6 w-6 bg-gray-700 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
}