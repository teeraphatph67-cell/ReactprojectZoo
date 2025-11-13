import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("กำลังเข้าสู่ระบบ...");

    try {
      const res = await fetch("https://addpay.net/api/v1/zoo/authen/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        return;
      }

      // บันทึกข้อมูลลง localStorage
      localStorage.setItem("api_key", data.api_key);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("loginTime", new Date().getTime());

      setMessage("เข้าสู่ระบบสำเร็จ!");
      navigate("/"); // ไปหน้า Hero
    } catch (err) {
      setMessage("เกิดข้อผิดพลาด: " + err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* พื้นหลังเต็มจอ */}
      <div
        className="absolute inset-0 bg-cover bg-center filter brightness-75"
        style={{
          backgroundImage:
            "url('https://scontent.fnak1-1.fna.fbcdn.net/v/t39.30808-6/557646479_827600676446691_5829593366115510155_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=X-YQUlj6AH8Q7kNvwG3z1VG&_nc_oc=AdlIdO7J9lyAkpOzY4zk5YAgPLho0YSWuhWcNJgD-hZFTqGyMSHUnI6_8eVRiq8lncI&_nc_zt=23&_nc_ht=scontent.fnak1-1.fna&_nc_gid=L8qTsRyoeePc8vMj41KLOA&oh=00_AfhIODigZmtftIqhielr0OY4WLGhCe1ltsxXD-DtcljzxQ&oe=691A1622')",
        }}
      ></div>

      {/* ชื่อระบบด้านบน */}
      <header className="relative z-10 text-center py-6">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mt-10">
          ระบบจัดการกล้องสวนสัตว์
        </h1>
      </header>

      {/* กล่อง Login */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            เข้าสู่ระบบ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">อีเมล</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-semibold transition-colors"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center ${
                message.includes("สำเร็จ") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
