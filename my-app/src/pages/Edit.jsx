import { Link } from "react-router-dom";
import camera from "../assets/camera.jpg";
const cards = [
  { id: 1, name: "สวนสัตว์อุบลราชธานี", image: "../assets/camera.jpg" },
  { id: 2, name: "สวนสัตว์ขอนแก่น", image: "/images/khonkaen.jpg" },
  { id: 3, name: "สวนสัตว์เชียงใหม่", image: "/images/chiangmai.jpg" },
];

const Edit = () => {
  return (
    <div className="relative min-h-screen px-6 py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
        {cards.map((zoo) => (
          <Link
            key={zoo.id}
            to={`/zoo/${zoo.id}`}
            className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 overflow-hidden"
          >
            <img
              src={zoo.image}
              alt={zoo.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center text-white">
              <h2 className="font-semibold text-xl mb-1">{zoo.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Edit;
