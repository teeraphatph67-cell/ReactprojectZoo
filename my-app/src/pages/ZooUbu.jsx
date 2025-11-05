import React from 'react'
import { Link } from "react-router-dom";
import ubuzoo from "../assets/ubuzoo.webp";

const cards = [
  { id: 1, name: "Camara1-คาปิบาร่า", image: ubuzoo },
  { id: 1, name: "Camara2-หมูเด้ง", image: ubuzoo },


  // { id: 2, name: "test", image: "#" },
];


const ZooUbu = () => {
  return (
 <div class="relative min-h-screen px-6 py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
        {cards.map((c) => (
          <div
            key={c.id}
            className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <Link to="#">
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
 </div>
  )
}

export default ZooUbu
