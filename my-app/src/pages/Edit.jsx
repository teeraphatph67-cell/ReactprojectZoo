import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Edit = () => {
  const [cards, setCards] = useState([]); // เก็บข้อมูลสวนสัตว์
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost/lumen-api/public/api/v1/Getzoo")
      .then((res) => res.json())
      .then((result) => setCards(result?.data ?? result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>กำลังโหลดสวนสัตว์...</p>;
  if (error) return <p className="text-red-500">❌ {error}</p>;

  return (
    <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
      {cards.map((zoo) => (
        <Link
          key={zoo.id}
          to={`/zoo/${zoo.id}`}
          className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 overflow-hidden"
        >
          <img
            src={zoo.image}
            alt={zoo.name_zoo}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 text-center text-black/90">
            <h2 className="font-semibold text-xl mb-1">{zoo.name_zoo}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Edit;
