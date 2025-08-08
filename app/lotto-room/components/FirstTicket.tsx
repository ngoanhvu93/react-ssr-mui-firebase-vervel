import type { MutableRefObject } from "react";
import { cn } from "~/utils/cn";

const FirstTicket = (props: {
  ticket: number[][];
  winningRows: number[];
  handleNumberClick: (num: number) => void;
  selectedNumbers: number[];
  ticketColor: string;
  cellRefs: MutableRefObject<Map<number, HTMLTableCellElement>>;
  lastCalledNumber: number;
  calledNumbers: number[];
}) => {
  return (
    <div className="mb-2 overflow-x-auto w-full max-w-full">
      <div className="overflow-x-auto pb-2">
        <table className="  shadow-lg w-full table-fixed">
          <tbody>
            {props.ticket.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn({
                  "bg-yellow-100": props.winningRows.includes(rowIndex),
                })}
              >
                {row.map((num, colIndex) => (
                  <td
                    key={colIndex}
                    ref={(el) => {
                      if (el && num !== null) {
                        props.cellRefs.current.set(num, el);
                      }
                    }}
                    onClick={() => props.handleNumberClick(num)}
                    className={cn(
                      "border-2 border-gray-500 p-1 text-2xl active:bg-yellow-600 sm:p-2 md:p-3 h-12 sm:h-14 md:h-16 text-center font-bold cursor-pointer transition-colors duration-200",
                      {
                        " ": num && !props.selectedNumbers.includes(num),
                        [`${props.ticketColor}`]: !num,
                        "text-red-600":
                          num === props.lastCalledNumber ||
                          props.calledNumbers.includes(num),
                        "bg-red-600 text-white":
                          num && props.selectedNumbers.includes(num),
                      }
                    )}
                  >
                    <div className="flex items-center justify-center ">
                      {num}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FirstTicket;
