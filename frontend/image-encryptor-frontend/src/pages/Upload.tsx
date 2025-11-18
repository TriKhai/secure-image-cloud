import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../component/LoadingSpinner";
import ImageUploadModal from "../component/ImageUploadModal";

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Ảnh mã hoá (từ /image/list)
  const [encryptedImages, setEncryptedImages] = useState<
    { id: number; filename: string; url: string }[]
  >([]);

  // Ảnh đã giải mã (từ /image/get-all)
  const [imageList, setImageList] = useState<
    { id: number; filename: string; image_base64: string }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Các id ảnh đang được chọn để xoá
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("Vui lòng đăng nhập!");
      navigate("/");
    }
  }, [token, navigate]);

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

  // toggle chọn/bỏ chọn 1 ảnh
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // chọn / bỏ chọn tất cả (dựa trên imageList – ảnh giải mã)
  const isAllSelected =
    imageList.length > 0 && selectedIds.length === imageList.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(imageList.map((img) => img.id));
    }
  };

  // xoá 1 ảnh
  // const handleDeleteOne = async (id: number) => {
  //   if (!token) return;
  //   if (!confirm("Bạn có chắc muốn xoá ảnh này?")) return;

  //   try {
  //     await axios.delete(`http://127.0.0.1:8000/image/delete/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     setImageList((prev) => prev.filter((img) => img.id !== id));
  //     setEncryptedImages((prev) => prev.filter((img) => img.id !== id));
  //     setSelectedIds((prev) => prev.filter((x) => x !== id));
  //   } catch (err) {
  //     console.error("Lỗi xoá ảnh:", err);
  //     alert("Xoá thất bại!");
  //   }
  // };

  // xoá các ảnh đã chọn
  const handleDeleteSelected = async () => {
    if (!token) return;
    if (selectedIds.length === 0) return;
    if (!confirm(`Xoá ${selectedIds.length} ảnh đã chọn?`)) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://127.0.0.1:8000/image/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      setImageList((prev) =>
        prev.filter((img) => !selectedIds.includes(img.id))
      );
      setEncryptedImages((prev) =>
        prev.filter((img) => !selectedIds.includes(img.id))
      );
      setSelectedIds([]);
    } catch (err) {
      console.error("Lỗi xoá nhiều ảnh:", err);
      alert("Xoá thất bại!");
    }
  };

  // xoá tất cả ảnh (backend /delete-all)
  const handleDeleteAll = async () => {
    if (!token) return;
    if (!confirm("Bạn có chắc muốn xoá TẤT CẢ ảnh?")) return;

    try {
      await axios.delete("http://127.0.0.1:8000/image/delete-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setImageList([]);
      setEncryptedImages([]);
      setSelectedIds([]);
    } catch (err) {
      console.error("Lỗi xoá tất cả ảnh:", err);
      alert("Xoá tất cả thất bại!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {loading && <LoadingSpinner />}

      <Navbar />

      <main className="grow container mx-auto px-4 py-10">
        {/* Action bar + Ảnh giải mã */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <h3 className="text-2xl font-medium text-gray-800">
                Ảnh của bạn
              </h3>
              <div className="w-[68px] mx-auto text-center">
                <ImageUploadModal
                  token={token}
                  onUploaded={async () => {
                    await fetchImages();
                    await fetchEncryptedImages();
                  }}
                />
              </div>
            </div>

            {imageList.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                  <span>Chọn tất cả</span>
                </label>

                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.length === 0}
                  className={`px-3 py-1 rounded text-white ${
                    selectedIds.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Xoá đã chọn ({selectedIds.length})
                </button>

                <button
                  onClick={handleDeleteAll}
                  className="px-3 py-1 rounded text-white bg-red-700 hover:bg-red-800"
                >
                  Xoá tất cả
                </button>
              </div>
            )}
          </div>

          {imageList.length === 0 ? (
            <p className="text-center text-gray-500">Chưa có ảnh nào.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imageList.map((img) => {
                const checked = selectedIds.includes(img.id);
                return (
                  <div
                    key={img.id}
                    className={`rounded-lg overflow-hidden shadow hover:shadow-lg transition relative cursor-pointer ${
                      checked ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedImage(img.image_base64)}
                  >
                    {/* checkbox góc trên bên trái */}
                    <div
                      className="absolute top-2 left-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(img.id);
                      }}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer 
                          ${
                            checked
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-400 bg-white"
                          }
                        `}
                      >
                        {checked && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>

                    <img
                      src={img.image_base64}
                      alt={img.filename}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                );
              })}
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
