// 🔧 Cấu hình API URL cho từng môi trường

// ⚠️ Sửa dòng này để chuyển môi trường nhanh:
const ENV = "vercel"; // "local" | "render" | "vercel"  // ← Đổi thành "local" nếu có backend local

// 🖥️ Local backend (sử dụng Vite proxy để tránh CORS)
// Trong development, Vite sẽ tự động forward các request từ '' sang 'http://localhost:8080'
const LOCAL_API = ""; // Empty string để dùng proxy của Vite

// ☁️ Backend Render (deploy online)
const RENDER_API = "https://ev-service-center-maintance-management-um2j.onrender.com";

// 🌐 Khi frontend deploy lên Vercel
// ⚠️ Lưu ý: Để kết nối với backend local từ Vercel, bạn cần:
// 1. Sử dụng ngrok: ngrok http 8080 -> lấy URL public
// 2. Hoặc expose backend qua IP công khai
// 3. Hoặc sử dụng biến môi trường VITE_API_URL
const VERCEL_API = import.meta.env.VITE_API_URL || "http://localhost:8080"; // Thay bằng ngrok URL hoặc backend public URL

// 🧠 Chọn API_BASE theo ENV
let API_BASE;

switch (ENV) {
  case "local":
    API_BASE = LOCAL_API;
    break;
  case "vercel":
    API_BASE = VERCEL_API;
    break;
  default:
    API_BASE = RENDER_API;
}

export const CONFIG = {
  ENV,
  API_BASE,
};
