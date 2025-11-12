import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ZooDetail() {
  const { id } = useParams(); // ดึง id จาก URL เช่น /zoo/1
  const [zoo, setZoo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = localStorage.getItem("api_key");

  useEffect(() => {
    const fetchZoo = async () => {
      try {
        const res = await fetch(`https://addpay.net/api/v1/zoo/e-member/all-zoo`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // รองรับทั้งแบบ {data: [...]} หรือ [...ตรงๆ]
        const list = Array.isArray(data?.data) ? data.data : data;

        // หา zoo ที่ id ตรงกับ URL
        const found = list.find((z) => String(z.id) === String(id));
        setZoo(found || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchZoo();
  }, [id, apiKey]);

  if (loading) return <p className="text-gray-600 p-4">⏳ กำลังโหลดข้อมูลสวนสัตว์...</p>;
  if (error) return <p className="text-red-600 p-4">❌ เกิดข้อผิดพลาด: {error}</p>;
  if (!zoo) return <p className="text-gray-600 p-4">ไม่พบข้อมูลสวนสัตว์นี้</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-md mt-8">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">{zoo.name}</h1>

      <div className="space-y-2 text-gray-700">
        <p><strong>ชื่อภาษาอังกฤษ:</strong> {zoo.name_en || "ไม่มีข้อมูล"}</p>
        <p><strong>รหัสสวนสัตว์:</strong> {zoo.code}</p>
        <p><strong>รายละเอียด:</strong> {zoo.detail || "ไม่มีข้อมูล"}</p>
        <p><strong>รายละเอียดภาษาอังกฤษ:</strong> {zoo.detail_en || "ไม่มีข้อมูล"}</p>
        <p><strong>สถานะ:</strong> {zoo.status || "ไม่มีข้อมูล"}</p>
        <p><strong>สร้างเมื่อ:</strong> {new Date(zoo.created_at).toLocaleString()}</p>
        <p><strong>อัปเดตล่าสุด:</strong> {new Date(zoo.updated_at).toLocaleString()}</p>
      </div>

      {/* ปุ่มไปหน้า CameraDetail */}
      <div className="mt-6">
        <Link
          to={`/zoo/${zoo.id}/camera`}
          className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
        >
          ดูกล้องทั้งหมดในสวนสัตว์นี้ 🎥
        </Link>
      </div>
    </div>
  );
}
