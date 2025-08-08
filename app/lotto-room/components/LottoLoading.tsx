import { Loader } from "lucide-react";

const LottoLoading = () => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 pointer-events-none">
      <Loader className="size-20 animate-spin text-blue-600" />
    </div>
  );
};

export default LottoLoading;
