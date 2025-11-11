import React, { useEffect, useState } from "react"; // นำเข้า React และ hook useEffect, useState
import { useParams, Link } from "react-router-dom"; // useParams ดึงค่าพารามิเตอร์จาก URL, Link สำหรับลิงก์ไปหน้าอื่น

export default function CameraDetail() {
  const { zooId, cameraId } = useParams(); // ดึง zooId และ cameraId จาก URL
  const [camera, setCamera] = useState(null); // เก็บข้อมูลกล้องตัวเดียว
  const [zoo, setZoo] = useState(null); // เก็บข้อมูลสวนสัตว์ที่กล้องอยู่
  const [loading, setLoading] = useState(true); // ตัวบ่งชี้กำลังโหลด
  const [error, setError] = useState(null); // เก็บข้อความ error

  useEffect(() => {
    setLoading(true); // เริ่มโหลดข้อมูล

    // ดึงข้อมูลกล้องทั้งหมดจาก API
    fetch("http://localhost/lumen-api/public/api/v1/Getcamera")
      .then((res) => res.json()) // แปลง response เป็น JSON
      .then((result) => {
        const allCams = result?.data ?? result; // ถ้ามี data ใช้ data ถ้าไม่ใช้ result ตรงๆ
        // หาเฉพาะกล้องที่ตรงกับ cameraId และ zooId
        const foundCam = allCams.find(
          (c) =>
            String(c.id) === String(cameraId) &&
            String(c.zoo_id) === String(zooId)
        );

        if (!foundCam) throw new Error("ไม่พบกล้องนี้"); // ถ้าไม่เจอกล้องให้โยน error

        setCamera(foundCam); // เก็บข้อมูลกล้อง
        // สร้าง object ของสวนสัตว์จากกล้อง
        setZoo({
          id: foundCam.zoo_id,
          name_zoo: foundCam.zoo_name,
          zooprovince: foundCam.zooprovince,
        });
      })
      .catch((err) => setError(err.message)) // ถ้า fetch หรือ find ผิดพลาด ให้เซ็ต error
      .finally(() => setLoading(false)); // ไม่ว่า error หรือสำเร็จ ให้ปิด loading
  }, [zooId, cameraId]); // useEffect จะรันใหม่ทุกครั้งที่ zooId หรือ cameraId เปลี่ยน

  if (loading) return <p>กำลังโหลดข้อมูลกล้อง...</p>; // ขณะรอข้อมูล
  if (error) return <p className="text-red-500">❌ {error}</p>; // แสดงข้อความ error

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* ลิงก์กลับไปยังหน้า zoo */}
      <Link
        to={`/zoo/${zoo.id}`}
        className="text-blue-400 hover:underline mb-6 inline-block"
      >
        ← กลับไปที่ {zoo.name_zoo}
      </Link>

      {/* กล่องข้อมูลกล้อง */}
      <div className="p-6 rounded-2xl shadow-2xl bg-white">
        {/* ชื่อสัตว์ + ตำแหน่งกล้อง */}
        <h1 className="text-2xl font-bold mb-4">
          {camera.animal_name} (ตำแหน่งกล้อง: {camera.camera_position})
        </h1>
        <iframe
          width="100%"
          height="300"
          src={camera.camera_url.replace("watch?v=", "embed/")} // เปลี่ยนเป็น embed
          title={camera.animal_name}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        {/* รายละเอียดต่างๆ */}
        <p>
          <span className="font-semibold">📡 IP:</span> {camera.ip_address}
        </p>
        <p>
          <span className="font-semibold">🎥 URL:</span>{" "}
          <a
            href={camera.camera_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            เปิดสตรีม
          </a>
        </p>
        <p>
          <span className="font-semibold">🌍 จังหวัด:</span>{" "}
          {camera.zooprovince}
        </p>
        <p>
          <span className="font-semibold">🕓 ล่าสุด:</span> {camera.updated_at}
        </p>
      </div>
    </div>
  );
}
