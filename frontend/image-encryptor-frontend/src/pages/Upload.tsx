import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encryptedImages, setEncryptedImages] = useState<
    { id: number; filename: string; url: string }[]
  >([]);
  const [imageList, setImageList] = useState<
    { id: number; filename: string; image_base64: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchImages = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://127.0.0.1:8000/image/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImageList(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách ảnh:", err);
    }
  };

  const fetchEncryptedImages = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://127.0.0.1:8000/image/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEncryptedImages(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách ảnh:", err);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchEncryptedImages();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Vui lòng chọn một file để upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setMessage(null);

      await axios.post("http://127.0.0.1:8000/image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Upload thành công!");
      setSelectedFile(null);
      await fetchImages();
      await fetchEncryptedImages();
    } catch (err) {
      console.error(err);
      setMessage("Upload thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-10">
        {/* upload form */}
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md text-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full border border-gray-300 rounded-lg p-2 mb-4"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Đang upload..." : "Tải lên"}
          </button>
          {message && <p className="mt-3 text-gray-700">{message}</p>}
        </div>

        {/* Ảnh mã hóa */}
        <section className="mt-10">
          <h3 className="text-2xl font-medium text-gray-800 mb-4 text-center">
            Ảnh mã hoá
          </h3>
          {encryptedImages.length === 0 ? (
            <p className="text-center text-gray-500">Chưa có ảnh nào.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {encryptedImages.map((img) => (
                <div
                  key={img.id}
                  className="rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                  onClick={() => setSelectedImage(img.url)} 
                >
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="w-full h-48 object-cover cursor-pointer"
                  />
                  {/* <p className="text-center py-2 text-sm text-gray-700">
                    {img.filename}
                  </p> */}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Ảnh giải mã */}
        <section className="mt-10">
          <h3 className="text-2xl font-medium text-gray-800 mb-4 text-center">
            Ảnh gốc đã giải mã
          </h3>
          {imageList.length === 0 ? (
            <p className="text-center text-gray-500">Chưa có ảnh nào.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imageList.map((img) => (
                <div
                  key={img.id}
                  className="rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                  onClick={() => setSelectedImage(img.image_base64)} 
                >
                  <img
                    src={img.image_base64}
                    alt={img.filename}
                    className="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal hiển thị ảnh lớn */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-1 hover:bg-opacity-100 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
