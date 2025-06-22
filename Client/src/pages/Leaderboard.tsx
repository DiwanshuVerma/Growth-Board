import { allUsers } from '@/app/auth';
import type { User } from '@/features/users/types';
import { Flame, Trophy, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const Leaderboard: React.FC = () => {

  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function loadUsers() {

      try {
        const res = await allUsers()
        setUsers(res)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    }
    loadUsers()
  }, [])

  return (
    <div className="mt-28 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">
        All hail <span className="text-orange-400 font-bold">{users[0]?.username}</span>. The Leaderboard has been claimed and you saw it happen :/
      </h2>

      <div className="w-full overflow-x-auto bg-[#0d1f16] text-white rounded-xl mx-auto shadow-xl">
        <table className="min-w-full invisible md:visible table-fixed">
          <thead className="text-sm text-neutral-400 border-b border-neutral-700">
            <tr>
              <th className="w-16 px-6 py-6 text-left">Rank</th>
              <th className="w-64 px-6 py-6 text-left">User</th>
              <th className="w-40 px-6 py-6 text-left">Points</th>
              <th className="w-40 px-6 py-6 text-left">Current Streak</th>
              <th className="w-40 px-6 py-6 text-left">Longest Streak</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b border-neutral-800 hover:bg-[#14251d] transition">
                <td className="p-6 text-xl">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-14 h-14 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span>{user.points}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>{user.currentStreak}d</span>
                  </div>
                </td>

                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>{user.longestStreak}d</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* for smaller screen */}
        <table className='md:hidden block'> 
           <thead className="text-sm text-neutral-400 border-b border-neutral-700">
            <tr>
              <th className="w-16 px-6 py-6 text-left">Rank</th>
              <th className="w-64 px-6 py-6 text-left">User</th>
              <th className="w-70 px-6 py-6 text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b border-neutral-800 hover:bg-[#14251d] transition">
                <td className="p-6 text-xl">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-14 h-14 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span>{user.points}</span>
                  </div>
                </td>
                {/* <td className="p-6">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>{user.currentStreak}d</span>
                  </div>
                </td>

                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>{user.longestStreak}d</span>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>


      </div>
    </div>
  );
}


export default Leaderboard