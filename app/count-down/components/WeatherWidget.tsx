import React, { useEffect, useState, useRef } from "react";
import {
  getCurrentLocationWeather,
  fetchWeatherByCoords,
  searchLocationsInVietnam,
  type WeatherData,
  type ForecastDay,
  type LocationData,
} from "~/utils/weather-service";
import {
  AlertCircle,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  MapPin,
  Sun,
  Wind,
  Sunrise,
  Sunset,
  Gauge,
  Eye,
  Umbrella,
  Thermometer,
  ChevronDown,
  ChevronUp,
  Search,
  XCircle,
  Loader2,
  LocateFixed,
  Clock,
  RefreshCw,
  Loader,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Weather effect components with enhanced visibility
const SunnyEffect: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-32 h-32 rounded-full bg-amber-300/70 blur-3xl right-5 top-10 animate-pulse" />
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-amber-300/50"
        initial={{
          width: 10,
          height: 10,
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: 0,
        }}
        animate={{
          width: [10, 50, 10],
          height: [10, 50, 10],
          opacity: [0, 0.8, 0],
          x: Math.random() * 100,
          y: Math.random() * 100,
        }}
        transition={{
          repeat: Infinity,
          duration: 5 + Math.random() * 5,
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

const RainEffect: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-blue-900/20" />
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-0.5 bg-sky-200/80 rounded-full"
        initial={{
          height: 10 + Math.random() * 15,
          x: Math.random() * 100,
          y: -20,
          opacity: 0.7 + Math.random() * 0.3,
        }}
        animate={{
          y: 120,
          opacity: [0.7 + Math.random() * 0.3, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.7 + Math.random() * 0.5,
          delay: Math.random() * 2,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const SnowEffect: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-blue-100/10" />
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1.5 h-1.5   rounded-full shadow-lg shadow-white/30"
        initial={{
          x: Math.random() * 100,
          y: -10,
          opacity: 0.95,
        }}
        animate={{
          y: 120,
          x: [
            Math.random() * 100,
            Math.random() * 100 + 10,
            Math.random() * 100,
          ],
          opacity: [0.95, 0.95, 0],
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 4 + Math.random() * 3,
          delay: Math.random() * 3,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const ThunderstormEffect: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-indigo-900/30" />
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-full h-full bg-amber-100/70 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.2,
          delay: 3 + Math.random() * 5,
          repeatDelay: 5 + Math.random() * 5,
        }}
      />
    ))}
    <RainEffect />
  </div>
);

const FogEffect: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-slate-400/20" />
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute h-14 bg-slate-200/40 rounded-full blur-xl"
        initial={{
          width: 50 + Math.random() * 30,
          x: -50,
          y: 10 + i * 25,
          opacity: 0,
        }}
        animate={{
          x: 120,
          opacity: [0, 0.8, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 15 + Math.random() * 10,
          delay: Math.random() * 5,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const CloudyEffect: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-slate-400/10" />
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute  /20 rounded-full blur-xl"
        initial={{
          width: 60 + Math.random() * 40,
          height: 30 + Math.random() * 20,
          x: -60,
          y: 20 + i * 30,
          opacity: 0,
        }}
        animate={{
          x: 120,
          opacity: [0, 0.7, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 20 + Math.random() * 15,
          delay: Math.random() * 10,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const WeatherEffect: React.FC<{ weatherIcon: string | undefined }> = ({
  weatherIcon,
}) => {
  switch (weatherIcon) {
    case "clear":
      return <SunnyEffect />;
    case "partly-cloudy":
      return <CloudyEffect />;
    case "cloudy":
      return <CloudyEffect />;
    case "rain":
    case "drizzle":
      return <RainEffect />;
    case "snow":
      return <SnowEffect />;
    case "thunderstorm":
      return <ThunderstormEffect />;
    case "fog":
      return <FogEffect />;
    default:
      return null;
  }
};

// Forecast day component with improved contrast
const ForecastDay: React.FC<{ forecast: ForecastDay }> = ({ forecast }) => {
  const renderIcon = (icon: string) => {
    switch (icon) {
      case "clear":
        return <Sun className="w-7 h-7 text-amber-400 drop-shadow-md" />;
      case "partly-cloudy":
        return <Cloud className="w-7 h-7 text-gray-100 drop-shadow-md" />;
      case "cloudy":
        return <Cloud className="w-7 h-7 text-gray-200 drop-shadow-md" />;
      case "fog":
        return <CloudFog className="w-7 h-7 text-gray-200 drop-shadow-md" />;
      case "drizzle":
        return <CloudDrizzle className="w-7 h-7 text-sky-200 drop-shadow-md" />;
      case "rain":
        return <CloudRain className="w-7 h-7 text-sky-300 drop-shadow-md" />;
      case "snow":
        return <CloudSnow className="w-7 h-7 text-gray-100 drop-shadow-md" />;
      case "thunderstorm":
        return (
          <CloudLightning className="w-7 h-7 text-amber-300 drop-shadow-md" />
        );
      default:
        return <Cloud className="w-7 h-7 text-gray-100 drop-shadow-md" />;
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center  /10 p-2.5 rounded-xl backdrop-blur-sm hover: /20 transition-all border border-white/10"
      whileHover={{
        scale: 1.05,
        y: -5,
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      }}
    >
      <span className="text-xs font-medium text-white mb-1  /10 px-2 py-0.5 rounded-full">
        {forecast.date}
      </span>
      <div
        className="my-1.5 p-1.5  /15 rounded-full"
        style={{ boxShadow: "0 0 10px rgba(255,255,255,0.1)" }}
      >
        {renderIcon(forecast.icon)}
      </div>
      <div className="text-sm font-semibold text-white">
        {forecast.min_temp}°-{forecast.max_temp}°
      </div>
      <div className="text-xs text-white/90 mt-1">
        {forecast.precipitation_probability > 0 && (
          <span className="flex items-center justify-center gap-1 bg-sky-500/20 px-1.5 py-0.5 rounded-full border border-sky-400/20">
            <Droplets className="w-3 h-3 text-sky-300" />
            {forecast.precipitation_probability}%
          </span>
        )}
      </div>
    </motion.div>
  );
};

const WeatherWidget: React.FC<{
  onClose: () => void;
}> = (props) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showStickyTemp, setShowStickyTemp] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Location search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [recentLocations, setRecentLocations] = useState<LocationData[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [screenHeight, setScreenHeight] = useState(0);

  // Popular locations in Vietnam
  const popularLocations: LocationData[] = [
    {
      name: "Hà Nội",
      latitude: 21.0285,
      longitude: 105.8542,
      admin1: "Thủ đô",
    },
    {
      name: "TP. Hồ Chí Minh",
      latitude: 10.8231,
      longitude: 106.6297,
      admin1: "Thành phố",
    },
    {
      name: "Đà Nẵng",
      latitude: 16.0544,
      longitude: 108.2022,
      admin1: "Thành phố",
    },
    {
      name: "Nha Trang",
      latitude: 12.2388,
      longitude: 109.1967,
      admin1: "Khánh Hòa",
    },
    {
      name: "Huế",
      latitude: 16.4637,
      longitude: 107.5909,
      admin1: "Thừa Thiên Huế",
    },
    {
      name: "Cần Thơ",
      latitude: 10.0452,
      longitude: 105.7469,
      admin1: "Thành phố",
    },
    {
      name: "Hải Phòng",
      latitude: 20.8449,
      longitude: 106.6881,
      admin1: "Thành phố",
    },
    {
      name: "Vũng Tàu",
      latitude: 10.3459,
      longitude: 107.0843,
      admin1: "Bà Rịa - Vũng Tàu",
    },
    {
      name: "Đà Lạt",
      latitude: 11.9404,
      longitude: 108.4583,
      admin1: "Lâm Đồng",
    },
    {
      name: "Phú Quốc",
      latitude: 10.2233,
      longitude: 103.9633,
      admin1: "Kiên Giang",
    },
  ];

  // Check screen size on mount and when it changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 640);
      setScreenHeight(typeof window !== "undefined" ? window.innerHeight : 0);
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkScreenSize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkScreenSize);
      }
    };
  }, []);

  useEffect(() => {
    // Add beforeunload event listener
    const handleBeforeUnload = () => {
      localStorage.removeItem("weatherWidgetLoaded");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    // Cleanup function to remove event listener when component unmounts
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
    };
  }, []);

  // Load recent locations from localStorage
  useEffect(() => {
    const savedLocations = localStorage.getItem("weatherRecentLocations");
    if (savedLocations) {
      try {
        const locations = JSON.parse(savedLocations);
        setRecentLocations(locations);
      } catch (e) {
        console.error("Error parsing recent locations:", e);
      }
    }
  }, []);

  useEffect(() => {
    // Check if this is the first load
    const hasLoaded = localStorage.getItem("weatherWidgetLoaded");
    if (hasLoaded) {
      setIsFirstLoad(false);
    }

    // Function to load weather data
    async function loadWeather() {
      try {
        if (isFirstLoad) {
          setLoading(true);
        }

        let data;
        if (selectedLocation) {
          // Use selected location
          data = await fetchWeatherByCoords(
            selectedLocation.latitude,
            selectedLocation.longitude
          );

          // Add to recent locations if not already there
          addToRecentLocations(selectedLocation);
        } else {
          // Use current location
          data = await getCurrentLocationWeather();
        }

        setWeather(data);
        setError(null);

        // Save weather data and timestamp to localStorage
        const weatherCache = {
          data,
          timestamp: new Date().getTime(),
          selectedLocation: selectedLocation,
        };
        localStorage.setItem("weatherWidgetLoaded", "true");
        localStorage.setItem("weatherData", JSON.stringify(weatherCache));
      } catch (err) {
        setError("Không thể lấy dữ liệu thời tiết");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // Check if cached data exists and is recent (less than 30 minutes old)
    const cachedData = localStorage.getItem("weatherData");

    if (cachedData) {
      try {
        const {
          data,
          timestamp,
          selectedLocation: cachedLocation,
        } = JSON.parse(cachedData);
        const now = new Date().getTime();
        // Reduce cache time from 1 minute to 30 seconds for more frequent updates
        const cacheTimeInMs = 30 * 1000;

        // Restore selected location if available
        if (cachedLocation && !selectedLocation) {
          setSelectedLocation(cachedLocation);
        }

        // If data is less than 30 seconds old, use it
        if (now - timestamp < cacheTimeInMs) {
          setWeather(data);
          setLoading(false);
          // Still load fresh data in the background
          if (now - timestamp > 15 * 1000) {
            loadWeather();
          }
          return;
        }
      } catch (e) {
        console.error("Error parsing cached weather data:", e);
      }
    }

    // If no valid cached data, load fresh data
    loadWeather();
  }, [isFirstLoad, selectedLocation]);

  // Handle search query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setSearchLoading(true);
        const results = await searchLocationsInVietnam(searchQuery);
        setSearchResults(results);
        setSearchLoading(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setSearchOpen(false);
    setSearchQuery("");

    // Immediately load weather for the selected location
    setLoading(true);
    (async () => {
      try {
        const data = await fetchWeatherByCoords(
          location.latitude,
          location.longitude
        );
        setWeather(data);
        setError(null);

        // Update localStorage
        const weatherCache = {
          data,
          timestamp: new Date().getTime(),
          selectedLocation: location,
        };
        localStorage.setItem("weatherData", JSON.stringify(weatherCache));

        // Add to recent locations
        addToRecentLocations(location);
      } catch (err) {
        setError("Không thể lấy dữ liệu thời tiết");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  };

  const resetToCurrentLocation = async () => {
    setSelectedLocation(null);
    setLoading(true);
    try {
      const data = await getCurrentLocationWeather();
      setWeather(data);
      setError(null);

      // Update localStorage
      const weatherCache = {
        data,
        timestamp: new Date().getTime(),
        selectedLocation: null,
      };
      localStorage.setItem("weatherData", JSON.stringify(weatherCache));
    } catch (err) {
      setError("Không thể lấy dữ liệu thời tiết");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a function to manually refresh weather data
  const refreshWeatherData = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedLocation) {
        // Use selected location
        data = await fetchWeatherByCoords(
          selectedLocation.latitude,
          selectedLocation.longitude
        );
      } else {
        // Use current location
        data = await getCurrentLocationWeather();
      }

      setWeather(data);
      setError(null);

      // Save weather data and timestamp to localStorage
      const weatherCache = {
        data,
        timestamp: new Date().getTime(),
        selectedLocation: selectedLocation,
      };
      localStorage.setItem("weatherWidgetLoaded", "true");
      localStorage.setItem("weatherData", JSON.stringify(weatherCache));
    } catch (err) {
      setError("Không thể lấy dữ liệu thời tiết");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a selected location to recent locations
  const addToRecentLocations = (location: LocationData) => {
    if (!location) return;

    // Remove this location if it already exists
    const filteredLocations = recentLocations.filter(
      (loc) =>
        !(
          loc.latitude === location.latitude &&
          loc.longitude === location.longitude
        )
    );

    // Add the new location to the beginning of the array
    const newLocations = [location, ...filteredLocations].slice(0, 5); // Keep only 5 most recent
    setRecentLocations(newLocations);

    // Save to localStorage
    localStorage.setItem(
      "weatherRecentLocations",
      JSON.stringify(newLocations)
    );
  };

  const renderWeatherIcon = () => {
    if (!weather) return <Cloud className="w-10 h-10 text-gray-100" />;

    const iconSize = isMobile ? "w-12 h-12" : "w-14 h-14";

    switch (weather.icon) {
      case "clear":
        return <Sun className={`${iconSize} text-amber-400`} />;
      case "partly-cloudy":
        return <Cloud className={`${iconSize} text-gray-100`} />;
      case "cloudy":
        return <Cloud className={`${iconSize} text-gray-100`} />;
      case "fog":
        return <CloudFog className={`${iconSize} text-gray-200`} />;
      case "drizzle":
        return <CloudDrizzle className={`${iconSize} text-sky-200`} />;
      case "rain":
        return <CloudRain className={`${iconSize} text-sky-300`} />;
      case "snow":
        return <CloudSnow className={`${iconSize} text-gray-100`} />;
      case "thunderstorm":
        return <CloudLightning className={`${iconSize} text-amber-300`} />;
      default:
        return <Cloud className={`${iconSize} text-gray-100`} />;
    }
  };

  const getWeatherBackground = () => {
    if (!weather) return "from-blue-500 to-blue-700";

    switch (weather.icon) {
      case "clear":
        return "from-sky-400 via-blue-400 to-blue-600"; // Enhanced gradient for sunny day
      case "partly-cloudy":
        return "from-blue-400 via-indigo-400 to-blue-600"; // Enhanced gradient for partly cloudy
      case "cloudy":
        return "from-slate-400 via-slate-500 to-slate-600"; // Enhanced gradient for cloudy
      case "fog":
        return "from-slate-400 via-slate-500 to-slate-700"; // Enhanced gradient for foggy
      case "drizzle":
        return "from-blue-500 via-blue-600 to-blue-700"; // Enhanced gradient for drizzle
      case "rain":
        return "from-blue-600 via-indigo-600 to-blue-800"; // Enhanced gradient for rain
      case "snow":
        return "from-blue-100 via-slate-200 to-slate-400"; // Enhanced gradient for snow
      case "thunderstorm":
        return "from-indigo-700 via-purple-700 to-indigo-900"; // Enhanced gradient for thunderstorm
      default:
        return "from-blue-500 to-blue-700"; // Default gradient
    }
  };

  const getUVIndexLabel = (uvIndex?: number) => {
    if (uvIndex === undefined) return "N/A";
    if (uvIndex <= 2) return "Thấp";
    if (uvIndex <= 5) return "Trung bình";
    if (uvIndex <= 7) return "Cao";
    if (uvIndex <= 10) return "Rất cao";
    return "Nguy hiểm";
  };

  const getUVIndexColor = (uvIndex?: number) => {
    if (uvIndex === undefined) return "text-white";
    if (uvIndex <= 2) return "text-green-400";
    if (uvIndex <= 5) return "text-amber-400";
    if (uvIndex <= 7) return "text-orange-400";
    if (uvIndex <= 10) return "text-rose-400";
    return "text-purple-400";
  };

  // Helper function to determine appropriate max height based on screen size
  const getMobileMaxHeight = () => {
    if (!isMobile) return undefined;
    return expanded ? "none" : `${Math.min(screenHeight * 0.85, 600)}px`;
  };

  // Add scroll handler to detect when weather icon is out of view
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      // Check if we've scrolled past the top temperature section
      const scrollPosition = contentRef.current.scrollTop;
      // Show sticky temp after scrolling down about 120px
      setShowStickyTemp(scrollPosition > 120);
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (loading && isFirstLoad) {
    return (
      <div className="h-full max-h-screen flex flex-col w-full p-4 bg-gradient-to-b from-blue-500 to-blue-700 shadow-lg border border-white/15 relative overflow-hidden">
        <div className="flex flex-col items-center relative z-10">
          {/* Fixed top content skeleton */}
          <div className="w-full max-w-md mx-auto pt-2">
            {/* Location display */}
            <div className="flex justify-center mb-3">
              <div className="w-32 h-4  /20 rounded-full animate-pulse" />
            </div>

            {/* Temperature and icon section */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-14 h-14  /20 rounded-full animate-pulse mb-2" />
              <div className="text-center">
                <div className="w-20 h-10  /20 rounded-full animate-pulse mb-1" />
                <div className="w-24 h-3  /20 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Scrollable content skeleton */}
          <div className="w-full">
            {/* "Cảm giác như" text */}
            <div className="text-center mb-4">
              <div className="w-24 h-4  /20 rounded-full animate-pulse mx-auto" />
            </div>

            {/* High-Low temperature */}
            <div className="flex justify-center mb-3">
              <div className="w-32 h-6  /20 rounded-xl animate-pulse" />
            </div>

            {/* Sunrise/Sunset */}
            <div className="flex justify-center w-full gap-8 mb-3">
              <div className="w-16 h-4  /20 rounded-full animate-pulse" />
              <div className="w-16 h-4  /20 rounded-full animate-pulse" />
            </div>

            {/* First row of weather metrics */}
            <div className="grid grid-cols-2 gap-3 w-full mb-3">
              <div className="flex items-center  /10 p-2 rounded-xl border border-white/5">
                <div className="w-6 h-6  /20 rounded-full animate-pulse mr-2" />
                <div>
                  <div className="text-xs text-white/70">Độ ẩm</div>
                  <div className="w-12 h-4  /20 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="flex items-center  /10 p-2 rounded-xl border border-white/5">
                <div className="w-6 h-6  /20 rounded-full animate-pulse mr-2" />
                <div>
                  <div className="text-xs text-white/70">Gió</div>
                  <div className="w-12 h-4  /20 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Forecast section */}
            <div className="w-full mt-2">
              <div className="w-32 h-4  /20 rounded-full animate-pulse mb-2" />
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className=" /10 px-3 py-2 rounded-xl">
                    <div className="w-12 h-3  /20 rounded-full animate-pulse mx-auto mb-2" />
                    <div className="w-6 h-6  /20 rounded-full animate-pulse mx-auto my-1" />
                    <div className="w-16 h-3  /20 rounded-full animate-pulse mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full p-4 bg-gradient-to-b from-red-500 to-red-700 border border-white/15 relative overflow-hidden">
        <div className="flex flex-col items-center h-full justify-center relative z-10">
          <div className="w-14 h-14  /10 rounded-full mb-3 flex items-center justify-center">
            <AlertCircle className="w-9 h-9 text-white" />
          </div>
          <p className="text-white text-center font-medium mb-2">{error}</p>
          <p className="text-white/80 text-sm text-center">
            Vui lòng cho phép truy cập vị trí để cập nhật thời tiết
          </p>
        </div>
      </div>
    );
  }

  // If we're not in initial loading state and have no weather data, return null
  if (!weather && !loading) return null;

  // If we're loading but not on first load and have no weather data yet, show a minimal loading state
  if (loading && !isFirstLoad && !weather) {
    return (
      <div className="h-full max-h-screen w-full p-4 bg-gradient-to-b from-blue-500 to-blue-700 shadow-lg border border-white/15 relative overflow-hidden">
        <div className="flex justify-center items-center h-32">
          <Loader className="w-10 h-10 text-white animate-spin" />
        </div>
      </div>
    );
  }

  // Now we're certain weather is not null at this point
  const weatherData = weather!;

  // If we have weather data, show it (even if we're loading in the background)
  return (
    <motion.div
      className={`p-4 bg-gradient-to-b ${getWeatherBackground()} transition-all flex w-full flex-col h-[100dvh] duration-300 overflow-hidden mx-auto max-w-[640px]`}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <WeatherEffect weatherIcon={weatherData.icon} />

      {/* Sticky temperature display that appears when scrolling */}
      <AnimatePresence>
        {showStickyTemp && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-0 z-30 w-full flex items-center justify-center  /15 backdrop-blur-md py-2 px-4 rounded-xl border border-white/15 shadow-lg mb-2"
          >
            <div className="flex items-center">
              {renderWeatherIcon()}
              <div className="ml-3">
                <div className="text-2xl font-bold text-white">
                  {weatherData.temperature}°
                </div>
                <div className="text-xs text-white/80 capitalize">
                  {weatherData.description}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={contentRef}
        className="flex flex-col items-center relative z-10 overflow-y-auto grow h-full"
      >
        {/* Location search and action buttons - positioned at the top right */}
        <div className="absolute top-0 right-0 flex gap-1.5 z-20">
          {selectedLocation && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5  /20 rounded-full text-white hover: /30 transition-colors"
              onClick={resetToCurrentLocation}
              title="Về vị trí hiện tại"
              aria-label="Về vị trí hiện tại"
            >
              <LocateFixed className="w-3.5 h-3.5" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5  /20 rounded-full text-white hover: /30 transition-colors"
            onClick={refreshWeatherData}
            title="Tải lại dữ liệu mới nhất"
            aria-label="Tải lại dữ liệu mới nhất"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5  /20 rounded-full text-white hover: /30 transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="Tìm kiếm địa điểm"
            title="Tìm kiếm địa điểm"
          >
            <Search className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Location search modal */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm rounded-2xl p-4 flex flex-col max-h-screen overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm địa điểm tại Việt Nam..."
                    className="w-full  /10 border border-white/20 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                      onClick={() => setSearchQuery("")}
                      aria-label="Xóa tìm kiếm"
                      title="Xóa tìm kiếm"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2  /10 rounded-lg text-white hover: /20 transition-colors"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Đóng tìm kiếm"
                  title="Đóng tìm kiếm"
                >
                  <XCircle className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-auto">
                {/* Popular locations */}
                {searchQuery.length === 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-white/70 mr-2" />
                      <h3 className="text-sm font-medium text-white/90">
                        Địa điểm phổ biến
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {popularLocations.map((location, index) => (
                        <motion.button
                          key={`popular-${location.name}`}
                          className=" /10 hover: /20 p-2.5 rounded-xl text-left text-white transition-colors flex items-center"
                          onClick={() => handleLocationSelect(location)}
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: "rgba(255,255,255,0.15)",
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-white/70" />
                          <div>
                            <div className="font-medium text-sm">
                              {location.name}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent locations */}
                {recentLocations.length > 0 && searchQuery.length === 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-white/70 mr-2" />
                      <h3 className="text-sm font-medium text-white/90">
                        Vị trí gần đây
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {recentLocations.map((location, index) => (
                        <motion.button
                          key={`recent-${location.name}-${index}`}
                          className="w-full  /10 hover: /20 p-2.5 rounded-xl text-left text-white transition-colors flex items-center"
                          onClick={() => handleLocationSelect(location)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">
                              {location.name}
                            </div>
                            {location.admin1 && (
                              <div className="text-xs text-white/70">
                                {location.admin1}
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search results */}
                <div className="flex-1 overflow-y-auto">
                  {searchLoading ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchQuery.length >= 2 && (
                        <div className="text-xs text-white/70 mb-1 px-1">
                          Kết quả tìm kiếm:
                        </div>
                      )}
                      {searchResults.map((location, index) => (
                        <motion.button
                          key={`search-${location.name}-${index}`}
                          className="w-full  /10 hover: /20 p-3 rounded-xl text-left text-white transition-colors flex items-center"
                          onClick={() => handleLocationSelect(location)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          aria-label={`Chọn ${location.name}`}
                        >
                          <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{location.name}</div>
                            {location.admin1 && (
                              <div className="text-sm text-white/70">
                                {location.admin1}
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : searchQuery.length >= 2 ? (
                    <div className="text-center py-6 text-white/70">
                      Không tìm thấy địa điểm nào
                    </div>
                  ) : searchQuery.length > 0 ? (
                    <div className="text-center py-6 text-white/70">
                      Nhập thêm ký tự để tìm kiếm
                    </div>
                  ) : (
                    <div className="text-center py-6 text-white/70">
                      Nhập tên thành phố hoặc địa điểm để tìm kiếm
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content with better spacing and alignment */}
        <div className="w-full max-w-md mx-auto pt-2">
          {/* Location display with more consistent styling */}
          <div className="flex justify-center mb-3">
            {selectedLocation ? (
              <div className="flex flex-col items-center">
                <div
                  className="flex items-center text-white  /15 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-indigo-400/30 shadow-lg"
                  style={{
                    boxShadow:
                      "0 0 10px rgba(255,255,255,0.1), 0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                >
                  <MapPin className="w-4 h-4 mr-1.5 text-indigo-300" />
                  <div>
                    <div className="font-semibold text-sm text-white">
                      {selectedLocation.name}
                    </div>
                    {selectedLocation.admin1 && (
                      <div className="text-xs text-white/80">
                        {selectedLocation.admin1}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-white/90 flex items-center bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-400/20 shadow-sm mt-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-indigo-400 rounded-full mr-1 animate-pulse"></span>
                  Đang xem thời tiết tại vị trí đã chọn
                </div>
              </div>
            ) : (
              <div className="text-xs flex items-center text-white  /15 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-md">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span className="font-medium">{weatherData.location}</span>
                <span className="ml-1.5 px-1.5 py-0.5 bg-green-500/30 text-xs rounded-full flex items-center border border-green-400/30">
                  <span className="mr-0.5 text-green-300 animate-pulse">•</span>{" "}
                  Vị trí hiện tại
                </span>
              </div>
            )}
          </div>

          {/* Temperature and icon section with improved layout */}
          <div className="flex flex-col items-center mb-4">
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: weatherData.icon === "clear" ? [0, 5, 0] : 0,
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className="mb-2 p-4  /15 backdrop-blur-sm rounded-full shadow-lg"
              style={{
                boxShadow: "0 0 15px rgba(255,255,255,0.1)",
              }}
            >
              {renderWeatherIcon()}
            </motion.div>

            <div className="text-center">
              <div
                className="text-5xl font-bold text-white mb-1 drop-shadow-lg"
                style={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                {weatherData.temperature}°
              </div>
              <div className="text-sm text-white/90 capitalize font-medium">
                {weatherData.description}
              </div>
              <div className="text-xs text-white/80 mt-1  /10 px-2 py-0.5 rounded-full inline-block">
                Cảm giác như {weatherData.feels_like}°
              </div>
            </div>
          </div>

          {/* High-Low temperature and Sunrise/Sunset in one consistent row */}
          <div className="grid grid-cols-1 gap-2 mb-4">
            {/* High-Low temperature */}
            {weatherData.forecast && weatherData.forecast.length > 0 && (
              <div className="flex justify-center">
                <div className="text-sm text-white font-medium px-4 py-2  /15 rounded-xl backdrop-blur-sm flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <Thermometer className="w-4 h-4 mr-1.5 text-amber-300" />
                    <span className="text-amber-300 mr-1">↑</span>
                    <span>{weatherData.forecast[0].max_temp}°</span>
                  </div>
                  <div className="h-4 w-px  /30"></div>
                  <div className="flex items-center">
                    <Thermometer className="w-4 h-4 mr-1.5 text-sky-300" />
                    <span className="text-sky-300 mr-1">↓</span>
                    <span>{weatherData.forecast[0].min_temp}°</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sunrise/Sunset row */}
            {weatherData.sunrise && weatherData.sunset && (
              <div className="flex justify-center">
                <div className=" /15 px-4 py-2 rounded-xl backdrop-blur-sm flex items-center justify-center space-x-5">
                  <div className="flex items-center text-white">
                    <Sunrise className="w-4 h-4 mr-2 text-amber-300" />
                    <span className="text-sm">{weatherData.sunrise}</span>
                  </div>
                  <div className="h-5 w-px  /30"></div>
                  <div className="flex items-center text-white">
                    <Sunset className="w-4 h-4 mr-2 text-orange-400" />
                    <span className="text-sm">{weatherData.sunset}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Weather metrics in a balanced 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 w-full mb-4">
            {/* Humidity */}
            <motion.div
              className="flex items-center  /15 p-3 rounded-xl border border-white/15 hover: /20 transition-colors backdrop-blur-sm h-full"
              whileHover={{
                scale: 1.03,
                y: -2,
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
              style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
            >
              <div className="w-10 h-10 bg-sky-500/20 rounded-full flex items-center justify-center mr-3">
                <Droplets className="w-5 h-5 text-sky-300 drop-shadow" />
              </div>
              <div>
                <div className="text-xs text-white/80">Độ ẩm</div>
                <div className="text-sm font-medium text-white">
                  {weatherData.humidity}%
                </div>
              </div>
            </motion.div>

            {/* Wind */}
            <motion.div
              className="flex items-center  /15 p-3 rounded-xl border border-white/15 hover: /20 transition-colors backdrop-blur-sm h-full"
              whileHover={{
                scale: 1.03,
                y: -2,
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
              style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
            >
              <div className="w-10 h-10 bg-sky-400/20 rounded-full flex items-center justify-center mr-3">
                <Wind className="w-5 h-5 text-sky-200 drop-shadow" />
              </div>
              <div>
                <div className="text-xs text-white/80">Gió</div>
                <div className="text-sm font-medium text-white">
                  {weatherData.windSpeed} m/s
                </div>
              </div>
            </motion.div>

            {/* Additional metrics (always shown for better layout balance) */}
            {/* UV Index */}
            <motion.div
              className="flex items-center  /15 p-3 rounded-xl border border-white/15 hover: /20 transition-colors backdrop-blur-sm h-full"
              whileHover={{
                scale: 1.03,
                y: -2,
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
              style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
            >
              <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center mr-3">
                <Sun className="w-5 h-5 text-amber-400 drop-shadow" />
              </div>
              <div>
                <div className="text-xs text-white/80">Chỉ số UV</div>
                <div
                  className={`text-sm font-medium ${getUVIndexColor(
                    weatherData.uv_index
                  )}`}
                >
                  {weatherData.uv_index !== undefined
                    ? weatherData.uv_index.toFixed(1)
                    : "N/A"}
                </div>
              </div>
            </motion.div>

            {/* Pressure or Visibility (whichever is available) */}
            <motion.div
              className="flex items-center  /15 p-3 rounded-xl border border-white/15 hover: /20 transition-colors backdrop-blur-sm h-full"
              whileHover={{
                scale: 1.03,
                y: -2,
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
              style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
            >
              {weatherData.pressure !== undefined ? (
                <>
                  <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center mr-3">
                    <Gauge className="w-5 h-5 text-teal-200 drop-shadow" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Áp suất</div>
                    <div className="text-sm font-medium text-white">
                      {Math.round(weatherData.pressure)} hPa
                    </div>
                  </div>
                </>
              ) : weatherData.visibility !== undefined ? (
                <>
                  <div className="w-10 h-10 bg-sky-500/20 rounded-full flex items-center justify-center mr-3">
                    <Eye className="w-5 h-5 text-sky-200 drop-shadow" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Tầm nhìn</div>
                    <div className="text-sm font-medium text-white">
                      {weatherData.visibility.toFixed(1)} km
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-sky-500/20 rounded-full flex items-center justify-center mr-3">
                    <Umbrella className="w-5 h-5 text-sky-300 drop-shadow" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Lượng mưa</div>
                    <div className="text-sm font-medium text-white">
                      {weatherData.precipitation !== undefined
                        ? `${weatherData.precipitation.toFixed(1)} mm`
                        : "0 mm"}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Expanded additional metrics appear in a consistent layout */}
          {expanded && (
            <div className="grid grid-cols-2 gap-2 w-full mb-4">
              {/* Show whichever metrics weren't shown in the main 4 cards */}
              {weatherData.visibility !== undefined &&
                weatherData.pressure !== undefined && (
                  <motion.div
                    className="flex items-center  /15 p-3 rounded-xl border border-white/15 hover: /20 transition-colors backdrop-blur-sm h-full"
                    whileHover={{
                      scale: 1.03,
                      y: -2,
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                  >
                    <div className="w-10 h-10 bg-sky-500/20 rounded-full flex items-center justify-center mr-3">
                      <Eye className="w-5 h-5 text-sky-200 drop-shadow" />
                    </div>
                    <div>
                      <div className="text-xs text-white/80">Tầm nhìn</div>
                      <div className="text-sm font-medium text-white">
                        {weatherData.visibility.toFixed(1)} km
                      </div>
                    </div>
                  </motion.div>
                )}

              {weatherData.precipitation !== undefined && (
                <motion.div
                  className="flex items-center  /15 p-3 rounded-xl border border-white/15 hover: /20 transition-colors backdrop-blur-sm h-full"
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                >
                  <div className="w-10 h-10 bg-sky-500/20 rounded-full flex items-center justify-center mr-3">
                    <Umbrella className="w-5 h-5 text-sky-300 drop-shadow" />
                  </div>
                  <div>
                    <div className="text-xs text-white/80">Lượng mưa</div>
                    <div className="text-sm font-medium text-white">
                      {weatherData.precipitation.toFixed(1)} mm
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Forecast section with improved layout */}
          {weatherData.forecast && weatherData.forecast.length > 0 && (
            <div className="w-full mt-1 mb-2">
              <h3 className="text-sm font-medium text-white mb-3  /15 px-2.5 py-1 rounded-full backdrop-blur-sm inline-block shadow-sm">
                Dự báo 3 ngày tới
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {weatherData.forecast.map((day, index) => (
                  <ForecastDay key={index} forecast={day} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weather warning with consistent styling */}
      {weatherData.warning && (
        <motion.div
          className="text-sm text-center mt-2 mb-1 p-2.5 bg-red-500/20 rounded-xl text-white font-medium border border-red-500/30 backdrop-blur-sm shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          role="alert"
          aria-live="polite"
        >
          ⚠️ {weatherData.warning}
        </motion.div>
      )}

      {/* Expand button with more consistent styling */}
      <motion.button
        className="text-sm text-white/90 hover:text-white mt-2 flex items-center justify-center w-full transition-colors py-2  /15 rounded-full backdrop-blur-sm hover: /20 shadow-sm border border-white/5"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ y: -1, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
        whileTap={{ scale: 0.98 }}
      >
        {expanded ? (
          <>
            Ẩn bớt <ChevronUp className="w-4 h-4 ml-1" />
          </>
        ) : (
          <>
            Xem thêm <ChevronDown className="w-4 h-4 ml-1" />
          </>
        )}
      </motion.button>
      <button
        onClick={props.onClose}
        className="text-sm text-white/90 hover:text-white mt-2 flex items-center justify-center w-full transition-colors py-2  /15 rounded-full backdrop-blur-sm hover: /20 shadow-sm border border-white/5"
      >
        Đóng
      </button>
    </motion.div>
  );
};

export default WeatherWidget;
