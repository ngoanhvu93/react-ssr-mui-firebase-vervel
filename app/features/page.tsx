import {
  Trophy,
  Users,
  MessageSquare,
  Gamepad2,
  Share2,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Heart,
  Target,
  BarChart3,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router";

const FeaturesPage = () => {
  const features = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Giải đấu vòng tròn",
      description:
        "Tạo và quản lý giải đấu vòng tròn chuyên nghiệp với hệ thống tính điểm tự động và thống kê chi tiết.",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Lô Tô Online",
      description:
        "Chơi lô tô trực tuyến với bạn bè, hỗ trợ nhiều người chơi cùng lúc và chat real-time.",
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      link: "/lotto",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Chat Real-time",
      description:
        "Hệ thống chat thông minh với emoji, file sharing, mentions và notifications.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Quản lý đội bóng",
      description:
        "Thêm, chỉnh sửa và quản lý thông tin đội bóng một cách dễ dàng và hiệu quả.",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      link: "/lotto",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Thống kê chi tiết",
      description:
        "Xem thống kê trận đấu, bảng xếp hạng và form của từng đội bóng.",
      color: "from-indigo-400 to-purple-500",
      bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Chia sẻ dễ dàng",
      description:
        "Chia sẻ giải đấu và phòng chơi với bạn bè thông qua link hoặc QR code.",
      color: "from-red-400 to-pink-500",
      bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
    },
  ];

  const highlights = [
    "Giao diện hiện đại và thân thiện",
    "Hoạt động offline và online",
    "Đồng bộ real-time",
    "Không cần đăng ký tài khoản",
    "Hỗ trợ đa thiết bị",
    "Tính năng chat nâng cao",
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="relative overflow-hidden   shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Tính năng nổi bật
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Khám phá những tính năng tuyệt vời giúp App Việt trở thành ứng
              dụng giải trí và quản lý giải đấu hàng đầu
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative   rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              onClick={() => {
                if (feature.link) {
                  navigate(feature.link);
                }
              }}
            >
              <div
                className={`absolute inset-0 ${feature.bgColor} opacity-50`}
              ></div>
              <div className="relative p-8">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6 shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                  <span>Khám phá ngay</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights Section */}
      <div className="  py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn Winner?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những lý do khiến Winner trở thành lựa chọn hàng đầu cho giải trí
              và quản lý giải đấu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
              >
                <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Giải đấu đã tạo</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Người dùng</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Hỗ trợ</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="  py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Tham gia ngay để trải nghiệm những tính năng tuyệt vời của Winner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Bắt đầu ngay
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4">App Việt</h3>
          <p className="text-gray-400 mb-6">
            Ứng dụng giải trí và quản lý giải đấu hàng đầu
          </p>
          <div className="flex justify-center space-x-6">
            <div className="flex items-center text-gray-400">
              <Zap className="w-4 h-4 mr-2" />
              <span>Nhanh chóng</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Shield className="w-4 h-4 mr-2" />
              <span>An toàn</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Users className="w-4 h-4 mr-2" />
              <span>Cộng đồng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
