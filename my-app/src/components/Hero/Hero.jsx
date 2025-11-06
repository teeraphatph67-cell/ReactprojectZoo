// src/pages/Hero.jsx
import { Link } from "react-router-dom";
import { mockZoos } from "../../pages/mockZooData";

export default function Hero() {
  return (
    <section className="pt-20 px-6 pb-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-black text-center mb-10 drop-shadow-sm">
        ระบบกล้องสวนสัตว์
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {mockZoos.map((zoo) => (
          <Link
            key={zoo.id}
            to={`/zoo/${zoo.id}`}
            className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <img
              src={zoo.image}
              alt={zoo.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 text-center">
              <h2 className="font-semibold text-xl text-gray-800 mb-1">
                {zoo.name}
              </h2>
              <p className="text-gray-500 text-sm">
                กล้องทั้งหมด {zoo.cameras.length} ตัว
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
