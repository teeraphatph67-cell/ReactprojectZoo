import { useParams, Link } from "react-router-dom";
import { mockZoos } from "../pages/mockZooData";

export default function CameraDetail() {
  const { zooId, cameraId } = useParams();
  const zoo = mockZoos.find((z) => z.id === parseInt(zooId));
  const camera = zoo?.cameras.find((c) => c.id === parseInt(cameraId));

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

        <img
          src={camera.image}
          alt={camera.name}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />

        <div className="space-y-3 text-black/90">
          <p>
            <span className="font-semibold text-black/90">📍 พื้นที่:</span>{" "}
            {camera.zone || "โซนช้าง"}
          </p>

          <p>
            <span className="font-semibold text-black/90">📡 สถานะ:</span>{" "}
            <span
              className={`font-semibold ${
                camera.status === "online" ? "text-green-400" : "text-red-400"
              }`}
            >
              {camera.status === "online" ? "🟢 ออนไลน์" : "🔴 ออฟไลน์"}
            </span>
          </p>

          <p>
            <span className="font-semibold text-black/90">🎞 ความละเอียด:</span>{" "}
            {camera.resolution || "1080p"}
          </p>

          <p>
            <span className="font-semibold text-black/90">
              🕓 เวลาล่าสุดที่อัปเดต:
            </span>{" "}
            {camera.lastUpdate || "09:45 น."}
          </p>

          <p>
            <span className="font-semibold text-black/90">💾 การบันทึกภาพ:</span>{" "}
            {camera.recording ? "กำลังบันทึกอยู่" : "ไม่ได้บันทึก"}
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold transition">
            🔍 ดูภาพจำลอง
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition">
            ⚙️ ตั้งค่ากล้อง
          </button>
        </div>
      </div>
    </>
  );
}
