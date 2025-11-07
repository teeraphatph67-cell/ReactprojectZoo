import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockZoos } from "../pages/mockZooData";

export default function CameraDetail() {
  const { zooId, cameraId } = useParams();
  const zoo = mockZoos.find((z) => z.id === parseInt(zooId));
  const camera = zoo?.cameras.find((c) => c.id === parseInt(cameraId));

  const [showImage, setShowImage] = useState(false); // 👈 ตัวควบคุม popup

  if (!zoo || !camera)
    return <div className="text-black/90 p-6">❌ ไม่พบข้อมูลกล้องนี้</div>;

  return (
    <>
      <Link
        to={`/zoo/${zoo.id}`}
        className="text-blue-400 hover:underline mb-6 inline-block"
      >
        ← กลับไปที่ {zoo.name}
      </Link>

      <div className="max-w-3xl mx-auto p-6 rounded-2xl backdrop-blur-md shadow-2xl text-black/90">
        <h1 className="text-3xl font-bold mb-4">{camera.name}</h1>

        {/* ภาพกล้อง - คลิกเพื่อขยาย */}
        <img
          src={zoo.image}
          alt={camera.name}
          onClick={() => setShowImage(true)}
          className="w-full h-64 object-cover rounded-xl mb-6 cursor-pointer hover:scale-105 transition-transform"
        />

        <div className="space-y-3 text-black/90">
          <p>
            <span className="font-semibold">📍 พื้นที่:</span>{" "}
            {camera.zone || "โซนช้าง"}
          </p>
          <p>
            <span className="font-semibold">📡 สถานะ:</span>{" "}
            <span
              className={`font-semibold ${
                camera.status === "online" ? "text-green-500" : "text-red-500"
              }`}
            >
              {camera.status === "online" ? "🟢 ออนไลน์" : "🔴 ออฟไลน์"}
            </span>
          </p>
          <p>
            <span className="font-semibold">🎞 ความละเอียด:</span>{" "}
            {camera.resolution || "1080p"}
          </p>
          <p>
            <span className="font-semibold">🕓 เวลาล่าสุด:</span>{" "}
            {camera.lastUpdate || "09:45 น."}
          </p>
          <p>
            <span className="font-semibold">💾 การบันทึก:</span>{" "}
            {camera.recording ? "กำลังบันทึก" : "ไม่ได้บันทึก"}
          </p>
        </div>

      </div>

      {/* Popup ขยายภาพ */}
      {showImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 "
          onClick={() => setShowImage(false)}
        >
          <img
            src={zoo.image}
            alt={camera.name}
            className="w-auto max-w-3xl max-h-[80vh] rounded-xl shadow-2xl transform scale-95 transition-transform duration-500 ease-out hover:scale-100      "
            onClick={(e) => e.stopPropagation()} // ป้องกันคลิกปิดเมื่อคลิกที่ภาพ
          />
        </div>
      )}
    </>
  );
}
