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
      user &&
      user.roles &&
      user.roles.some((role) => role.name === "admin");

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
    return <p>กำลังโหลดข้อมูลสวนสัตว์...</p>;

  if (error)
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p className="text-red-600 font-semibold">
          เกิดข้อผิดพลาด: {error}
        </p>
        <p>ลองรีเฟรชหน้าหรือแจ้งผู้ดูแลระบบ</p>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-right">
        Admin Dashboard
      </h1>

      <p className="mb-4 text-right">
        ยินดีต้อนรับ: {user.user_profile.first_name} {user.user_profile.last_name}
        <br />
        {user.roles && user.roles.length > 0 && (
          <span>ตำแหน่ง: {user.roles[0].name}</span>
        )}
      </p>

      <h2 className="text-xl font-semibold mb-4">สวนสัตว์ทั้งหมด</h2>

      {zoos.length === 0 ? (
        <p>ยังไม่มีข้อมูลสวนสัตว์</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {zoos.map((zoo) => (
            <Link key={zoo.id} to={`/zoo/${zoo.id}`}>
              <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {zoo.name}
                </h3>
                <p className="text-gray-600 mb-1">
                  Code: <span className="font-medium">{zoo.code || "ไม่มีข้อมูล"}</span>
                </p>
                <p className="text-gray-600">
                  {zoo.detail || "ไม่มีข้อมูล"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
