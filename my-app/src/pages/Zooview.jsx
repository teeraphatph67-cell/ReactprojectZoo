import React, { useEffect, useState } from 'react'

const Zooview = () => {
      const [zooviewtest, setZooviewtest] = useState(null);
      const [error, setError] = useState(null);
      const [status, setStatus] = useState(null);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      // GET ไม่ต้องมี body และจริง ๆ จะไม่ใส่ Content-Type ก็ได้
      headers: { Accept: "application/json" },
      redirect: "follow",
    };

    fetch("http://localhost/lumen-api/public/api/v1/Getcamera", requestOptions)
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
        setZooviewtest(payload);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
      });
  }, []);

  if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;
  if (zooviewtest == null) return <p>กำลังโหลดข้อมูล... (status: {status ?? "?"})</p>;

  return (
   <div className="max-w-5xl mx-auto p-4 sm:p-6">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">รายละเอียดกล้อง</h2>
    <span className="text-xs sm:text-sm text-gray-500">
      ทั้งหมด {Array.isArray(zooviewtest) ? zooviewtest.length : 0} รายการ
    </span>
  </div>

  {Array.isArray(zooviewtest) ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {zooviewtest.map((z) => (
        <div
          key={z.id ?? `${z.ip_address}-${Math.random()}`}
          className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                ID: {z.id}
              </span>
              {z.zoo_name && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {z.zoo_name}
                </span>
              )}
            </div>
          </div>

          {/* content */}
          <dl className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 min-w-[110px]">IP Address</dt>
              <dd className="font-medium">{z.ip_address}</dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 min-w-[110px]">ตำแหน่งกล้อง</dt>
              <dd className="font-medium">{z.camera_position}</dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 min-w-[110px]">ชื่อสัตว์</dt>
              <dd className="font-medium">{z.animal_name}</dd>
            </div>

            {z.zooprovince && (
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500 min-w-[110px]">จังหวัด</dt>
                <dd className="font-medium">{z.zooprovince}</dd>
              </div>
            )}

            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 min-w-[110px]">อัปเดตล่าสุด</dt>
              <dd className="font-medium">{z.updated_at}</dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="text-gray-500 min-w-[110px]">สร้างเมื่อ</dt>
              <dd className="font-medium">{z.created_at}</dd>
            </div>

            <div className="flex items-start gap-3">
              <dt className="text-gray-500 min-w-[110px]">ลิงก์กล้อง</dt>
              <dd className="font-medium break-all">
                <a
                  href={z.camera_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block truncate max-w-[14rem] md:max-w-[12rem] lg:max-w-[10rem] text-blue-600 hover:underline"
                  title={z.camera_url}
                >
                  {z.camera_url}
                </a>
              </dd>
            </div>
          </dl>

          {/* footer actions */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <a
              href={z.camera_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
            >
              เปิดสตรีม
            </a>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(z.camera_url)}
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              คัดลอกลิงก์
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">ไม่พบข้อมูลกล้อง</p>
  )}
</div>

  )
}

export default Zooview
