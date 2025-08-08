import { Loader } from "lucide-react";

const CountdownUnitSkeleton = () => {
  return (
    <div className="w-16 sm:w-20 md:w-24 aspect-square animate-pulse">
      <div className="h-full">
        <div className="bg-gray-200 rounded-xl shadow-lg flex flex-col items-center justify-center p-2 relative overflow-hidden h-full">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-md mb-1"></div>
          <div className="w-10 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const CountdownSkeleton = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex justify-evenly items-center w-full space-x-4">
        <div className="flex-1">
          <CountdownUnitSkeleton />
        </div>
        <div className="flex-1">
          <CountdownUnitSkeleton />
        </div>
        <div className="flex-1">
          <CountdownUnitSkeleton />
        </div>
        <div className="flex-1">
          <CountdownUnitSkeleton />
        </div>
      </div>

      <div className="mt-4 w-3/4 h-6 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
    </div>
  );
};

const HeaderSkeleton = () => {
  return (
    <div className="flex justify-between items-center w-full mb-4 animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
      <div className="w-32 h-8 bg-gray-200 rounded-lg"></div>
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
    </div>
  );
};

const SearchBoxSkeleton = () => {
  return (
    <div className="w-full max-w-[360px] md:max-w-[480px] h-12 bg-gray-200 rounded-lg mb-6 animate-pulse mx-auto"></div>
  );
};

const SelectedHolidaySkeleton = () => {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
        <div className="w-40 h-6 bg-gray-200 rounded"></div>
      </div>
      <div className="w-56 h-4 bg-gray-200 rounded mb-2"></div>
      <div className="w-32 h-4 bg-gray-200 rounded"></div>
    </div>
  );
};

const MusicPlayerSkeleton = () => {
  return (
    <div className="w-full max-w-md mx-auto py-3 px-4 bg-gray-100 rounded-xl animate-pulse mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full mb-3"></div>
      <div className="flex justify-between items-center">
        <div className="w-12 h-4 bg-gray-200 rounded"></div>
        <div className="flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
          ))}
        </div>
        <div className="w-12 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[100dvh] px-4 pt-4 pb-6">
      <div className="w-full flex flex-col items-center justify-center">
        <HeaderSkeleton />
        <SearchBoxSkeleton />
        <SelectedHolidaySkeleton />
        <div className="my-6 w-full">
          <CountdownSkeleton />
        </div>
        <div className="flex items-center justify-center space-x-2 my-4">
          <Loader className="animate-spin w-5 h-5 text-gray-500" />
          <span className="text-gray-500 text-sm">Đang tải...</span>
        </div>
      </div>
      <MusicPlayerSkeleton />
    </div>
  );
};

export default SkeletonLoader;
