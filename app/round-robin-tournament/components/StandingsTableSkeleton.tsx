// Standings Table Skeleton component
export const StandingsTableSkeleton = () => {
  // Create a responsive number of rows - showing fewer on mobile
  const skeletonRows = Array(20).fill(0);

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full   border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Hạng
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Đội
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Trận
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Hiệu số
            </th>
            <th className="px-4 py-3 text-center text-xs text-gray-500 uppercase tracking-wider border-b font-bold">
              Điểm
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              5 trận gần nhất
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {skeletonRows.map((_, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? " " : "bg-gray-50"} ${
                index > 20 ? "hidden sm:table-row" : ""
              }`}
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
              </td>
              <td className="py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="w-16 sm:w-24 h-5 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="w-6 sm:w-8 h-5 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="w-8 sm:w-12 h-6 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="w-8 sm:w-10 h-6 bg-blue-100 rounded-full mx-auto animate-pulse"></div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-1 justify-center">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-gray-200 animate-pulse ${
                        i > 20 ? "hidden sm:block" : ""
                      }`}
                    ></div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTableSkeleton;
