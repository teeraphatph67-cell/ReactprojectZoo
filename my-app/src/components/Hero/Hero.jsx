import { Link } from "react-router-dom";
import ubuzoo from "../../assets/ubuzoo.webp";

const cards = [
  { id: 1, name: "BUB ZOO", image: ubuzoo },
  // { id: 2, name: "test", image: "#" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen px-6 py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {[
        { top: "-top-24 -left-24", color: "bg-blue-500/30 h-80 w-80" },
        { top: "-bottom-24 -right-24", color: "bg-indigo-500/30 h-96 w-96" },
      ].map((b, i) => (
        <div
          key={i}
          className={`absolute ${b.top} ${b.color} rounded-full blur-3xl pointer-events-none`}
        />
      ))}

      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
        {cards.map((c) => (
          <div
            key={c.id}
            className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <Link to="/ubu">
              <img
                src={c.image} //รูป
                alt={c.name} //=ชื่อ
                className="w-full h-32 object-cover rounded-lg"
              />
            </Link>
            <p className="mt-2 text-white font-semibold">{c.name}</p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap items-center gap-4 z-50">
        {[
          {
            to: "/register",
            text: "เริ่มต้นใช้งานฟรี",
            style: "bg-blue-600 hover:bg-blue-500 text-white ring-blue-300",
          },
          {
            to: "/login",
            text: "เข้าสู่ระบบ",
            style:
              "border border-white/20 bg-white/5 hover:bg-white/10 text-slate-100 ring-white/30",
          },
        ].map((btn, i) => (
          <Link
            key={i}
            to={btn.to}
            className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold shadow-lg focus:outline-none focus:ring-2 ${btn.style}`}
          >
            {btn.text}
          </Link>
        ))}
      </div>
    </section>
  );
}
