import { useEffect, useState } from "react";

export default function AddCamera() {
  const [form, setForm] = useState({
    ip_address: "",
    zoo_id: "",              // เลือกจาก <select>
    camera_position: "",
    animal_name: "",
    camera_url: "",
  });

  const [zooList, setZooList] = useState([]);   // รายการสวนสัตว์จาก /Getzoo
  const [message, setMessage] = useState(null); // ข้อความสำเร็จ
  const [error, setError] = useState(null);     // ข้อความผิดพลาดรวม
  const [fieldErrors, setFieldErrors] = useState({}); // error รายช่อง
  const [loading, setLoading] = useState(false);      // กดบันทึก
  const [loadingZoo, setLoadingZoo] = useState(true); // โหลดรายการสวนสัตว์

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  function validateClient() {
    const errs = {};
    // IP
    const ip = form.ip_address.trim();
    const ipRegex =
      /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    if (!ip) errs.ip_address = "กรุณากรอก IP";
    else if (!ipRegex.test(ip)) errs.ip_address = "รูปแบบ IP ไม่ถูกต้อง (เช่น 192.168.1.10)";

    // ต้องเลือกสวนสัตว์
    if (!String(form.zoo_id).trim()) errs.zoo_id = "กรุณาเลือกสวนสัตว์";

    if (!form.camera_position.trim()) errs.camera_position = "กรุณากรอกตำแหน่งกล้อง";
    if (!form.animal_name.trim()) errs.animal_name = "กรุณากรอกชื่อสัตว์";

    // URL
    try {
      const u = new URL(form.camera_url);
      if (!/^https?:$/.test(u.protocol)) throw new Error();
    } catch {
      errs.camera_url = "URL ต้องขึ้นต้นด้วย http:// หรือ https://";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // โหลดรายการสวนสัตว์
  useEffect(() => {
    setLoadingZoo(true);
    setError(null);
    fetch("http://localhost/lumen-api/public/api/v1/Getzoo", {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((result) => {
        const payload = result?.data ?? result; // รองรับ {data:[...]} หรือ [...]
        setZooList(Array.isArray(payload) ? payload : []);
      })
      .catch((e) => setError(`โหลดรายชื่อสวนสัตว์ไม่สำเร็จ: ${e.message}`))
      .finally(() => setLoadingZoo(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!validateClient()) {
      setLoading(false);
      return;
    }

    // หา zoo_name จาก zoo_id (ถ้าต้องส่งไปด้วย)
    const selected = zooList.find((z) => String(z.id) === String(form.zoo_id));
    const zoo_name = selected?.name_zoo ?? "";

    const payload = {
      ip_address: form.ip_address,
      zoo_id: Number(form.zoo_id),     // สำคัญ: แปลงเป็นตัวเลข
      zoo_name,                        // เผื่อ backend ต้องการชื่อด้วย
      camera_position: form.camera_position,
      animal_name: form.animal_name,
      camera_url: form.camera_url,
    };

    console.log("payload to /Addcamera:", payload);

    fetch("http://localhost/lumen-api/public/api/v1/Addcamera", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result?.success) {
          setMessage(result?.message || "บันทึกสำเร็จ");
          // ล้างฟอร์ม
          setForm({
            ip_address: "",
            zoo_id: "",
            camera_position: "",
            animal_name: "",
            camera_url: "",
          });
        } else {
          setError(result?.message || "บันทึกไม่สำเร็จ");
        }
      })
      .catch((err) => setError(`เกิดข้อผิดพลาด: ${err.message}`))
      .finally(() => setLoading(false));
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-200"
      >
        <h1 className="text-xl font-bold text-center mb-4">เพิ่มข้อมูลกล้อง</h1>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}

        {/* IP */}
        <div>
          <label className="block text-sm font-medium mb-1">เลขที่ IP กล้อง</label>
          <input
            type="text"
            name="ip_address"
            value={form.ip_address}
            onChange={handleChange}
            className={inputClass}
            autoComplete="off"
            required
          />
          {fieldErrors.ip_address && <div className={errorClass}>{fieldErrors.ip_address}</div>}
        </div>

        {/* เลือกสวนสัตว์ */}
        <div>
          <label className="block text-sm font-medium mb-1">เลือกสวนสัตว์</label>
          <select
            name="zoo_id"
            value={form.zoo_id}
            onChange={handleChange}
            className={inputClass}
            disabled={loadingZoo}
            required
          >
            <option value="">{loadingZoo ? "กำลังโหลดรายชื่อ..." : "— เลือกสวนสัตว์ —"}</option>
            {zooList.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name_zoo} {z.zooprovince ? `(${z.zooprovince})` : ""}
              </option>
            ))}
          </select>
          {fieldErrors.zoo_id && <div className={errorClass}>{fieldErrors.zoo_id}</div>}
        </div>

        {/* ตำแหน่งกล้อง */}
        <div>
          <label className="block text-sm font-medium mb-1">ตำแหน่งกล้อง</label>
          <input
            name="camera_position"
            value={form.camera_position}
            onChange={handleChange}
            className={inputClass}
            required
          />
          {fieldErrors.camera_position && <div className={errorClass}>{fieldErrors.camera_position}</div>}
        </div>

        {/* ชื่อสัตว์ */}
        <div>
          <label className="block text-sm font-medium mb-1">ชื่อสัตว์</label>
          <input
            name="animal_name"
            value={form.animal_name}
            onChange={handleChange}
            className={inputClass}
            required
          />
          {fieldErrors.animal_name && <div className={errorClass}>{fieldErrors.animal_name}</div>}
        </div>

        {/* URL กล้อง */}
        <div>
          <label className="block text-sm font-medium mb-1">URL กล้อง</label>
          <input
            type="url"
            name="camera_url"
            value={form.camera_url}
            onChange={handleChange}
            className={inputClass}
            required
            placeholder="http://example.com/stream"
          />
          {fieldErrors.camera_url && <div className={errorClass}>{fieldErrors.camera_url}</div>}
        </div>

        {/* ปุ่มบันทึก */}
        <button
          type="submit"
          disabled={loading || loadingZoo || !form.zoo_id}
          className="w-full bg-gray-900 text-white rounded-lg py-2 font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </form>
    </div>
  );
}
