import { useState, useEffect } from 'react'
import Hero from '../components/Hero/Hero';

const Addzoo = () => {

  const [zooData, setZooData] = useState({
    name_zoo: "",
    zooprovince: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setZooData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "name_zoo": zooData.name_zoo,
      "zooprovince": zooData.zooprovince
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost/lumen-api/public/api/v1/Addzoo", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success === true) {
          alert(result.message)
        } else {
          alert(result.message)
        }
      })
      .catch((error) => console.error(error));
  }
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          เพิ่มข้อมูลสวนสัตว์
        </h2>

        {/* ชื่อสวนสัตว์ */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            ชื่อสวนสัตว์
          </label>
          <input
            type="text"
            name="name_zoo"
            value={zooData.name_zoo}
            onChange={handleChange}
            placeholder="เช่น สวนสัตว์อุบลราชธานี"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* จังหวัด */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            จังหวัด
          </label>
          <input
            type="text"
            name="zooprovince"
            value={zooData.zooprovince}
            onChange={handleChange}
            placeholder="เช่น อุบลราชธานี"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* ปุ่มบันทึก */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            บันทึกข้อมูล
          </button>
        </div>
      </form>




    </>

  )
}

export default Addzoo