import { useParams, Link } from "react-router-dom";
import { mockZoos } from "../pages/mockZooData";

export default function ZooDetail() {
  const { id } = useParams();
  const zoo = mockZoos.find((z) => z.id === Number(id));

  return (
    <section className="min-h-screen bg-black-100 px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="text-blue-400 hover:underline text-sm">
          ← กลับไปหน้าแรก
        </Link>
        <h1 className="text-3xl font-bold mb-6 text-center">{zoo.name}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {zoo.cameras.map((cam) => (
            <div
              key={cam.id}
              className="bg-white/10 rounded-xl p-4 shadow hover:scale-105 transition-transform duration-300"
            >
              <Link to={`/zoo/${zoo.id}/camera/${cam.id}`}>
              <img
                src={zoo.image2}
                alt={cam.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              </Link>
              <h2 className="font-semibold text-black/90">{cam.name}</h2>
              <p
                className={`text-sm font-bold ${
                  cam.status === "online" ? "text-green-400" : "text-red-400"
                }`}
              >
                <span className="text-black/80 mr-1">สถานะ:</span>
                {cam.status === "online" ? "กล้องทำงาน" : "ออฟไลน์"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
