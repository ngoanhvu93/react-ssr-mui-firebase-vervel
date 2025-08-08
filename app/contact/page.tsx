import { motion } from "framer-motion";
import { Linkedin, Mail, Send, Twitter } from "lucide-react";
import { Github } from "lucide-react";
import { TopAppBar } from "~/components/TopAppBar";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { CustomButton } from "~/components/CustomButton";
import { BottomAppBar } from "~/components/BottomAppBar";

type FormInputs = {
  name: string;
  email: string;
  message: string;
};

const Contact = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    reset();
  };

  return (
    <div className="w-full flex flex-col mx-auto max-w-4xl">
      <TopAppBar onBack={() => navigate("/donate")} title="Liên Hệ" />
      <div className="flex flex-col items-center p-4 w-full mx-auto bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text w-full">
            Hãy cùng nhau tạo ra điều tuyệt vời
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className=" /80 backdrop-blur-sm border border-purple-100 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold mb-6 text-purple-800">
                Thông Tin Liên Hệ
              </h2>
              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-4 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <Mail className="text-pink-500 text-xl" />
                  <span className="text-gray-700">
                    ngoanhvu110293@gmail.com
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <Github className="text-purple-500 text-xl" />
                  <span className="text-gray-700">
                    github.com/ngoanhvu110293
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <Linkedin className="text-blue-500 text-xl" />
                  <span className="text-gray-700">
                    linkedin.com/in/ngoanhvu110293
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <Twitter className="text-sky-500 text-xl" />
                  <span className="text-gray-700">
                    twitter.com/ngoanhvu110293
                  </span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className=" /80 backdrop-blur-sm border border-purple-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold mb-6 text-purple-800">
                Theo Dõi Chúng Tôi
              </h2>
              <div className="flex space-x-6">
                <motion.a
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="text-2xl text-gray-600 hover:text-pink-500 transition-colors"
                >
                  <Github />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="text-2xl text-gray-600 hover:text-purple-500 transition-colors"
                >
                  <Linkedin />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="text-2xl text-gray-600 hover:text-sky-500 transition-colors"
                >
                  <Twitter />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className=" /80 backdrop-blur-sm border border-purple-100 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4 text-purple-800">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Tên
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: "Vui lòng nhập tên" })}
                  className="w-full px-4 py-3 rounded-lg   border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  placeholder="Tên của bạn"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Vui lòng nhập email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg   border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                  placeholder="Email của bạn"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Tin Nhắn
                </label>
                <textarea
                  id="message"
                  {...register("message", {
                    required: "Vui lòng nhập tin nhắn",
                    minLength: {
                      value: 10,
                      message: "Tin nhắn phải có ít nhất 10 ký tự",
                    },
                  })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg   border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all resize-none"
                  placeholder="Nhập tin nhắn..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CustomButton
                  icon={<Send />}
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi Tin Nhắn"}
                </CustomButton>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
      <BottomAppBar />
    </div>
  );
};

export default Contact;
