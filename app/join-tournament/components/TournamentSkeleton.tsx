const TournamentSkeleton = () => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div className="mt-3 flex">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="size-[48px] rounded-full bg-gray-200 -mr-4 border-2 border-white"
            style={{ zIndex: i }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default TournamentSkeleton;
