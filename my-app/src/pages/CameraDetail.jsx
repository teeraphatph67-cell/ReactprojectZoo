import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_CAMERAS = "http://localhost/lumen-api/public/api/v1/Getcamera";
const API_ZOOS = "https://addpay.net/api/v1/zoo/e-member/all-zoo";

export default function CameraDetail() {
  const { zooId } = useParams();
  const [zoo, setZoo] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr("");

        const [resCam, resZoo] = await Promise.all([
          fetch(API_CAMERAS),
          fetch(API_ZOOS),
        ]);

        if (!resCam.ok || !resZoo.ok)
          throw new Error("ไม่สามารถดึงข้อมูลจาก API ได้");

        const camJson = await resCam.json();
        const zooJson = await resZoo.json();

        const cams =
          Array.isArray(camJson?.data) || Array.isArray(camJson)
            ? (camJson.data ?? camJson).filter(
                (c) => String(c.zoo_id) === String(zooId)
              )
            : [];

        const zoos =
          Array.isArray(zooJson?.data) || Array.isArray(zooJson)
            ? zooJson.data ?? zooJson
            : [];

        const zooFound = zoos.find((z) => String(z.id) === String(zooId));

        setCameras(cams);
        setZoo(zooFound ?? null);
      } catch (e) {
        setErr(e.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [zooId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loading ? (
        <div className="text-gray-500 text-center text-lg mt-20">
          🦓 กำลังโหลดข้อมูลกล้อง...
        </div>
      ) : err ? (
        <div className="text-red-600 text-center mt-20 font-semibold">
          {err}
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {zoo ? `กล้องในสวนสัตว์ ${zoo.name}` : `ID สวนสัตว์ ${zooId}`}
          </h1>

          {cameras.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">
              ไม่มีกล้องในสวนสัตว์นี้
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cameras.map((cam) => (
                <div
                  key={cam.id ?? cam.ip_address}
                  className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow p-5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-800 text-lg">
                      <div className="text-black-400 text-lg">
                        ชื่อสวนสัตว์: {zoo.name}
                      </div>
                      ตำแหน่งกล้องตัวที่:{" "}
                      {cam.camera_position || "ตำแหน่งไม่ระบุ"}
                      <div className="text-black-400 text-xs mt-2">
                        IP: {cam.ip_address || "-"}
                      </div>
                    </div>
                    <div className="text-black-600">
                      สัตว์: {cam.animal_name || "ไม่ระบุ"}
                    </div>
                    {cam.created_at && (
                      <div className="text-black-400 text-xs">
                        สร้าง: {new Date(cam.created_at).toLocaleDateString()}
                      </div>
                    )}
                    {cam.updated_at && (
                      <div className="text-black-400 text-xs">
                        อัปเดตล่าสุด:{" "}
                        {new Date(cam.updated_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {cam.camera_url && (
                    <a
                      href={cam.camera_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      เปิดสตรีม
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
