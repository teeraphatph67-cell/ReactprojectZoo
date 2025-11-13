// CameraDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams,useNavigate  } from "react-router-dom";

const API_CAMERAS = "http://localhost/lumen-api/public/api/v1/Getcamera";
const API_ZOOS = "https://addpay.net/api/v1/zoo/e-member/all-zoo";
const API_DELETE_ONE = "http://localhost/lumen-api/public/api/v1/cameras"; // DELETE /cameras/:id

export default function CameraDetail() {
  // ใช้ zooId จาก URL เช่น /zoo/2
  const { zooId } = useParams();

  const navigate = useNavigate();
  const [zoos, setZoos] = useState([]);          // [{id, name, ...}]
  const [cameras, setCameras] = useState([]);    // ทั้งหมด (เดี๋ยวกรองด้วย zooId)
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState(null);


  // helper: แปลง response ที่อาจอยู่ใน data หรือเป็น array ตรง ๆ
  const toArray = (json) => {
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json)) return json;
    return [];
  };

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [resCam, resZoo] = await Promise.all([fetch(API_CAMERAS), fetch(API_ZOOS)]);
      if (!resCam.ok) throw new Error(`Cameras HTTP ${resCam.status}`);
      if (!resZoo.ok) throw new Error(`Zoos HTTP ${resZoo.status}`);

      const camJson = await resCam.json();
      const zooJson = await resZoo.json();

      const camsAll = toArray(camJson).filter(x => x && x.zoo_id != null);
      const zoosAll = toArray(zooJson).filter(z => z && z.id != null);

      setCameras(camsAll);
      setZoos(zoosAll);
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let canceled = false;
    (async () => {
      if (!canceled) await load();
    })();
    return () => { canceled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zooId]); // เปลี่ยน zooId แล้วโหลดใหม่

  // zoo ที่เลือก (จากพารามิเตอร์ ไม่ได้มี dropdown แล้ว)
  const selectedZoo = useMemo(
    () => zoos.find(z => String(z.id) === String(zooId)),
    [zoos, zooId]
  );

  // กรองกล้องเฉพาะของสวนสัตว์นั้น
  const filteredCameras = useMemo(
    () => cameras.filter(cam => String(cam.zoo_id) === String(zooId)),
    [cameras, zooId]
  );

  // ลบกล้องรายตัว
  async function deleteCameraById(id) {
    if (!id) return;
    const ok = window.confirm("ยืนยันลบกล้องนี้หรือไม่?");
    if (!ok) return;

    setDeletingId(id);
    setErr("");
    try {
      const res = await fetch(`${API_DELETE_ONE}/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      if (!res.ok && res.status !== 204) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `DELETE /cameras/${id} HTTP ${res.status}`);
      }
      await load(); // รีเฟรชหลังลบ
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setDeletingId(null);
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
