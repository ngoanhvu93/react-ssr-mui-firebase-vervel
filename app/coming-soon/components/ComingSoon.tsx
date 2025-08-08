import { useNavigate } from "react-router";
import { TopAppBar } from "../../components/TopAppBar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ComingSoon = () => {
  const navigate = useNavigate();
  return (
    <div>
      <TopAppBar onBack={() => navigate(-1)} title="Sắp ra mắt" />
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <DotLottieReact
          src="https://lottie.host/16ab98f9-ef6b-4894-9f8b-b58eedb1e4bb/HBqKXo5Q7M.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default ComingSoon;
