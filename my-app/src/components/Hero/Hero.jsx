import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ✅ นำเข้ารูปภาพสวนสัตว์ทั้งหมด
import ChiangMaiZooImg from "../../assets/chiangmaizoo.png";
import KhaoKheowZooImg from "../../assets/khaokheowzoo.png";
import KhonKaenZooImg from "../../assets/khonkaenzoo.png";
import NakhonRatchasimaZooImg from "../../assets/nakhonratchasimazoo.png";
import SongkhlaZooImg from "../../assets/songkhlazoo.png";
import UbonZooImg from "../../assets/ubonratchathanizoo.png";
import logo_addpay from "../../assets/logo_addpay.webp";
import zoo_of_thailand from "../../assets/zoo-0.png";

export default function Hero() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const apiKey = localStorage.getItem("api_key");

  const [zoos, setZoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const zooImages = {
    1: KhaoKheowZooImg,
    2: ChiangMaiZooImg,
    3: NakhonRatchasimaZooImg,
    4: UbonZooImg,
    5: KhonKaenZooImg,
    6: SongkhlaZooImg,
    7: zoo_of_thailand,
    8: logo_addpay,
  };

  useEffect(() => {
    if (!user || !apiKey) {
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
          const errData = await res.json().catch(() => null);
          const msg = errData?.message || `HTTP ${res.status}`;
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

  const isAdmin = user?.roles?.some((r) => r.name === "admin");
  const userZooId = user?.user_profile?.zoo?.id;
  const filteredZoos = isAdmin
    ? zoos
    : zoos.filter((zoo) => zoo.id === userZooId);

  const getZooImage = (zooId) => zooImages[zooId] || ChiangMaiZooImg;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-sm">
          ระบบกล้องสวนสัตว์
        </h1>
      </div>

      {/* Subheading */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        {filteredZoos.length > 1
          ? "สวนสัตว์ทั้งหมด"
          : `สวนสัตว์ของคุณ : ${filteredZoos[0]?.name || ""}`}
      </h2>

      {/* ไม่มีสวนสัตว์ */}
      {filteredZoos.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          ยังไม่มีข้อมูลสวนสัตว์
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 ">
          {filteredZoos.map((zoo) => (
            <div
              key={zoo.id}
              className="bg-white rounded-3xl shadow-xl border border-blue-300 overflow-hidden hover:shadow-2xl transition-transform transform hover:-translate-y-2 "
            >
              {/* Zoo Image */}
              <img
                src={getZooImage(zoo.id)}
                alt={zoo.name}
                className="w-full h-56 object-contain group-hover:scale-105 transition-transform duration-300"
              />

              {/* Zoo Info */}
              <div className="p-6 text-center flex flex-col gap-3">
                <h3 className="font-bold text-xl text-gray-800">
                  {zoo.name || "ไม่มีชื่อสวน"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {zoo.detail_en || "ไม่มีรายละเอียดเพิ่มเติม"}
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-4 mt-4">
                  <Link
                    to={`/zoo/${zoo.id}`}
                    className="px-5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-md transition flex items-center gap-2 justify-center"
                  >
                    <span className="material-icons">info</span>
                    ดูรายละเอียด
                  </Link>
                  <Link
                    to={`/zoo/${zoo.id}/camera`}
                    className="px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-md transition flex items-center gap-2 justify-center"
                  >
                    <span className="material-icons">videocam</span>
                    ดูตาราง Stream
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
