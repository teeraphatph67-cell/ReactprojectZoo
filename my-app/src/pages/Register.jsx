// src/pages/register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "กรุณากรอกชื่อ";
    if (!form.email.trim()) err.email = "กรุณากรอกอีเมล";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "อีเมลไม่ถูกต้อง";
    if (form.password.length < 6) err.password = "รหัสผ่านอย่างน้อย 6 ตัวอักษร";
    if (form.password !== form.confirm) err.confirm = "รหัสผ่านไม่ตรงกัน";
    if (!form.agree) err.agree = "กรุณายอมรับเงื่อนไขการใช้งาน";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    if (!validate()) return;

    try {
      setLoading(true);
      // 🔧 เปลี่ยน URL นี้เป็น API ของคุณ (Lumen/Django/ฯลฯ)
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerMsg(data?.message || "สมัครสมาชิกไม่สำเร็จ");
      } else {
        setServerMsg("สมัครสมาชิกสำเร็จ! กำลังพาไปหน้า Login…");
        // ✅ สำเร็จแล้วพาไปหน้า Login
        setTimeout(() => navigate("/login"), 800);
      }
    } catch (err) {
      setServerMsg("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-slate-400 mt-1">
            ลงทะเบียนเพื่อเริ่มต้นใช้งานเว็บของคุณ
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10"
        >
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm mb-1">ชื่อ - นามสกุล</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              type="text"
              placeholder="เช่น Frame M."
              className={`w-full rounded-lg bg-white/10 border ${
                errors.name ? "border-red-500" : "border-white/20"
              } px-3 py-2 outline-none focus:border-blue-400`}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1">อีเมล</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              placeholder="you@example.com"
              className={`w-full rounded-lg bg-white/10 border ${
                errors.email ? "border-red-500" : "border-white/20"
              } px-3 py-2 outline-none focus:border-blue-400`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm mb-1">รหัสผ่าน</label>
            <div
              className={`flex items-stretch rounded-lg bg-white/10 border ${
                errors.password ? "border-red-500" : "border-white/20"
              } focus-within:border-blue-400`}
            >
              <input
                name="password"
                value={form.password}
                onChange={onChange}
                type={showPwd ? "text" : "password"}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full bg-transparent px-3 py-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="px-3 text-slate-300 hover:text-white"
                title={showPwd ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm */}
          <div className="mb-4">
            <label className="block text-sm mb-1">ยืนยันรหัสผ่าน</label>
            <input
              name="confirm"
              value={form.confirm}
              onChange={onChange}
              type="password"
              placeholder="พิมพ์ซ้ำอีกครั้ง"
              className={`w-full rounded-lg bg-white/10 border ${
                errors.confirm ? "border-red-500" : "border-white/20"
              } px-3 py-2 outline-none focus:border-blue-400`}
            />
            {errors.confirm && (
              <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>
            )}
          </div>

          {/* Terms */}
          <div className="mb-5 flex items-start gap-2">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={form.agree}
              onChange={onChange}
              className="mt-1 h-4 w-4 rounded border-white/30 bg-white/10"
            />
            <label htmlFor="agree" className="text-sm text-slate-300">
              ฉันยอมรับ{" "}
              <a href="#" className="text-blue-400 hover:underline">
                ข้อกำหนดการใช้งาน
              </a>{" "}
              และ{" "}
              <a href="#" className="text-blue-400 hover:underline">
                นโยบายความเป็นส่วนตัว
              </a>
            </label>
          </div>
          {errors.agree && (
            <p className="text-red-400 text-xs -mt-3 mb-3">{errors.agree}</p>
          )}

          {/* Server message */}
          {serverMsg && (
            <div className="mb-4 text-sm text-center text-slate-200 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
              {serverMsg}
            </div>
          )}

          {/* Actions */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 py-2.5 font-medium transition"
          >
            {loading ? "กำลังสมัครสมาชิก..." : "สร้างบัญชี"}
          </button>

          <p className="text-center text-sm text-slate-300 mt-4">
            มีบัญชีอยู่แล้ว?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          © {new Date().getFullYear()} — Your Brand
        </p>
      </div>
    </div>
  );
}
