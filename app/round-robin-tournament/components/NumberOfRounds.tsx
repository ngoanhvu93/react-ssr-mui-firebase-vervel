import { useState } from "react";
import { CheckCircle, ChevronDown, Loader } from "lucide-react";
import NumberOfRoundsModal from "./NumberOfRoundsModal";

const NumberOfRounds = (props: {
  numberOfRounds: number;
  setNumberOfRounds: (numberOfRounds: number) => void;
  updateNumberOfRounds: (numberOfRounds: number) => void;
  savingRounds: boolean;
  roundsUpdateSuccess: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2 items-center mb-2 w-full">
        <div className=" font-medium">Số lượt đấu:</div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={props.savingRounds}
          className="flex items-center shadow   justify-between gap-2 flex-1 border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-medium">
            {props.numberOfRounds === 1
              ? "1 lượt"
              : props.numberOfRounds === 2
              ? "2 lượt (lượt đi & về)"
              : `${props.numberOfRounds} lượt`}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <NumberOfRoundsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        numberOfRounds={props.numberOfRounds}
        setNumberOfRounds={props.setNumberOfRounds}
        updateNumberOfRounds={props.updateNumberOfRounds}
        savingRounds={props.savingRounds}
        roundsUpdateSuccess={props.roundsUpdateSuccess}
      />
    </>
  );
};

export default NumberOfRounds;
