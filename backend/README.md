# Thực thi backend

## Yêu cầu hệ thống

- Python 3.8+

---

## Cách chạy backend FASTAPI

### 1. Vào thư mục backend
```bash
cd backend
```

### 2. (Khuyến nghị) Tạo virtual environment (hoặc sài acoda ....)
```bash
python3 -m venv venv
source venv/bin/activate  # Trên Linux/macOS
# .\venv\Scripts\activate  # Trên Windows

```

### 3. Cài đặt thư viện phụ thuộc
```bash
pip install -r requirements.txt
```

### 4. Chạy ứng dụng FASTAPI
```bash
uvicorn app.main:app --reload
```

Mặc định FASTAPI chạy tại địa chỉ 
```bash
http://127.0.0.1:8000/
```

### Lưu ý setup .env
```bash
DATABASE_URL=sqlite:///./data.db
SECRET_KEY= # using jwt

# Cách lấy xem bên dưới
CLOUDINARY_CLOUD_NAME= 
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

AES_KEY = abcabcbcabcabcaa
# AES_KEY = my-secret-key-16
HENON_X0=0
HENON_Y0=0
HENON_A=1.4
HENON_B=0.3User
```

### Lấy key cho Cloudinary

Vào đường dẫn 
```bash
https://console.cloudinary.com
```

Đăng nhập vào

Tại mục home có phần Cloud name dùng cho CLOUDINARY_CLOUD_NAME

Vào phần setting

Vào phần API Key dùng cho CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET

### TEST API 
```bash
curl -X POST "http://127.0.0.1:8000/auth/register" -H "Content-Type: application/json" -d '{"username":"khai123","password":"123123123"}'

curl -X POST "http://127.0.0.1:8000/auth/login" -H "Content-Type: application/json" -d '{"username":"khai123","password":"123123123"}'
```

