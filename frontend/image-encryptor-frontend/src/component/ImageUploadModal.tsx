import { useState } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  token: string | null;
  uploadUrl?: string;               
  onUploaded?: () => void | Promise<void>;
};

export default function ImageUploadModal({
  token,
  uploadUrl = "http://127.0.0.1:8000/image/upload",
  onUploaded,
}: Props) {
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const open = () => {
    if (!token) {
      alert("Vui lòng đăng nhập trước!");
      return;
    }
    setShow(true);
  };

  const close = () => {
    setShow(false);
    setSelectedFile(null);
    setPreviewImage(null);
    setMessage(null);
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Vui lòng chọn một file để upload!");
      return;
    }
    if (!token) {
      setMessage("Thiếu token, vui lòng đăng nhập lại!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setMessage(null);

      await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Upload thành công!");
      if (onUploaded) {
        await onUploaded();
      }
      // đóng modal sau 1 chút nếu muốn
      close();
    } catch (err) {
      console.error(err);
      setMessage("Upload thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={open}
        className="w-full py-2 rounded-lg text-white bg-gray-600 hover:bg-black"
      >
        Upload
      </button>

      {/* Modal upload */}
      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl w-[90%] max-w-md shadow-xl relative">
            {loading && <LoadingSpinner />}

            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Tải ảnh lên
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="block w-full border border-gray-300 rounded-lg p-2 mb-4"
            />

            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            )}

            {message && (
              <p className="text-sm text-gray-700 mb-3">{message}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={close}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                disabled={loading}
              >
                Huỷ
              </button>

              <button
                onClick={handleUpload}
                className={`px-4 py-2 rounded-lg text-white ${
                  loading ? "bg-gray-400" : "bg-gray-600 hover:bg-black"
                }`}
                disabled={loading}
              >
                {loading ? "Đang upload..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
