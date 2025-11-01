import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-600 hover:text-blue-700"
        >
          SecureImageCloud
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/"
            className={`${
              isActive("/") ? "text-blue-600 font-semibold" : "text-gray-700"
            } hover:text-blue-600 transition`}
          >
            Trang chủ
          </Link>
          <Link
            to="/about"
            className={`${
              isActive("/about") ? "text-blue-600 font-semibold" : "text-gray-700"
            } hover:text-blue-600 transition`}
          >
            Giới thiệu
          </Link>
          <Link
            to="/upload"
            className={`${
              isActive("/upload") ? "text-blue-600 font-semibold" : "text-gray-700"
            } hover:text-blue-600 transition`}
          >
            Images
          </Link>
          <Link
            to="/contact"
            className={`${
              isActive("/contact")
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            } hover:text-blue-600 transition`}
          >
            Liên hệ
          </Link>

          {isLoggedIn ? (
            <>
              <span className="text-gray-700">Xin chào, {username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${
                  isActive("/login")
                    ? "bg-blue-700 text-white"
                    : "bg-blue-600 text-white"
                } px-4 py-2 rounded-lg hover:bg-blue-700 transition`}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className={`${
                  isActive("/register")
                    ? "bg-blue-600 text-white"
                    : "border border-blue-600 text-blue-600"
                } px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition`}
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Menu Mobile Toggle */}
        <button
          className="md:hidden text-gray-700 focus:outline-none text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200">
          {[
            { to: "/", label: "Trang chủ" },
            { to: "/about", label: "Giới thiệu" },
            { to: "/contact", label: "Liên hệ" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-4 py-2 ${
                isActive(item.to)
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <>
              <p className="px-4 py-2 text-gray-700">Xin chào, {username}</p>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 bg-red-500 text-white hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`block px-4 py-2 ${
                  isActive("/login")
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className={`block px-4 py-2 ${
                  isActive("/register")
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
