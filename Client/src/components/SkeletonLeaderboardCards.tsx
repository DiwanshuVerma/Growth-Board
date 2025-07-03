
const SkeletonLeaderboardCards = () => {
  return (
    <>
      {Array(5).fill(0).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-green-950 bg-[#0f1c15] animate-pulse p-4 space-y-3"
        >
          {/* Top row: avatar + name + points */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="h-4 w-4 bg-gray-700 rounded" />
              <div className="w-10 h-10 bg-gray-800 rounded-full" />
              <div className="h-4 w-24 bg-gray-600 rounded" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-700 rounded" />
              <div className="h-4 w-6 bg-gray-700 rounded" />
              <div className="h-4 w-4 bg-gray-700 rounded-full" />
            </div>
          </div>

          {/* Expanded card info */}
          <div className="border-t border-green-950 pt-3">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-700 rounded" />
                <div className="h-4 w-16 bg-gray-800 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-700 rounded" />
                <div className="h-4 w-16 bg-gray-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default SkeletonLeaderboardCards
