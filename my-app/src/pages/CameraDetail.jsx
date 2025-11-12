import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_CAMERAS = "http://localhost/lumen-api/public/api/v1/Getcamera";
const API_ZOOS = "https://addpay.net/api/v1/zoo/e-member/all-zoo";

export default function CameraDetail() {
  const { zooId } = useParams(); // ดึง zooId จาก URL เช่น /zoo/2
  const [zoo, setZoo] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr("");

        // ดึงข้อมูลกล้องทั้งหมด และสวนสัตว์ทั้งหมด
        const [resCam, resZoo] = await Promise.all([
          fetch(API_CAMERAS),
          fetch(API_ZOOS),
        ]);

        if (!resCam.ok || !resZoo.ok)
          throw new Error("ไม่สามารถดึงข้อมูลจาก API ได้");

        const camJson = await resCam.json();
        const zooJson = await resZoo.json();

        // ดึงเฉพาะข้อมูลที่ตรงกับ zooId ที่มากับ route
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl bg-white rounded-2xl shadow p-6">
        {loading ? (
          <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : err ? (
          <div className="text-red-500">เกิดข้อผิดพลาด: {err}</div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">
              กล้องในสวนสัตว์ {zoo ? zoo.name : `ID ${zooId}`}
            </h1>

            {cameras.length === 0 ? (
              <p className="text-gray-500">ไม่มีกล้องในสวนสัตว์นี้</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cameras.map((cam) => (
                  <div
                    key={cam.id ?? cam.ip_address}
                    className="border rounded-xl p-4 shadow-sm"
                  >
                    <div className="text-sm text-gray-500">
                      zoo_id: {cam.zoo_id}
                    </div>
                    <div className="font-medium mt-1">
                      {cam.camera_position || "ตำแหน่งไม่ระบุ"}
                    </div>
                    <div className="text-sm text-gray-700">
                      {cam.animal_name || "สัตว์ไม่ระบุ"}
                    </div>
                    {cam.camera_url && (
                      <a
                        href={cam.camera_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 underline mt-2 inline-block"
                      >
                        เปิดสตรีม
                      </a>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      IP: {cam.ip_address || "-"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
