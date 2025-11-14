import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// รูปสวนสัตว์
import ChiangMaiZooImg from "../assets/chiangmaizoo.png";
import KhaoKheowZooImg from "../assets/khaokheowzoo.png";
import KhonKaenZooImg from "../assets/khonkaenzoo.png";
import NakhonRatchasimaZooImg from "../assets/nakhonratchasimazoo.png";
import SongkhlaZooImg from "../assets/songkhlazoo.png";
import UbonZooImg from "../assets/ubonratchathanizoo.png";
import logo_addpay from "../assets/logo_addpay.webp";
import zoo_of_thailand from "../assets/zoo-0.png";

const zooImages = {
  1: KhaoKheowZooImg,
  2: ChiangMaiZooImg,
  3: NakhonRatchasimaZooImg,
  4: UbonZooImg,
  5: KhonKaenZooImg,
  6: SongkhlaZooImg,
  7: zoo_of_thailand,
  8: logo_addpay,
};

const getZooImage = (zooId) => zooImages[zooId] || ChiangMaiZooImg;

const API_ZOOS = "https://addpay.net/api/v1/zoo/e-member/all-zoo";
const API_CAMERAS = "http://localhost/lumen-api/public/api/v1/Getcamera";

export default function ZooAndCameraDetail() {
  const { id } = useParams();
  const apiKey = localStorage.getItem("api_key");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.roles?.some((r) => r.name === "admin");

  const [zoo, setZoo] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [loadingCams, setLoadingCams] = useState(true);
  const [errCams, setErrCams] = useState("");

  const [zoosList, setZoosList] = useState([]);
  const [loadingZoos, setLoadingZoos] = useState(true);
  const [errZoos, setErrZoos] = useState("");

  const [popupCamera, setPopupCamera] = useState(null);
  const [editCamera, setEditCamera] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // โหลดกล้องและข้อมูลสวนสัตว์เฉพาะที่ id
  useEffect(() => {
    const loadCamsAndZoo = async () => {
      setLoadingCams(true);
      setErrCams("");
      try {
        const [resZoo, resCam] = await Promise.all([
          fetch(API_ZOOS, {
            headers: { Authorization: `Bearer ${apiKey}` },
          }),
          fetch(API_CAMERAS),
        ]);

        if (!resZoo.ok) throw new Error(`Zoo HTTP ${resZoo.status}`);
        if (!resCam.ok) throw new Error(`Camera HTTP ${resCam.status}`);

        const zooJson = await resZoo.json();
        const camJson = await resCam.json();

        const zoos = Array.isArray(zooJson?.data)
          ? zooJson.data
          : Array.isArray(zooJson)
          ? zooJson
          : [];
        const cams = Array.isArray(camJson?.data)
          ? camJson.data
          : Array.isArray(camJson)
          ? camJson
          : [];

        setZoo(zoos.find((z) => String(z.id) === String(id)) || null);
        setCameras(cams.filter((c) => String(c.zoo_id) === String(id)));
      } catch (e) {
        setErrCams(e.message || String(e));
      } finally {
        setLoadingCams(false);
      }
    };
    loadCamsAndZoo();
  }, [id, apiKey]);

  // โหลดรายการสวนสัตว์สำหรับ modal <select>
  useEffect(() => {
    const loadZoos = async () => {
      setLoadingZoos(true);
      setErrZoos("");
      try {
        const res = await fetch(API_ZOOS, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!res.ok) throw new Error(`Zoo HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : [];
        setZoosList(list);
      } catch (e) {
        setErrZoos(e.message || String(e));
      } finally {
        setLoadingZoos(false);
      }
    };
    loadZoos();
  }, [apiKey]);

  if (loadingCams)
    return (
      <p className="text-gray-600 p-4 text-center animate-pulse">
        ⏳ กำลังโหลดข้อมูล...
      </p>
    );

  if (errCams)
    return (
      <p className="text-red-600 p-4 text-center">
        ❌ เกิดข้อผิดพลาด: {errCams}
      </p>
    );

  if (!zoo)
    return (
      <p className="text-gray-600 p-4 text-center">ไม่พบข้อมูลสวนสัตว์นี้</p>
    );

  const zooImage = getZooImage(zoo.id);

  return (
    <main className="pt-20 px-6 pb-10 max-w-7xl mx-auto">
      {/* Zoo Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={zooImage}
            alt={zoo.name}
            className="w-24 h-24 object-cover rounded-3xl border-2 border-blue-300 shadow-md"
          />
          <h1 className="text-4xl font-extrabold text-blue-700 flex items-center gap-2">
            <span className="material-icons text-blue-500">photo_camera</span>
            {zoo.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to="/Managecamera">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition flex items-center gap-2">
              <span className="material-icons">edit</span> จัดการกล้อง
            </button>
          </Link>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <span className="material-icons">add_a_photo</span> เพิ่มสัตว์
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-green-50 text-green-900 rounded-xl p-5 flex items-center gap-4 shadow-lg w-full sm:w-auto">
          <span className="material-icons text-4xl">pets</span>
          <div>
            <p className="text-sm font-medium">จำนวนสัตว์ทั้งหมด</p>
            <p className="text-2xl font-bold">{cameras.length}</p>
          </div>
        </div>
        <div className="bg-blue-50 text-blue-900 rounded-xl p-5 flex items-center gap-4 shadow-lg w-full sm:w-auto">
          <span className="material-icons">videocam</span>
          <div>
            <p className="text-sm font-medium">กล้องออนไลน์</p>
            <p className="text-2xl font-bold">
              {cameras.filter((cam) => cam.online).length}/{cameras.length}
            </p>
          </div>
        </div>
      </div>

      {/* Cameras Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-10">
            ไม่มีกล้องในสวนสัตว์นี้
          </p>
        ) : (
          cameras.map((cam, idx) => (
            <div
              key={cam.id || idx}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
            >
              <div className="relative group">
                <img
                  src={
                    cam.animal_image ||
                    "https://dummyimage.com/400x200/cccccc/000000&text=Animal"
                  }
                  alt={cam.animal_name || cam.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {isAdmin && (
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    title="คลิกเพื่ออัปโหลดรูป"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const updatedCams = [...cameras];
                        updatedCams[idx] = {
                          ...updatedCams[idx],
                          animal_image: URL.createObjectURL(file),
                          _file: file,
                        };
                        setCameras(updatedCams);
                      }
                    }}
                  />
                )}
              </div>

              <div className="p-5 flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <span className="material-icons text-blue-500">pets</span>
                  {cam.animal_name || cam.name}
                </h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <span className="material-icons text-gray-400 text-base">
                    category
                  </span>
                  ประเภท: {cam.animal_type || "-"}
                </p>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <span className="material-icons text-gray-400 text-base">
                    place
                  </span>
                  ตำแหน่ง: {cam.camera_position || "-"}
                </p>

                {isAdmin && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => setPopupCamera(cam)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-xl shadow-md hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm"
                    >
                      <span className="material-icons">videocam</span> ดูกล้อง
                    </button>
                    <button
                      onClick={() => setEditCamera(cam)}
                      className="flex-1 bg-yellow-500 text-white py-2 rounded-xl shadow-md hover:bg-yellow-600 transition flex items-center justify-center gap-2 text-sm"
                    >
                      <span className="material-icons">edit</span> แก้ไข
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal เพิ่มสัตว์ */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <h2 className="text-2xl font-bold">จัดการข้อมูลสัตว์</h2>
              <p className="text-blue-100 mt-1">
                กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง
              </p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <h2 className="text-xl font-bold mb-4">เพิ่ม/แก้ไขสัตว์</h2>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1">
                    สวนสัตว์ <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="zoo_id"
                    required
                    className="w-full border rounded px-3 py-2"
                    disabled={loadingZoos}
                  >
                    <option value="">
                      {loadingZoos
                        ? "กำลังโหลดรายชื่อสวนสัตว์..."
                        : "เลือกสวนสัตว์"}
                    </option>
                    {!loadingZoos &&
                      zoosList.map((zoo) => (
                        <option key={zoo.id} value={zoo.id}>
                          {zoo.name}
                        </option>
                      ))}
                  </select>
                  {errZoos && (
                    <p className="text-red-600 text-sm mt-1">❌ {errZoos}</p>
                  )}
                </div>

                {/* ฟิลด์อื่น ๆ เหมือนเดิม */}
                <div>
                  <label className="text-sm font-medium mb-1">สายพันธุ์</label>
                  <span className="text-red-600">*</span>
                  <input
                    required
                    placeholder="เช่น ฮิปโปแคระ, คาปิบาร่า"
                    className="w-full border rounded px-3 py-2"
                    type="text"
                    name="species"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1">ชื่อสัตว์</label>
                  <span className="text-red-600">*</span>
                  <input
                    required
                    placeholder="เช่น หมูเด้ง, คาปิบาร่า"
                    className="w-full border rounded px-3 py-2"
                    type="text"
                    name="name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    สถานที่ตั้ง
                  </label>
                  <input
                    placeholder="เช่น ส่วนแสดงใจกลางสวน"
                    className="w-full border rounded px-3 py-2"
                    type="text"
                    name="location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    ประเภทสัตว์
                  </label>
                  <select
                    name="is_featured"
                    className="w-full border rounded px-3 py-2"
                    defaultValue="สัตว์เด่น"
                  >
                    <option value="สัตว์เด่น">สัตว์เด่น</option>
                    <option value="สัตว์ทั่วไป">สัตว์ทั่วไป</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    อัปเดต
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                    onClick={() => setShowModal(false)}
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Popups ดูกล้องและแก้ไขกล้อง อยู่เดิม */}
      {/* ... โค้ด popupCamera และ editCamera เหมือนเดิม ... */}
    </main>
  );
}
