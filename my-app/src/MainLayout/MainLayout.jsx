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

  const LOGOUT_AFTER = 30 * 60 * 1000; // 30 นาที
  const [timeLeft, setTimeLeft] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!user || !apiKey) {
      navigate("/login");
      return;
    }

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

    updateTime();
    intervalRef.current = setInterval(updateTime, 1000);

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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-sky-50 relative">
      <Navbar />

      {/* Countdown Logout */}
      <div className="fixed top-16 right-6 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl px-4 py-2 flex items-center gap-3 z-50 border border-gray-200">
        <span className="material-icons text-blue-500">schedule</span>
        <span className="text-gray-700 text-sm font-medium">
          Logout ในอีก {formatTime(timeLeft)}
        </span>
        <div
          className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden"
          title="Progress"
        >
          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-500"
            style={{
              width: `${((30 * 60 - timeLeft) / (30 * 60)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="pt-20 px-6 pb-10 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
