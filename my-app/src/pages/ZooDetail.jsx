import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ZooDetail() {
  const { id } = useParams(); // เอา id จาก URL
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

        // หา zoo ที่ตรงกับ id
        const found = data.find((z) => z.id === parseInt(id));
        setZoo(found || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchZoo();
  }, [id, apiKey]);

  if (loading) return <p>กำลังโหลดข้อมูลสวนสัตว์...</p>;
  if (error) return <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>;
  if (!zoo) return <p>ไม่พบข้อมูลสวนสัตว์</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">{zoo.name}</h1>
      <p><strong>ชื่อภาษาอังกฤษ:</strong> {zoo.name_en}</p>
      <p><strong>Code:</strong> {zoo.code}</p>
      <p><strong>รายละเอียด:</strong> {zoo.detail}</p>
      <p><strong>รายละเอียดภาษาอังกฤษ:</strong> {zoo.detail_en}</p>
      <p><strong>Status:</strong> {zoo.status || "ไม่มีข้อมูล"}</p>
      <p><strong>สร้างเมื่อ:</strong> {new Date(zoo.created_at).toLocaleString()}</p>
      <p><strong>แก้ไขล่าสุด:</strong> {new Date(zoo.updated_at).toLocaleString()}</p>
    </div>
  );
}
