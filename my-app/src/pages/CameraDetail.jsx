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
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">
          กล้องในสวนสัตว์ {selectedZoo ? selectedZoo.name : `ID ${zooId || "-"}`}
        </h1>

        {err && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 p-3 text-sm">
            เกิดข้อผิดพลาด: {err}
          </div>
        )}

        {selectedZoo && (
          <div className="mb-4 text-sm text-gray-700">
            <div>🆔 <span className="font-mono">{selectedZoo.id}</span></div>
            <div>🏷️ {selectedZoo.name}</div>
          </div>
        )}

        {loading ? (
          <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : filteredCameras.length === 0 ? (
          <p className="text-gray-500">ไม่มีกล้องในสวนสัตว์นี้</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCameras.map((cam) => (
              <div
                key={cam.id ?? `${cam.zoo_id}-${cam.ip_address ?? Math.random()}`}
                className="border rounded-xl p-4 shadow-sm"
              >
                <div className="text-sm text-gray-500">zoo_id: {cam.zoo_id}</div>
                <div className="font-medium mt-1">กล้อง
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

                {/* ปุ่มลบ (รายตัว) */}
                <button
                  onClick={() => deleteCameraById(cam.id)}
                  disabled={!cam.id || deletingId === cam.id}
                  className={`mt-3 px-3 py-1 rounded-lg text-sm ${deletingId === cam.id
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                >
                  {deletingId === cam.id ? "กำลังลบ..." : "ลบกล้อง"}
                </button>

                <button
                  onClick={() => navigate(`/edit-camera/${cam.id}`)}
                  className="mt-3 px-3 py-1 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  แก้ไข
                </button>


              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
