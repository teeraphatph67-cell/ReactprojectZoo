import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const apiKey = localStorage.getItem("api_key");

  const [zoos, setZoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const isAdmin =
      user && user.roles && user.roles.some((role) => role.name === "admin");

    if (!user || !apiKey || !isAdmin) {
      navigate("/login");
      return;
    }

    const fetchZoos = async () => {
      try {
        const res = await fetch(
          "https://addpay.net/api/v1/zoo/e-member/all-zoo",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const msg = errorData?.message || `HTTP ${res.status}`;
          throw new Error(msg);
        }

        const data = await res.json();
        setZoos(data || []);
      } catch (err) {
        console.error("Fetch zoos error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchZoos();
  }, [user, apiKey, navigate]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
        🦓 กำลังโหลดข้อมูลสวนสัตว์...
      </div>
    );

  if (error)
    return (
      <div className="p-6 max-w-6xl mx-auto text-center">
        <p className="text-red-600 font-semibold text-xl">
          เกิดข้อผิดพลาด: {error}
        </p>
        <p className="text-gray-600 mt-2">
          โปรดลองรีเฟรชหน้าหรือแจ้งผู้ดูแลระบบ
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-sm">
          ระบบกล้องสวนสัตว์ 
        </h1>
      </div>

      {/* Zoo List */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        สวนสัตว์ทั้งหมด
      </h2>

      {zoos.length === 0 ? (
        <p className="text-gray-500 text-center">ยังไม่มีข้อมูลสวนสัตว์</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {zoos.map((zoo) => (
            <Link
              key={zoo.id}
              to={`/zoo/${zoo.id}`}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <img
                src={zoo.image || "//"}
                alt={zoo.name}
                className="w-full h-48 object-contain"
              />
              <div className="p-5 text-center">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {zoo.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  {zoo.name_en || "ไม่มีรายละเอียดเพิ่มเติม"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    
  );
}
