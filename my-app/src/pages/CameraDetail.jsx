// CameraDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_CAMERAS = "http://localhost/lumen-api/public/api/v1/Getcamera";
const API_ZOOS = "https://addpay.net/api/v1/zoo/e-member/all-zoo";
const API_DELETE_ONE = "http://localhost/lumen-api/public/api/v1/cameras"; // DELETE /cameras/:id

export default function CameraDetail() {
  const { zooId } = useParams();
  const navigate = useNavigate();

  const [zoos, setZoos] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ✅ อ่าน user role จาก localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.roles?.some((r) => r.name === "admin");

  const toArray = (json) =>
    Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [resCam, resZoo] = await Promise.all([
        fetch(API_CAMERAS),
        fetch(API_ZOOS),
      ]);
      if (!resCam.ok) throw new Error(`Cameras HTTP ${resCam.status}`);
      if (!resZoo.ok) throw new Error(`Zoos HTTP ${resZoo.status}`);

      const camJson = await resCam.json();
      const zooJson = await resZoo.json();

      const camsAll = toArray(camJson).filter((x) => x && x.zoo_id != null);
      const zoosAll = toArray(zooJson).filter((z) => z && z.id != null);

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
    return () => {
      canceled = true;
    };
  }, [zooId]);

  const selectedZoo = useMemo(
    () => zoos.find((z) => String(z.id) === String(zooId)),
    [zoos, zooId]
  );

  const filteredCameras = useMemo(
    () => cameras.filter((cam) => String(cam.zoo_id) === String(zooId)),
    [cameras, zooId]
  );

  async function deleteCameraById(id) {
    if (!id) return;
    if (!window.confirm("ยืนยันลบกล้องนี้หรือไม่?")) return;

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
      await load();
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setDeletingId(null);
    }
  }

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
            {selectedZoo
              ? `กล้องในสวนสัตว์ ${selectedZoo.name}`
              : `ID สวนสัตว์ ${zooId}`}
          </h1>

          {filteredCameras.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">
              ไม่มีกล้องในสวนสัตว์นี้
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCameras.map((cam) => (
                <div
                  key={cam.id ?? cam.ip_address}
                  className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow p-5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-800 text-lg">
                      <div className="text-gray-600 text-lg">
                        ชื่อสวนสัตว์:{" "}
                        {zoos.find((z) => String(z.id) === String(cam.zoo_id))
                          ?.name || "-"}
                      </div>
                      ตำแหน่งกล้องตัวที่:{" "}
                      {cam.camera_position || "ตำแหน่งไม่ระบุ"}
                      <div className="text-gray-400 text-xs mt-2">
                        IP: {cam.ip_address || "-"}
                      </div>
                    </div>
                    <div className="text-gray-600">
                      สัตว์: {cam.animal_name || "ไม่ระบุ"}
                    </div>
                    {cam.created_at && (
                      <div className="text-gray-400 text-xs">
                        สร้าง: {new Date(cam.created_at).toLocaleDateString()}
                      </div>
                    )}
                    {cam.updated_at && (
                      <div className="text-gray-400 text-xs">
                        อัปเดตล่าสุด:{" "}
                        {new Date(cam.updated_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    {cam.camera_url && (
                      <a
                        href={cam.camera_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      >
                        เปิดสตรีม
                      </a>
                    )}

                    {/* ✅ เฉพาะ admin เท่านั้นที่เห็นปุ่มนี้ */}
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/edit-camera/${cam.id}`)}
                          className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                        >
                          แก้ไข
                        </button>

                        <button
                          onClick={() => deleteCameraById(cam.id)}
                          disabled={deletingId === cam.id}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                        >
                          {deletingId === cam.id ? "กำลังลบ..." : "ลบ"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
