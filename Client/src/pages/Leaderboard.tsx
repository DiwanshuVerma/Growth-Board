import { allUsers } from '@/app/auth';
import { useAppSelector } from '@/app/hooks';
import SkeletonLeaderboardCards from '@/components/SkeletonLeaderboardCards';
import SkeletonLeaderboardRows from '@/components/SkeletonLeaderboardRows';
import type { User } from '@/features/users/types';
import { Flame, Trophy, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import { IoChevronDown } from 'react-icons/io5';

const Leaderboard: React.FC = () => {

  const [users, setUsers] = useState<User[]>([])
  const [isServerDown, setIsServerDown] = useState(false)
  const [expendUser, setExpendUser] = useState<string | null>()

  const [habitsLoading, setHabitsLoading] = useState(false)
  const loggedUser = useAppSelector(state => state.auth.user)

  const handleToggleUser = (userId: string) => {
    setExpendUser(prev => (prev === userId ? null : userId));
  }


  useEffect(() => {
    async function loadUsers() {
      setHabitsLoading(true)
      try {
        const res = await allUsers()

        if (!res) {
          setIsServerDown(true)
          return
        }
        setUsers(res)
      } catch (err) {
        console.log(err)
      }
      finally {
        setHabitsLoading(false)
      }
    }
    loadUsers()
  }, [loggedUser])

  const userNameShortener = (username: string) => {
    if (username.length > 18) {
      return username.slice(0, 18) + '...'
    }
    return username
  }

  return (
    <div className="my-28 min-h-screen">
      <h2 className="text-base md:text-2xl font-semibold mb-6">
        All hail <span className="text-orange-400 font-bold">{users[0]?.displayName || users[0]?.username || "Me"}</span>. The Leaderboard has been claimed and you saw it <span className='text-nowrap'> happen :/</span>
      </h2>

      <div className="w-full overflow-x-auto bg-[#0a1f11] text-white rounded-xl mx-auto shadow-xl">
        <table className="w-full table-auto md:table hidden">
          <thead className="text-sm text-neutral-400 border-b border-neutral-700">
            <tr>
              <th className="min-w-[80px] px-6 py-6 text-left">Rank</th>
              <th className="min-w-[160px] px-6 py-6 text-left">User</th>
              <th className="min-w-[100px] px-6 py-6 text-left">Points</th>
              <th className="min-w-[140px] px-6 py-6 text-left">Current Streak</th>
              <th className="min-w-[140px] px-6 py-6 text-left">Longest Streak</th>
            </tr>
          </thead>
          <tbody>
            {habitsLoading ? (
              <SkeletonLeaderboardRows />
            ) : (
              users.map((user, index) => (
                <tr key={index} className={`border-b transition border-neutral-800 ${loggedUser?._id === user._id ? 'bg-green-600/40' : 'hover:bg-[#14251d]'}`}>
                  <td className="p-6 text-xl">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{user.displayName || user.username}</div>
                        {user.displayName && (
                          <div className="text-xs flex text-neutral-300 items-center gap-1 hover:underline cursor-pointer">
                            <FaXTwitter size={11} />

                            <a href={`https://x.com/${user.username}`} target="_blank">
                              {user.username}
                            </a>
                          </div>
                        )}
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
              )))}
          </tbody>
        </table>

        {/* for smaller screen */}
        <div className='md:hidden block px-2 py-4 space-y-3'>
          {habitsLoading ? (
            <SkeletonLeaderboardCards />
          ) :
            (users.map((user, index) => (
              <div
                key={index}
                onClick={() => handleToggleUser(user._id)}
                className={`rounded-lg border border-green-950 transition-all duration-200 ${loggedUser?._id === user._id ? 'bg-green-600/40' : 'hover:bg-[#1e382c]'}`}
              >
                <div className='flex cursor-pointer items-center justify-between py-2 px-3'>
                  <div className='flex gap-2 items-center'>
                    <span>{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}</span>
                    <img src={user.avatar} alt="avatar" className='rounded-full w-10 h-10 object-cover' />
                    <h4 className='text-neutral-200 text-sm'>
                      {userNameShortener(user.displayName || user.username)}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span>{user.points}</span>
                    <IoChevronDown
                      className={`ml-1 text-neutral-400 transition-transform duration-200 ${expendUser === user._id ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                </div>

                {expendUser === user._id && (
                  <div className="px-4 py-4 border-t border-green-950 space-y-3 text-sm">
                    <div>
                      <h4 className="text-neutral-200  mb-1">{user.displayName || user.username}</h4>

                      {user.displayName && (
                        <div className="text-xs flex text-neutral-300 items-center gap-1 hover:underline cursor-pointer">
                          <FaXTwitter size={11} />

                          <a href={`https://x.com/${user.username}`} target="_blank">
                            {user.username}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className='flex justify-between'>
                      <div className="space-y-2">
                        <div className="text-neutral-400">Current Streak</div>
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-white">{user.currentStreak} days</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-neutral-400">Longest Streak</div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-white">{user.longestStreak} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )))}
        </div>



      </div>

      {isServerDown && (
        <h1 className='absolute left-1/3 top-1/3 text-xl sm:text-4xl'>500 - Server down</h1>
      )}

    </div>
  );
}


export default Leaderboard