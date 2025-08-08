const TournamentDetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="bg-gray-100 p-3 rounded-lg grid grid-cols-4 gap-4 mb-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div className="size-12 rounded-full bg-gray-200"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
      <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

export default TournamentDetailsSkeleton;
