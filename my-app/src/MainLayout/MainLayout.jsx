import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import { Outlet, useNavigate } from "react-router-dom";

/**
 * MainLayout - Layout หลักของระบบ
 * - แสดง Navbar
 * - นับถอยหลัง logout อัตโนมัติ
 * - รีเซ็ตเวลา logout เมื่อมี user interaction
 * - แสดงหน้า child component ผ่าน <Outlet />
 * - แจ้ง popup เมื่อ session หมดอายุ
 */
export default function MainLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const apiKey = localStorage.getItem("api_key");

  const LOGOUT_AFTER = 30 * 60 * 1000; // 2 นาทีตัวอย่าง
  const [timeLeft, setTimeLeft] = useState(0);

  const intervalRef = useRef(null); // เก็บ interval เพื่อ clear ปลอดภัย

  useEffect(() => {
    if (!user || !apiKey) {
      navigate("/login");
      return;
    }

    // สร้าง logoutTime แค่ครั้งแรก (ไม่รีเซ็ตเมื่อ F5)
    if (!localStorage.getItem("logoutTime")) {
      localStorage.setItem(
        "logoutTime",
        (new Date().getTime() + LOGOUT_AFTER).toString()
      );
    }

    const updateTime = () => {
      const logoutTime = parseInt(localStorage.getItem("logoutTime") || "0");
      const now = new Date().getTime();
      const remaining = Math.max(Math.floor((logoutTime - now) / 1000), 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        if (window.confirm("Session ของคุณหมดอายุ กรุณา login ใหม่")) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    updateTime(); // เรียกครั้งแรกทันที
    intervalRef.current = setInterval(updateTime, 1000);

    // ฟังก์ชัน reset logoutTime เมื่อ user interaction
    const resetTimer = () => {
      const newLogoutTime = new Date().getTime() + LOGOUT_AFTER;
      localStorage.setItem("logoutTime", newLogoutTime.toString());
    };

    const events = ["click", "keydown", "scroll", "mousemove"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      clearInterval(intervalRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [user, apiKey, navigate]);

  // แปลงวินาที → mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Navbar />

      {/* Countdown Logout */}
      <div>
        ⏰ Logout in: {formatTime(timeLeft)}
      </div>

      {/* Main content */}
      <main className="pt-20 px-6 pb-10 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
