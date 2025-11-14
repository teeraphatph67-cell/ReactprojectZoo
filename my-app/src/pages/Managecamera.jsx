import React, { useState, useEffect } from "react";

const API_CAMERAS = "http://localhost/lumen-api/public/api/v1/Getcamera";

export default function ManageCamera() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const loadCameras = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(API_CAMERAS);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const cams = Array.isArray(data?.data) ? data.data : [];
        setCameras(cams);
      } catch (e) {
        setErr(e.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    loadCameras();
  }, []);

  if (loading)
    return (
      <p className="text-gray-600 p-4 text-center animate-pulse">
        ⏳ กำลังโหลดข้อมูล...
      </p>
    );

  if (err)
    return (
      <p className="text-red-600 p-4 text-center">❌ เกิดข้อผิดพลาด: {err}</p>
    );

  return (
    <main className="pt-20 px-6 pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <img
            alt="สวนสัตว์เปิดเขาเขียว"
            className="w-24 h-24 object-cover rounded-2xl border-2 border-blue-300 shadow-md"
            src="/src/assets/khaokheowzoo.png"
          />
          <h1 className="text-4xl font-extrabold text-blue-700 flex items-center gap-2">
            <span className="material-icons text-blue-500">photo_camera</span>
            จัดการกล้อง : สวนสัตว์เปิดเขาเขียว
          </h1>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition flex items-center gap-2">
          <span className="material-icons">add_a_photo</span>
          เพิ่มกล้องใหม่
        </button>
      </div>

      {/* Info Cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-green-50 text-green-900 rounded-xl p-5 flex items-center gap-4 shadow-lg w-full sm:w-auto">
          <span className="material-icons text-4xl">pets</span>
          <div>
            <p className="text-sm font-medium">จำนวนสัตว์ทั้งหมด</p>
            <p className="text-2xl font-bold">{cameras.length}</p>
          </div>
        </div>
        <div className="bg-blue-50 text-blue-900 rounded-xl p-5 flex items-center gap-4 shadow-lg w-full sm:w-auto">
          <span className="material-symbols-outlined text-4xl">videocam</span>
          <div>
            <p className="text-sm font-medium">กล้องออนไลน์</p>
            <p className="text-2xl font-bold">
              {cameras.filter((cam) => cam.online).length}/{cameras.length}
            </p>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-10">
            ไม่มีกล้องในสวนสัตว์นี้
          </p>
        ) : (
          cameras.map((cam) => (
            <div
              key={cam.id}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
            >
              {/* Image */}
              <div className="relative group">
                <img
                  src={
                    cam.animal_image ||
                    "https://via.placeholder.com/400x200?text=Animal"
                  }
                  alt={cam.animal_name || cam.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="คลิกเพื่ออัปโหลดรูป"
                />
              </div>

              {/* Details */}
              <div className="p-5 flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <span className="material-icons text-blue-500">pets</span>
                  {cam.animal_name || cam.name}
                </h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <span className="material-icons text-gray-400 text-base">
                    category
                  </span>
                  ประเภท: {cam.animal_type || "-"}
                </p>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <span className="material-icons text-gray-400 text-base">
                    place
                  </span>
                  ตำแหน่ง: {cam.camera_position || "-"}
                </p>

                <div className="flex gap-3 mt-3">
                  <button className="flex-1 bg-blue-500 text-white py-2 rounded-xl shadow-md hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm">
                    <span className="material-icons">videocam</span>
                    ดูกล้อง
                  </button>
                  <button className="flex-1 bg-yellow-500 text-white py-2 rounded-xl shadow-md hover:bg-yellow-600 transition flex items-center justify-center gap-2 text-sm">
                    <span className="material-icons">edit</span>
                    แก้ไข
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
