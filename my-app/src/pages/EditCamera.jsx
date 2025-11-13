// src/pages/EditCamera.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams,Link } from "react-router-dom";

const API_BASE          = "http://localhost/lumen-api/public/api/v1";
const API_GET_CAMERA    = `${API_BASE}/cameras`;                // GET /cameras/:id (ถ้ามี)
const API_LIST_CAMERAS  = `${API_BASE}/Getcamera`;              // สำรอง: GET ทั้งหมด แล้ว find
const API_UPDATE_CAMERA = `${API_BASE}/cameras`;                // PATCH /cameras/:id
const API_ZOOS          = "https://addpay.net/api/v1/zoo/e-member/all-zoo"; // id, name

export default function EditCamera() {
  const { id } = useParams();                // /edit-camera/:id
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ip_address: "",
    zoo_id: "",
    camera_position: "",
    animal_name: "",
    camera_url: "",
  });

  const [zooList, setZooList]   = useState([]);  // [{id, name}, ...]
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [message, setMessage]   = useState("");

  // ---- helpers ----
  const S = (v) => String(v ?? "");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const ip = (form.ip_address || "").trim();
    const ipRegex =
      /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

    if (!ip) return "กรุณากรอก IP";
    if (!ipRegex.test(ip)) return "รูปแบบ IP ไม่ถูกต้อง (เช่น 192.168.1.10)";
    if (!String(form.zoo_id || "").trim()) return "กรุณาเลือกสวนสัตว์";
    if (!(form.camera_position || "").trim()) return "กรุณากรอกตำแหน่งกล้อง";
    if (!(form.animal_name || "").trim()) return "กรุณากรอกชื่อสัตว์";

    try {
      const u = new URL(form.camera_url);
      if (!/^https?:$/.test(u.protocol)) return "URL ต้องขึ้นต้นด้วย http:// หรือ https://";
    } catch {
      return "URL ต้องขึ้นต้นด้วย http:// หรือ https://";
    }
    return "";
  }

  // ---- load zoo list + camera detail ----
  useEffect(() => {
    let canceled = false;

    async function load() {
      setLoading(true);
      setError("");
      setMessage("");

      try {
        // 1) โหลดรายการสวนสัตว์จาก API_2
        const resZoo = await fetch(API_ZOOS);
        if (!resZoo.ok) throw new Error(`Zoos HTTP ${resZoo.status}`);
        const zooJson = await resZoo.json();
        const zoos = Array.isArray(zooJson?.data) ? zooJson.data : (Array.isArray(zooJson) ? zooJson : []);
        const cleanZoos = zoos.filter((z) => z && z.id != null);
        if (!canceled) setZooList(cleanZoos);

        // 2) พยายามโหลดกล้องรายตัวจาก /cameras/:id (ถ้าโปรเจ็กต์มี)
        let cam = null;
        const resCamOne = await fetch(`${API_GET_CAMERA}/${encodeURIComponent(id)}`);
        if (resCamOne.ok) {
          const camOneJson = await resCamOne.json();
          // รองรับทั้งโครง {data:{...}} หรือ {...}
          cam = camOneJson?.data ?? camOneJson ?? null;
        } else {
          // ถ้าไม่มี endpoint รายตัว ให้ fallback ไปดึงทั้งหมดจาก Getcamera แล้ว find
          const resList = await fetch(API_LIST_CAMERAS);
          if (!resList.ok) throw new Error(`Cameras HTTP ${resList.status}`);
          const listJson = await resList.json();
          const cams = Array.isArray(listJson?.data) ? listJson.data : (Array.isArray(listJson) ? listJson : []);
          cam = cams.find((c) => String(c.id ?? c.camera_id ?? c.cameraId) === String(id));
        }

        if (!cam) throw new Error("ไม่พบข้อมูลกล้องตาม ID ที่ระบุ");

        // map ค่าเข้าฟอร์ม (มี fallback เผื่อชื่อคีย์ต่างกัน)
        const next = {
          ip_address: cam.ip_address ?? "",
          zoo_id: S(cam.zoo_id ?? ""),
          camera_position: cam.camera_position ?? "",
          animal_name: cam.animal_name ?? "",
          camera_url: cam.camera_url ?? "",
        };
        if (!canceled) setForm(next);
      } catch (e) {
        if (!canceled) setError(e.message || String(e));
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => { canceled = true; };
  }, [id]);

  // ---- submit ----
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ip_address: form.ip_address,
        zoo_id: Number(form.zoo_id),
        camera_position: form.camera_position,
        animal_name: form.animal_name,
        camera_url: form.camera_url,
      };

      const res = await fetch(`${API_UPDATE_CAMERA}/${encodeURIComponent(id)}`, {
        method: "POST", // หรือ "PUT"
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `POST /cameras/${id} HTTP ${res.status}`);
      }

      setMessage("อัปเดตข้อมูลกล้องสำเร็จ");
      // กลับไปหน้าก่อน (ออปชัน)
      setTimeout(() => navigate(-1), 600);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-200"
      >
        <h1 className="text-xl font-bold">แก้ไขข้อมูลกล้อง (ID: {id})</h1>

        {error && <div className="rounded-lg bg-red-50 text-red-700 p-2 text-sm">{error}</div>}
        {loading && <div className="text-gray-600 text-sm">กำลังโหลดข้อมูล...</div>}
        {message && <div className="rounded-lg bg-green-50 text-green-700 p-2 text-sm">{message}</div>}

        {/* IP */}
        <div>
          <label className="block text-sm font-medium mb-1">เลขที่ IP กล้อง</label>
          <input
            type="text"
            name="ip_address"
            value={form.ip_address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            autoComplete="off"
            required
          />
        </div>

        {/* เลือกสวนสัตว์ */}
        <div>
          <label className="block text-sm font-medium mb-1">เลือกสวนสัตว์</label>
          <select
            name="zoo_id"
            value={S(form.zoo_id)}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            disabled={loading || zooList.length === 0}
            required
          >
            <option value="">{loading ? "กำลังโหลดรายชื่อ..." : "— เลือกสวนสัตว์ —"}</option>
            {zooList.map((z) => (
              <option key={z.id} value={S(z.id)}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        {/* ตำแหน่งกล้อง */}
        <div>
          <label className="block text-sm font-medium mb-1">ตำแหน่งกล้อง</label>
          <input
            name="camera_position"
            value={form.camera_position}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            required
          />
        </div>

        {/* ชื่อสัตว์ */}
        <div>
          <label className="block text-sm font-medium mb-1">ชื่อสัตว์</label>
          <input
            name="animal_name"
            value={form.animal_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            required
          />
        </div>

        {/* URL กล้อง */}
        <div>
          <label className="block text-sm font-medium mb-1">URL กล้อง</label>
        <input
            type="url"
            name="camera_url"
            value={form.camera_url}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            required
            placeholder="http://example.com/stream"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || saving}
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50"
          >
            ย้อนกลับ
          </button>
        </div>
      </form>
    </div>
  );
}
