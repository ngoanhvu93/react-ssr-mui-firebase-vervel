import { Loader } from "lucide-react";

export default function CustomLoading({ size = 16 }: { size?: number }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
      <Loader size={size} className=" animate-spin  text-blue-500  " />
    </div>
  );
}
