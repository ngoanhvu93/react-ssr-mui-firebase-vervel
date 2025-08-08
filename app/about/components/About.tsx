import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Book, Flag, Heart, Users } from "lucide-react";
import { TopAppBar } from "~/components/TopAppBar";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import { BottomAppBar } from "~/components/BottomAppBar";

const About = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Vì Cộng Đồng",
      description:
        "Ứng dụng được xây dựng với tâm huyết mang đến trải nghiệm tốt nhất cho người Việt.",
      icon: (
        <Users
          className={cn("w-6 h-6 md:w-8 md:h-8 text-blue-600", {
            "text-white": activeFeature === 0,
          })}
        />
      ),
      color: "from-blue-600 to-cyan-400",
    },
    {
      title: "Văn Hóa Việt",
      description:
        "Kết nối và lan tỏa những giá trị văn hóa Việt Nam truyền thống tới thế hệ mới.",
      icon: (
        <Flag
          className={cn("w-6 h-6 md:w-8 md:h-8 text-red-600", {
            "text-white": activeFeature === 1,
          })}
        />
      ),
      color: "from-red-600 to-amber-400",
    },
    {
      title: "Thiết Kế Tinh Tế",
      description:
        "Giao diện được thiết kế tỉ mỉ, tối ưu trải nghiệm người dùng trên mọi thiết bị.",
      icon: (
        <Heart
          className={cn("w-6 h-6 md:w-8 md:h-8 text-pink-600", {
            "text-white": activeFeature === 2,
          })}
        />
      ),
      color: "from-pink-600 to-purple-400",
    },
    {
      title: "Hướng Dẫn Chi Tiết",
      description:
        "Hệ thống hướng dẫn đầy đủ, giúp người dùng dễ dàng làm quen với các tính năng.",
      icon: (
        <Book
          className={cn("w-6 h-6 md:w-8 md:h-8 text-emerald-600", {
            "text-white": activeFeature === 3,
          })}
        />
      ),
      color: "from-emerald-600 to-teal-400",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col mx-auto max-w-4xl">
      <TopAppBar onBack={() => navigate("/donate")} title="Về Chúng Tôi" />

      <div className="flex flex-col items-center p-4 w-full mx-auto bg-gray-50">
        <div className="w-full text-center mb-8 md:mb-10 pt-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 animate-gradient mb-3 md:mb-4">
            Chào Mừng Bạn
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Ứng dụng Việt - được tạo ra bởi người Việt, vì người Việt và cho
            người Việt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className=" /50 backdrop-blur-md rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100"
          >
            <div className="mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Tính Năng Nổi Bật
              </h2>
              <div className="h-1 w-16 md:w-20 bg-blue-500 rounded-full mt-2"></div>
            </div>

            <div className="space-y-4 md:space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-3 md:p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                    activeFeature === index
                      ? `bg-gradient-to-r ${feature.color} text-white shadow-md`
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start">
                    <div
                      className={`p-2 rounded-lg ${
                        activeFeature !== index ? " " : ""
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div className="ml-3 md:ml-4">
                      <h3
                        className={`font-semibold text-base md:text-lg ${
                          activeFeature !== index ? "text-gray-800" : ""
                        }`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`text-sm md:text-base ${
                          activeFeature !== index
                            ? "text-gray-600"
                            : "text-white/90"
                        }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col space-y-4 md:space-y-6"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 md:p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32  /10 rounded-full -mt-6 -mr-6 md:-mt-10 md:-mr-10"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16  /10 rounded-full -mb-2 -ml-2 md:-mb-4 md:-ml-4"></div>

              <h2 className="text-xl md:text-2xl font-bold relative z-10 mb-3 md:mb-4">
                Tầm Nhìn Của Chúng Tôi
              </h2>
              <p className="relative z-10 mb-3 md:mb-4 text-sm md:text-base text-white/90">
                Xây dựng một ứng dụng Việt Nam chất lượng, đáp ứng mọi nhu cầu
                của người dùng, kết hợp công nghệ hiện đại với văn hóa truyền
                thống.
              </p>
              <p className="relative z-10 text-sm md:text-base text-white/90">
                Chúng tôi luôn lắng nghe ý kiến đóng góp để không ngừng cải tiến
                và hoàn thiện.
              </p>
            </div>

            <motion.div
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 md:p-6 rounded-2xl shadow-xl relative overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24  /10 rounded-full -mt-4 -ml-4 md:-mt-6 md:-ml-6"></div>

              <h2 className="text-xl md:text-2xl font-bold relative z-10 mb-3 md:mb-4">
                Khám Phá Ngay
              </h2>
              <p className="relative z-10 mb-4 md:mb-6 text-sm md:text-base text-white/90">
                Bắt đầu hành trình trải nghiệm ứng dụng với các tính năng độc
                đáo và thú vị
              </p>

              <motion.button
                className="flex items-center   text-orange-500 font-medium py-2 px-4 rounded-full shadow-md relative z-10 text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
              >
                Khám phá ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <BottomAppBar />
    </div>
  );
};

export default About;
