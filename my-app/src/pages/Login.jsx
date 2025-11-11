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
        setMessage(data.message || "เกิดข้อผิดพลาด");
        return;
      }

      localStorage.setItem("api_key", data.api_key);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Login สำเร็จ!");
      navigate("/dashboard");
    } catch (err) {
      setMessage("เกิดข้อผิดพลาด: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">อีเมล</label>
            <input
              type="email"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
  );
}
