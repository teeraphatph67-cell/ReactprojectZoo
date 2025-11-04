// src/components/Hero/Hero.jsx
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen">
      {/* พื้นหลังไล่สี + แสงกลม ๆ */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-200">
              🚀 Ready to build faster
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Test
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                 React + Tailwind
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
              รายละเอียด
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-300"
              >
                เริ่มต้นใช้งานฟรี
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/30"
              >
                เข้าสู่ระบบ
              </Link>
            </div>

            {/* จุดเด่นสั้น ๆ */}
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              <li>✅ Component-based</li>
              <li>✅ Responsive</li>
              <li>✅ ปรับแต่งได้เร็ว</li>
            </ul>
          </div>

          {/* ภาพ/การ์ดตัวอย่าง */}
          <div className="relative">
            <div className="mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl">
              {/* กล่องแทนภาพตัวอย่าง UI */}
              <div className="h-full w-full p-5">
                <div className="mb-4 h-6 w-40 rounded-md bg-white/20" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 h-32 rounded-xl bg-white/10" />
                  <div className="h-32 rounded-xl bg-white/10" />
                  <div className="h-20 rounded-xl bg-white/10" />
                  <div className="h-20 rounded-xl bg-white/10" />
                  <div className="h-20 rounded-xl bg-white/10" />
                </div>
                <div className="mt-5 h-10 w-1/3 rounded-lg bg-blue-500/60" />
              </div>
            </div>

            {/* ป้ายมุมสวย ๆ */}
            <div className="absolute -right-3 -top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow">
              New
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
