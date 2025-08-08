import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader } from "lucide-react";
import { useModalScrollLock } from "~/utils/modal-utils";

interface NumberOfRoundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  numberOfRounds: number;
  setNumberOfRounds: (numberOfRounds: number) => void;
  updateNumberOfRounds: (numberOfRounds: number) => void;
  savingRounds: boolean;
  roundsUpdateSuccess: boolean;
}

const NumberOfRoundsModal: React.FC<NumberOfRoundsModalProps> = ({
  isOpen,
  onClose,
  numberOfRounds,
  setNumberOfRounds,
  updateNumberOfRounds,
  savingRounds,
  roundsUpdateSuccess,
}) => {
  // Use the modal scroll lock hook
  useModalScrollLock(isOpen);

  // Close modal when save is successful
  useEffect(() => {
    if (roundsUpdateSuccess) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [roundsUpdateSuccess, onClose]);

  // Background overlay animation
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  // Modal content animation
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.15,
      },
    },
  };

  const handleChange = (newValue: number) => {
    setNumberOfRounds(newValue);
    updateNumberOfRounds(newValue);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md   dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6">
              <button
                title="Đóng"
                onClick={onClose}
                className="absolute top-5 right-5 p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-all"
              >
                <X size={18} />
              </button>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Chọn số lượt đấu
              </h2>

              <div className="my-6">
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((num) => (
                    <div
                      key={num}
                      onClick={() => !savingRounds && handleChange(num)}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                        savingRounds
                          ? "opacity-70 cursor-not-allowed"
                          : "cursor-pointer"
                      } ${
                        numberOfRounds === num
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="font-medium">
                        {num === 1
                          ? "1 lượt"
                          : num === 2
                            ? "2 lượt (lượt đi & về)"
                            : `${num} lượt`}
                      </div>
                      {numberOfRounds === num && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 15,
                          }}
                        >
                          <CheckCircle className="text-blue-500" size={20} />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center mt-8">
                {savingRounds && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center text-gray-500 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full"
                  >
                    <Loader className="animate-spin mr-2" size={18} />
                    <span>Đang lưu...</span>
                  </motion.div>
                )}
                {roundsUpdateSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center text-green-500 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full"
                  >
                    <CheckCircle className="mr-2" size={18} />
                    <span>Đã lưu thành công</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NumberOfRoundsModal;
