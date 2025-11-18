import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import homeImg from "../assets/home.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faCloudArrowUp,
  faShieldHalved,
  faGlobe,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-black flex flex-col">
      <Navbar />

      <main className="grow">
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-left">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-black bg-gray-50 px-3 py-1 rounded-full mb-4">
              <FontAwesomeIcon icon={faLock} className="" />
              <span>BẢO MẬT HÌNH ẢNH BẰNG MÃ HOÁ</span>
            </p>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Lưu trữ & bảo vệ hình ảnh với{" "}
              <span className="text-gray-400">SecureImageCloud</span>
            </h1>

            <p className="text-black text-base md:text-lg mb-6 leading-relaxed">
              Mọi bức ảnh đều được mã hoá trước khi đưa lên cloud.
              Chỉ có bạn mới giải mã và xem được nội dung gốc.
              Đơn giản như upload ảnh bình thường, nhưng an toàn hơn rất nhiều.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center bg-black hover:bg-white hover:text-black text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition"
              >
                Bắt đầu ngay
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center border border-slate-500 text-gray-600 px-6 py-3 rounded-xl hover:bg-slate-800/70 hover:text-white transition"
              >
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-emerald-400"
                />
                <span>Mã hoá AES + hỗn loạn Henon</span>
              </span>
              <span className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faShieldHalved}
                  className="text-emerald-400"
                />
                <span>Không chia sẻ dữ liệu cho bên thứ ba</span>
              </span>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-blue-500/20 rounded-3xl blur-2xl opacity-40" />
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
                <img
                  src={homeImg}
                  alt="SecureImageCloud preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6">
          <div className="bg-gray-50 rounded-3xl px-8 md:p-10 border border-gray-300">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-6 text-center">
              Vì sao nên dùng{" "}
              <span className="text-black">SecureImageCloud</span>?
            </h2>

            <div className="grid md:grid-cols-3 gap-6 text-sm md:text-base">
              <div className="bg-white  border border-gray-300 rounded-2xl p-5 text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-3">
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className="text-emerald-400"
                  />
                </div>
                <h3 className="text-lg font-medium text-black mb-1">
                  Upload & quản lý dễ dàng
                </h3>
                <p className="text-black text-sm">
                  Giao diện đơn giản, trực quan. Chỉ cần chọn ảnh và tải lên.
                  Hệ thống tự động mã hoá và lưu trữ trên cloud.
                </p>
              </div>

              <div className="bg-white border border-gray-300 rounded-2xl p-5 text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-3">
                  <FontAwesomeIcon
                    icon={faShieldHalved}
                    className="text-emerald-400"
                  />
                </div>
                <h3 className="text-lg font-medium text-black mb-1">
                  Bảo mật chuyên sâu
                </h3>
                <p className="text-black text-sm">
                  Ảnh được mã hoá trước khi lưu trữ, tăng độ an toàn so với
                  lưu trữ thông thường.
                </p>
              </div>

              <div className="bg-white  border border-gray-300 rounded-2xl p-5 text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-3">
                  <FontAwesomeIcon icon={faGlobe} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-medium text-black mb-1">
                  Truy cập mọi lúc, mọi nơi
                </h3>
                <p className="text-black text-sm">
                  Ảnh đã mã hoá được lưu trên cloud. Bạn có thể đăng nhập và
                  giải mã để xem lại ở bất kỳ đâu.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
