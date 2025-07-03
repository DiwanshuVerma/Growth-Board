const SkeletonLeaderboardRows = () => {
  return (
    <>
      {Array(5).fill(0).map((_, i) => (
        <tr key={i} className="border-b border-neutral-800 animate-pulse">
          <td className="p-6 text-xl">
            <div className="h-5 w-6 bg-gray-800 rounded" />
          </td>
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-800 rounded-full" />
              <div>
                <div className="h-4 w-24 bg-gray-700 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-600 rounded" />
              </div>
            </div>
          </td>
          <td className="p-6">
            <div className="h-4 w-10 bg-gray-700 rounded" />
          </td>
          <td className="p-6">
            <div className="h-4 w-16 bg-gray-700 rounded" />
          </td>
          <td className="p-6">
            <div className="h-4 w-16 bg-gray-700 rounded" />
          </td>
        </tr>
      ))}
    </>
  )
}

export default SkeletonLeaderboardRows