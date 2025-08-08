import React from "react";
import { Loader } from "lucide-react";

export const ThirteenCardGameDetailSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col max-w-4xl mx-auto">
      {/* Header Skeleton */}
      <div className="  sticky top-0 z-40 border-b border-gray-200">
        <div className="flex justify-between items-center p-4 animate-pulse">
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Players Information Skeleton */}
        <div className="w-full pt-6 pb-4 animate-pulse">
          <div className="flex justify-between items-center">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="px-4 w-1/4 text-sm font-medium relative"
              >
                <div className="text-center">
                  <div className="flex justify-center flex-col items-center gap-2">
                    <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                    <div className="text-center w-full">
                      <div className="h-4 w-20 mx-auto bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 w-8 mx-auto bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grow overflow-y-auto h-full p-4">
        {/* Game Rounds Skeleton */}
        <div className="animate-pulse">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="relative border-b flex justify-between items-center w-full py-2"
            >
              {[...Array(4)].map((_, playerIndex) => (
                <div
                  key={playerIndex}
                  className="py-2 px-3 md:px-4 text-center w-1/4"
                >
                  <div className="h-5 w-8 mx-auto bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Winning Score Skeleton */}
        <div className="p-4 flex items-center justify-center flex-col gap-2 animate-pulse mt-4">
          <div className="h-8 w-40 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
          <div className="h-5 w-48 bg-gray-200 rounded mt-2"></div>
        </div>

        <div className="flex items-center justify-center my-4">
          <Loader className="animate-spin w-6 h-6 text-blue-500" />
          <span className="ml-2 text-gray-600 text-sm">Đang tải...</span>
        </div>
      </div>
    </div>
  );
};

export default ThirteenCardGameDetailSkeleton;
