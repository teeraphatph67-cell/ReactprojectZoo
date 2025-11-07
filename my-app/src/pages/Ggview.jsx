import React, { useEffect, useState } from "react";

export default function Ggview() {
  const [zoo, setZoo] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      // GET ไม่ต้องมี body และจริง ๆ จะไม่ใส่ Content-Type ก็ได้
      headers: { Accept: "application/json" },
      redirect: "follow",
    };

    fetch("http://localhost/lumen-api/public/api/v1/Getzoo", requestOptions)
      .then((res) => {
        setStatus(res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((result) => {
        console.log("ผลลัพธ์จาก API:", result);
        // 👉 ปรับตรงนี้ให้ตรงกับโครง JSON จริง
        // ถ้า API ส่ง { success, data: [...] } → ใช้ result.data
        // ถ้าส่งเป็น [] ตรง ๆ → ใช้ result
        const payload = result?.data ?? result;
        setZoo(payload);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
      });
  }, []);

  // ——— UI เริ่มจากสถานะก่อน ———
  if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;
  if (zoo == null) return <p>กำลังโหลดข้อมูล... (status: {status ?? "?"})</p>;

  return (
<div className="max-w-4xl mx-auto p-4 sm:p-6">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">รายชื่อสวนสัตว์</h2>
    <span className="text-xs sm:text-sm text-gray-500">
      ทั้งหมด {Array.isArray(zoo) ? zoo.length : 0} แห่ง
    </span>
  </div>

  {Array.isArray(zoo) ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {zoo.map((z) => (
        <div
          key={z.id ?? `${z.name_zoo}-${Math.random()}`}
          className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              ID: {z.id}
            </span>
          </div>

          <dl className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 min-w-[110px]">ชื่อสวนสัตว์</dt>
              <dd className="font-medium">{z.name_zoo}</dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 min-w-[110px]">จังหวัด</dt>
              <dd className="font-medium">{z.zooprovince}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-end">
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(z.name_zoo)}
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              คัดลอกชื่อ
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">ไม่พบข้อมูลสวนสัตว์</p>
  )}
</div>

  );
}
