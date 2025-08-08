import React from "react";

export const ThirteenCardHistorySkeleton: React.FC<{ items?: number }> = ({
  items = 3,
}) => {
  return (
    <div className="w-full flex flex-col max-w-4xl mx-auto">
      {/* Game History List Skeleton */}
      <div className="grow overflow-y-auto">
        <div className="grid gap-4 animate-pulse">
          {[...Array(items)].map((_, i) => (
            <div
              key={i}
              className="border shadow-md border-gray-200 rounded-lg p-2"
            >
              {/* Date and Score info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                <div className="h-5 bg-gray-200 rounded w-40"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </div>

              {/* Player grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center p-2 rounded-lg border-2 border-gray-200 bg-gray-100"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="h-12 w-12 bg-gray-300 rounded-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-8"></div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-4 flex justify-between gap-2 pt-4 border-t">
                <div className="h-9 bg-gray-200 rounded w-28"></div>
                <div className="h-9 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}

          {/* Load more button */}
          <div className="flex justify-center mt-4">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirteenCardHistorySkeleton;
