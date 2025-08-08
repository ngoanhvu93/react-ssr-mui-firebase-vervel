import { AnimatePresence, motion } from "framer-motion";

const SearchResults = (props: {
  showSearchResults: boolean;
  searchResults: any[];
  mainPageSearchTerm: string;
  setMainPageSearchTerm: (term: string) => void;
  setShowSearchResults: (show: boolean) => void;
  selectHoliday: (holiday: any) => void;
  getDaysUntilSpecificHoliday: (date: Date) => number;
}) => {
  const {
    showSearchResults,
    searchResults,
    mainPageSearchTerm,
    setMainPageSearchTerm,
    setShowSearchResults,
    selectHoliday,
    getDaysUntilSpecificHoliday,
  } = props;
  return (
    <div className="absolute top-32 mx-auto max-w-[360px] md:max-w-[480px] w-full left-1/2 -translate-x-1/2   rounded-lg shadow-lg border  overflow-y-auto z-50">
      <AnimatePresence>
        {showSearchResults && (
          <div>
            {searchResults.length > 0 ? (
              <motion.div>
                <ul className="py-1">
                  {searchResults.map((holiday) => {
                    const daysUntil = getDaysUntilSpecificHoliday(
                      new Date(holiday.date)
                    );
                    return (
                      <li key={holiday.id}>
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center"
                          onClick={() => {
                            selectHoliday(holiday);
                            setMainPageSearchTerm("");
                            setShowSearchResults(false);
                          }}
                        >
                          <span className="mr-2 text-lg">{holiday.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium">{holiday.name}</div>
                            <div className="text-xs text-gray-600">
                              {new Date(holiday.date).toLocaleDateString(
                                "vi-VN",
                                {
                                  weekday: "long",
                                }
                              )}
                              ,{" "}
                              {new Date(holiday.date).toLocaleDateString(
                                "vi-VN"
                              )}
                              <span className="ml-2 inline-block bg-amber-100 text-amber-700 rounded px-1">
                                {daysUntil === 0
                                  ? "Hôm nay"
                                  : daysUntil > 0
                                  ? `Còn ${daysUntil} ngày`
                                  : `Đã qua ${Math.abs(daysUntil)} ngày`}
                              </span>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ) : (
              mainPageSearchTerm.trim() !== "" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="py-6 px-4 text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <h3 className="text-gray-800 font-medium mb-1">
                      Không tìm thấy sự kiện
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Không tìm thấy kết quả nào cho "{mainPageSearchTerm}"
                    </p>
                    <button
                      className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                      onClick={() => {
                        setMainPageSearchTerm("");
                        setShowSearchResults(false);
                      }}
                    >
                      Xóa tìm kiếm
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResults;
