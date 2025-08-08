import { Link } from "react-router";
import {
  Favorite,
  LocalCafe,
  Email,
  Facebook,
  GitHub,
  Star,
  Instagram,
} from "@mui/icons-material";
import { Card } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <Card sx={{ p: 2, mt: 2, borderRadius: 1 }}>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-3 flex flex-wrap justify-center md:justify-start items-center gap-2">
              <span className="text-yellow-300 tracking-wide">App Việt</span>
              <Star
                className="inline-block text-yellow-300 animate-pulse"
                sx={{ fontSize: 20 }}
              />
            </h3>
            <p className="mx-auto md:mx-0 leading-relaxed mb-4">
              App Việt dành cho người Việt
            </p>
            {/* Features list */}
            <div className="mt-3">
              <div className="flex justify-center md:justify-start flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/80 text-white backdrop-blur-sm shadow-sm hover:bg-indigo-800/80 transition-colors">
                  Realtime
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/80 text-white backdrop-blur-sm shadow-sm hover:bg-purple-800/80 transition-colors">
                  Dễ sử dụng
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-900/80 text-white backdrop-blur-sm shadow-sm hover:bg-pink-800/80 transition-colors">
                  Miễn phí
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-900/80 text-white backdrop-blur-sm shadow-sm hover:bg-teal-800/80 transition-colors">
                  Cập nhật liên tục
                </span>
              </div>
            </div>
          </div>
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-yellow-200">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group"
                >
                  <span className="h-0.5 w-0 group-hover:w-3 bg-yellow-300 transition-all duration-300"></span>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="text-white/80 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group"
                >
                  <span className="h-0.5 w-0 group-hover:w-3 bg-yellow-300 transition-all duration-300"></span>
                  Tính năng
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/80 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group"
                >
                  <span className="h-0.5 w-0 group-hover:w-3 bg-yellow-300 transition-all duration-300"></span>
                  Liên hệ
                </Link>
              </li>
              <li>
                <div
                  onClick={() =>
                    typeof window !== "undefined" &&
                    window.open(
                      "momo://?action=transfer&receiver=0969872363",
                      "_blank"
                    )
                  }
                  className="text-white/80 cursor-pointer hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 group"
                >
                  <span className="h-0.5 w-0 group-hover:w-3 bg-yellow-300 transition-all duration-300"></span>
                  Ủng hộ
                </div>
              </li>
            </ul>
          </div>

          {/* Social links and donate button */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-lg font-semibold mb-4 text-yellow-200">
              Kết nối với chúng tôi
            </h4>
            {/* Social links */}
            <div className="flex space-x-4 mb-6">
              <a
                href="https://github.com/ngoanhvu93"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center"
                aria-label="Github"
              >
                <div className="absolute inset-0  /10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <GitHub
                  sx={{ fontSize: 22 }}
                  className="text-white group-hover:text-yellow-300 transition-colors duration-300"
                />
              </a>
              <a
                href="https://www.facebook.com/vungocoder/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center"
                aria-label="Facebook"
              >
                <div className="absolute inset-0  /10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <Facebook
                  sx={{ fontSize: 22 }}
                  className="text-white group-hover:text-blue-300 transition-colors duration-300"
                />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center"
                aria-label="Instagram"
              >
                <div className="absolute inset-0  /10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <Instagram
                  sx={{ fontSize: 22 }}
                  className="text-white group-hover:text-pink-300 transition-colors duration-300"
                />
              </a>
              <a
                href="mailto:ngoanhvu110293@gmail.com"
                className="group relative w-10 h-10 flex items-center justify-center"
                aria-label="Email"
              >
                <div className="absolute inset-0  /10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <Email
                  sx={{ fontSize: 22 }}
                  className="text-white group-hover:text-green-300 transition-colors duration-300"
                />
              </a>
            </div>

            {/* Donate button */}
            <div
              onClick={() =>
                typeof window !== "undefined" &&
                window.open(
                  "momo://?action=transfer&receiver=0969872363",
                  "_blank"
                )
              }
              className="group relative overflow-hidden flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 rounded-full font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <span className="absolute top-0 left-0 w-full h-full   opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <LocalCafe sx={{ fontSize: 18 }} className="mr-2" />
              <span className="font-semibold">Ủng hộ dự án</span>
              <Favorite sx={{ fontSize: 16 }} className="ml-2 text-red-500" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/70 text-sm mb-1 sm:mb-0 text-center sm:text-left">
              © {currentYear}{" "}
              <span className="font-medium text-white">App Việt</span>. Đã đăng
              ký bản quyền.
            </p>
            <p className="text-white/70 text-sm flex items-center">
              Nhà sáng lập
              <Favorite
                sx={{ fontSize: 14 }}
                className="mx-1 text-red-300 animate-pulse"
              />{" "}
              <span
                onClick={() =>
                  typeof window !== "undefined" &&
                  window.open("https://vu93.vercel.app", "_blank")
                }
                className="font-semibold ml-1 text-yellow-300 hover:text-yellow-200 transition-colors"
              >
                Ngô Anh Vũ
              </span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Footer;
