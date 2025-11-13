import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ✅ นำเข้ารูปภาพสวนสัตว์ทั้งหมดจากโฟลเดอร์ assets
import ChiangMaiZooImg from "../../assets/chiangmaizoo.png";
import KhaoKheowZooImg from "../../assets/khaokheowzoo.png";
import KhonKaenZooImg from "../../assets/khonkaenzoo.png";
import NakhonRatchasimaZooImg from "../../assets/nakhonratchasimazoo.png";
import SongkhlaZooImg from "../../assets/songkhlazoo.png";
import UbonZooImg from "../../assets/ubonratchathanizoo.png";
import logo_addpay from "../../assets/logo_addpay.webp";
import zoo_of_thailand from "../../assets/zoo-0.png";

export default function Hero() {
  // ✅ ตัวช่วยนำทางระหว่างหน้า
  const navigate = useNavigate();

  // ✅ ดึงข้อมูลผู้ใช้และ API key จาก localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const apiKey = localStorage.getItem("api_key");

  // ✅ สร้าง state สำหรับเก็บข้อมูลสวนสัตว์
  const [zoos, setZoos] = useState([]);

  // ✅ state สำหรับสถานะโหลดข้อมูล
  const [loading, setLoading] = useState(true);

  // ✅ state สำหรับเก็บข้อความ error
  const [error, setError] = useState(null);

  // ✅ สร้าง mapping ระหว่าง ID ของสวน กับรูปภาพที่เก็บไว้
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

  // ✅ ดึงข้อมูลสวนสัตว์จาก API เมื่อ component ถูกโหลด
  useEffect(() => {
    // ถ้ายังไม่มีข้อมูลผู้ใช้หรือ API key ให้เด้งไปหน้า login
    if (!user || !apiKey) {
      navigate("/login");
      return;
    }

    // ฟังก์ชัน async สำหรับโหลดข้อมูลสวนสัตว์ทั้งหมด
    const fetchZoos = async () => {
      try {
        // เรียก API จากระบบ addpay
        const res = await fetch(
          "https://addpay.net/api/v1/zoo/e-member/all-zoo",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`, // ✅ ใช้ Bearer token
            },
          }
        );

        // ถ้า response ไม่สำเร็จให้โยน error ออกมา
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          const msg = errData?.message || `HTTP ${res.status}`;
          throw new Error(msg);
        }

        // ✅ ถ้าสำเร็จ แปลง response เป็น JSON แล้วเก็บใน state
        const data = await res.json();
        setZoos(data || []);
      } catch (err) {
        // ✅ ถ้ามี error จะมาลงในนี้
        console.error("Fetch zoos error:", err);
        setError(err.message);
      } finally {
        // ✅ ปิดสถานะโหลดเสมอ (ทั้งตอนสำเร็จและ error)
        setLoading(false);
      }
    };

    fetchZoos();
  }, [user, apiKey, navigate]);

  // ✅ แสดงข้อความระหว่างโหลดข้อมูล
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
        🦓 กำลังโหลดข้อมูลสวนสัตว์...
      </div>
    );

  // ✅ ถ้ามี error ให้แสดงข้อความแจ้งเตือน
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

  // ✅ ตรวจสอบว่าเป็นแอดมินไหม
  const isAdmin = user?.roles?.some((r) => r.name === "admin");

  // ✅ ถ้าไม่ใช่แอดมิน ให้เห็นแค่สวนสัตว์ของตัวเอง
  const userZooId = user?.user_profile?.zoo?.id;
  const filteredZoos = isAdmin
    ? zoos
    : zoos.filter((zoo) => zoo.id === userZooId);

  // ✅ ฟังก์ชันหาภาพของสวนตาม ID (ถ้าไม่เจอใช้รูปเชียงใหม่แทน)
  const getZooImage = (zooId) => zooImages[zooId] || ChiangMaiZooImg;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-right">
      {/* ✅ ส่วนหัวของหน้า */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-sm">
          ระบบกล้องสวนสัตว์
        </h1>
      </div>

      {/* ✅ หัวข้อแสดงชื่อสวนสัตว์ */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        {filteredZoos.length > 1
          ? "สวนสัตว์ทั้งหมด"
          : `สวนสัตว์ของคุณ : ${filteredZoos[0]?.name || ""}`}
      </h2>

      {/* ✅ ถ้าไม่มีสวนสัตว์เลย */}
      {filteredZoos.length === 0 ? (
        <p className="text-gray-500 text-center">ยังไม่มีข้อมูลสวนสัตว์</p>
      ) : (
        // ✅ แสดงการ์ดสวนสัตว์แต่ละแห่ง
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredZoos.map((zoo) => (
            <div
              key={zoo.id}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              {/* ✅ แสดงภาพสวนตาม ID */}
              <img
                src={getZooImage(zoo.id)}
                alt={zoo.name}
                className="w-full h-48 object-contain"
              />

              {/* ✅ ส่วนรายละเอียดของสวน */}
              <div className="p-5 text-center">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {zoo.name || "ไม่มีชื่อสวน"}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {zoo.detail_en || "ไม่มีรายละเอียดเพิ่มเติม"}
                </p>

                {/* ✅ ปุ่มลิงก์เข้าไปดูรายละเอียด */}
                <div className="flex justify-center gap-3">
                  <Link
                    to={`/zoo/${zoo.id}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    ดูรายละเอียดสวน
                  </Link>
                  <Link
                    to={`/zoo/${zoo.id}/camera`}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    ดูกล้อง
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
