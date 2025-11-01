import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import type { RegisterType } from "../types/authType";

export default function Register() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự")
      .required("Vui lòng nhập tên đăng nhập"),
    password: Yup.string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .required("Vui lòng nhập mật khẩu"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  });

  const handleSubmit = async (
    values: RegisterType,
    { setSubmitting, setStatus }: FormikHelpers<RegisterType>
  ) => {
    try {
      await axios.post("http://127.0.0.1:8000/auth/register", {
        username: values.username,
        password: values.password,
      });
      setStatus({ success: true });
      alert("Đăng ký tài khoản thành công")
      navigate("/login");
    } catch (err) {
      console.log(err);
      setStatus({ error: "Tên đăng nhập đã tồn tại hoặc có lỗi xảy ra" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Đăng ký tài khoản
        </h2>

        <Formik<RegisterType>
          initialValues={{ username: "", password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form>
              {status?.error && (
                <p className="text-red-500 text-center mb-3">{status.error}</p>
              )}
              {status?.success && (
                <p className="text-green-500 text-center mb-3">
                  Đăng ký thành công 🎉
                </p>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
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

              <div className="mb-4">
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

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
              </button>

              <p className="text-center text-gray-600 mt-4">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
