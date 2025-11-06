import Navbar from "../components/Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100 via-slate-800 to-slate-900 text-red">
      {/* Navbar ด้านบน */}
      <Navbar />
      <main className="pt-20 px-6 pb-10 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}