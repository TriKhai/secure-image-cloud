import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const validationSchema = Yup.object({
    username: Yup.string().required("Tên đăng nhập không được để trống"),
    password: Yup.string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .required("Vui lòng nhập mật khẩu"),
  });

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", values);
      login(res.data.access_token, values.username);
      alert("Đăng nhập thành công")
      navigate("/");
    } catch {
      alert("Sai tên đăng nhập hoặc mật khẩu");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Đăng nhập
        </h2>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tên đăng nhập</label>
                <Field
                  type="text"
                  name="username"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <ErrorMessage
                  name="username"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Mật khẩu</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
