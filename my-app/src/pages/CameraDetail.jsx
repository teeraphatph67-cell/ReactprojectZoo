import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const API_CAMERAS = "http://localhost/lumen-api/public/api/v1/Getcamera"; // API_1
const API_ZOOS    = "https://addpay.net/api/v1/zoo/e-member/all-zoo";     // API_2

export default function CameraDetail() {
  // ถ้ามี route param เช่น /camera/:id จะ auto เลือกอันนั้น
  const params = useParams(); // ต้องประกาศ route ไว้ด้วย เช่น <Route path="/camera/:id" element={<CameraDetail />} />
  const initialZooIdFromRoute = params?.id ?? "";

  const [zoos, setZoos] = useState([]);          // [{id, name, ...}]
  const [cameras, setCameras] = useState([]);    // [{..., zoo_id, ...}]
  const [selectedZooId, setSelectedZooId] = useState(initialZooIdFromRoute);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let canceled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        // ดึงพร้อมกันทั้งสอง API
        const [resCam, resZoo] = await Promise.all([fetch(API_CAMERAS), fetch(API_ZOOS)]);
        if (!resCam.ok) throw new Error(`Cameras HTTP ${resCam.status}`);
        if (!resZoo.ok) throw new Error(`Zoos HTTP ${resZoo.status}`);

        const camJson = await resCam.json();
        const zooJson = await resZoo.json();

        // รองรับโครง {data:[...]} หรือ [...] ตรงๆ
        const cams = Array.isArray(camJson?.data) ? camJson.data : (Array.isArray(camJson) ? camJson : []);
        const zlist = Array.isArray(zooJson?.data) ? zooJson.data : (Array.isArray(zooJson) ? zooJson : []);

        if (!canceled) {
          setCameras(cams.filter(x => x && x.zoo_id != null));
          setZoos(zlist.filter(z => z && z.id != null));
          // ถ้ามี id จาก route แต่ยังไม่ตั้งค่า ให้ตั้งเลย
          if (initialZooIdFromRoute && !selectedZooId) {
            setSelectedZooId(String(initialZooIdFromRoute));
          }
        }
      } catch (e) {
        if (!canceled) setErr(e.message || String(e));
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => { canceled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // zoo ที่ถูกเลือก (จาก API_2)
  const selectedZoo = useMemo(
    () => zoos.find(z => String(z.id) === String(selectedZooId)),
    [zoos, selectedZooId]
  );

  // กล้องที่ zoo_id ตรงกับ id ที่เลือก (join แบบง่าย)
  const filteredCameras = useMemo(
    () => cameras.filter(cam => String(cam.zoo_id) === String(selectedZooId)),
    [cameras, selectedZooId]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Camera Detail</h1>

        {/* เลือกสวนสัตว์ (ถ้าใช้ route param ก็ยังเปลี่ยนได้จาก dropdown) */}
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

        {/* รายการกล้องที่ match zoo_id === id */}
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
                <div className="text-sm text-gray-500">zoo_id: <span className="font-mono">{cam.zoo_id}</span></div>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
