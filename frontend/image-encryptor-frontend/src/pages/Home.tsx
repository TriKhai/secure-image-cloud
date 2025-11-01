import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Nội dung chính */}
      <main className="flex-grow">
        <section className="max-w-5xl mx-auto py-16 px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Chào mừng đến với <span className="text-blue-600">SecureImageCloud</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Đây là nền tảng chia sẻ và lưu trữ hình ảnh đơn giản.  
            Bạn có thể dễ dàng đăng ký tài khoản, tải ảnh của mình lên,  
            và chia sẻ chúng với mọi người.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Bắt đầu ngay
            </Link>
            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition"
            >
              Đăng nhập
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-12 px-6 text-center bg-white shadow-sm rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Tính năng nổi bật
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-gray-600">
            <div>
              <h3 className="text-xl font-medium text-blue-600 mb-2">
                Upload ảnh
              </h3>
              <p>Dễ dàng tải lên và quản lý hình ảnh của bạn.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-blue-600 mb-2">
                Bảo mật
              </h3>
              <p>Tài khoản và ảnh của bạn được bảo vệ an toàn.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-blue-600 mb-2">
                Chia sẻ cộng đồng
              </h3>
              <p>Khám phá những bức ảnh đẹp từ người dùng khác.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
