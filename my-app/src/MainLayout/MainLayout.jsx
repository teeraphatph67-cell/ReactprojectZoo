import Navbar from "../components/Navbar/Navbar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function MainLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const apiKey = localStorage.getItem("api_key");

  useEffect(() => {
    // ถ้าไม่มี user หรือ apiKey redirect ไป login
    if (!user || !apiKey) {
      navigate("/login");
    }
  }, [user, apiKey, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="pt-20 px-6 pb-10 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
