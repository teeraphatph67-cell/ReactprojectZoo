import { useParams, Link } from "react-router-dom";
import { mockZoos } from "../pages/mockZooData";

export default function ZooDetail() {
  const { id } = useParams();
  const zoo = mockZoos.find((z) => z.id === Number(id));

  // if (!zoo) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <p className="text-gray-800 text-lg font-semibold">
  //         ❌ ไม่พบข้อมูลสวนสัตว์นี้
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* ปุ่มย้อนกลับ */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-block text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            ← กลับไปหน้าแรก
          </Link>
        </div>

        {/* ชื่อสวนสัตว์ */}
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          {zoo.name}
        </h1>

        {/* กล้องทั้งหมด */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {zoo.cameras.map((cam) => (
            <Link
              key={cam.id}
              to={`/zoo/${zoo.id}/camera/${cam.id}`}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300 overflow-hidden border border-gray-200"
            >
              <img
                src={zoo.image2}
                alt={cam.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-5">
                <h2 className="font-semibold text-gray-800 text-lg mb-2">
                   {zoo.name} :  {cam.name}
                </h2>
                <p
                  className={`text-sm font-semibold ${
                    cam.status === "online" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  สถานะ:{" "}
                  {cam.status === "online" ? "🟢 กล้องทำงาน" : "🔴 ออฟไลน์"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
