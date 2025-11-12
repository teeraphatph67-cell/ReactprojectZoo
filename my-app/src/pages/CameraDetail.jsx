import { useEffect, useMemo, useState } from "react";
import { useParams,Link } from "react-router-dom";

const API_CAMERAS = "http://localhost/lumen-api/public/api/v1/Getcamera"; // API_1
const API_ZOOS    = "https://addpay.net/api/v1/zoo/e-member/all-zoo";     // API_2

const API_DELETE_ONE = "http://localhost/lumen-api/public/api/v1/cameras"; // DELETE /cameras/:id

export default function CameraDetail() {
  const params = useParams();
  const initialZooIdFromRoute = params?.id ?? "";

  const [zoos, setZoos] = useState([]);          // [{id, name, ...}]
  const [cameras, setCameras] = useState([]);    // [{..., zoo_id, ...}]
  const [selectedZooId, setSelectedZooId] = useState(initialZooIdFromRoute);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState(""); 

  // ★ KEEP: สถานะลบ "รายตัว"
  const [deletingId, setDeletingId] = useState(null);

  // ★ KEEP: load() เอาไว้รีเฟรชหลังลบสำเร็จ
  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [resCam, resZoo] = await Promise.all([fetch(API_CAMERAS), fetch(API_ZOOS)]);
      if (!resCam.ok) throw new Error(`Cameras HTTP ${resCam.status}`);
      if (!resZoo.ok) throw new Error(`Zoos HTTP ${resZoo.status}`);

      const camJson = await resCam.json();
      const zooJson = await resZoo.json();

      const cams  = Array.isArray(camJson?.data) ? camJson.data : (Array.isArray(camJson) ? camJson : []);
      const zlist = Array.isArray(zooJson?.data) ? zooJson.data : (Array.isArray(zooJson) ? zooJson : []);

      setCameras(cams.filter(x => x && x.zoo_id != null));
      setZoos(zlist.filter(z => z && z.id != null));

      if (initialZooIdFromRoute && !selectedZooId) {
        setSelectedZooId(String(initialZooIdFromRoute));
      }
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let canceled = false;
    (async () => { if (!canceled) await load(); })();
    return () => { canceled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedZoo = useMemo(
    () => zoos.find(z => String(z.id) === String(selectedZooId)),
    [zoos, selectedZooId]
  );

  const filteredCameras = useMemo(
    () => cameras.filter(cam => String(cam.zoo_id) === String(selectedZooId)),
    [cameras, selectedZooId]
  );

  // ★ KEEP: ลบกล้องรายตัวเท่านั้น
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
      await load(); // รีเฟรชรายการหลังลบ
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Camera Detail</h1>

        {/* เลือกสวนสัตว์ (ยังคงไว้เพื่อกรองดูเฉพาะสวนสัตว์นั้น ๆ) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">เลือกสวนสัตว์</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={selectedZooId}
            onChange={(e) => setSelectedZooId(e.target.value)}
          >
            <option value="">{loading ? "กำลังโหลด..." : "— เลือกสวนสัตว์ —"}</option>
            {zoos.map(z => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

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

        <h2 className="text-lg font-semibold mb-2">
          กล้องที่อยู่ในสวนสัตว์นี้ {selectedZoo ? `(${selectedZoo.name})` : ""}
        </h2>

        {loading ? (
          <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : !selectedZooId ? (
          <div className="text-gray-500">โปรดเลือกสวนสัตว์ก่อน</div>
        ) : filteredCameras.length === 0 ? (
          <div className="text-gray-500">ไม่พบกล้องที่ตรงกับสวนสัตว์นี้</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCameras.map((cam) => (
              <div key={cam.id ?? `${cam.ip_address}-${cam.camera_url}`} className="border rounded-xl p-4">
                <div className="text-sm text-gray-500">
                  zoo_id: <span className="font-mono">{cam.zoo_id}</span>
                </div>
                <div className="font-medium mt-1">{cam.camera_position || "ตำแหน่งไม่ระบุ"}</div>
                <div className="text-sm text-gray-700">{cam.animal_name || "สัตว์ไม่ระบุ"}</div>
                {cam.camera_url && (
                  <a
                    href={cam.camera_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-indigo-600 underline"
                  >
                    เปิดสตรีม
                  </a>
                )}
                <div className="text-xs text-gray-500 mt-2">IP: {cam.ip_address || "-"}</div>

                {/* ★ KEEP: ปุ่มลบเฉพาะกล้องตัวนี้ */}
                {cam.id && (
                  <button
                    type="button"
                    onClick={() => deleteCameraById(cam.id)}
                    disabled={deletingId === cam.id}
                    className="mt-3 inline-flex items-center rounded-lg bg-red-600 text-white px-3 py-1 text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingId === cam.id ? "กำลังลบ..." : "ลบกล้องนี้"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
