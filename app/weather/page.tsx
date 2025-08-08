import { Suspense } from "react";
import AppleWeather from "./components/AppleWeather";
import { TopAppBar } from "~/components/TopAppBar";
import { useNavigate } from "react-router";

export default function WeatherPage() {
  const navigate = useNavigate();
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      }
    >
      <div className="w-full flex flex-col mx-auto max-w-4xl">
        <TopAppBar
          title="Thời tiết"
          onBack={() => {
            navigate("/");
          }}
        ></TopAppBar>{" "}
        <AppleWeather />
      </div>
    </Suspense>
  );
}
