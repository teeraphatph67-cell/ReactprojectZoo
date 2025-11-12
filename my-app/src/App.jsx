import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout/MainLayout.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/register.jsx";
import Edit from "./pages/Edit.jsx";
import CheckApi from "./pages/CheckApi.jsx";
import AddCamera from "./pages/AddCamera.jsx";
import ZooDetail from "./pages/ZooDetail.jsx";
import CameraDetail from "./pages/CameraDetail.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* หน้า login / register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/CameraDetail" element={<CameraDetail />} />
        {/* หน้า dashboard / admin ใช้ layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Hero />} /> {/* ใช้ index แทน path="/" */}
          <Route path="edit" element={<Edit />} />
          <Route path="CheckApi" element={<CheckApi />} />
          <Route path="AddCamera" element={<AddCamera />} />
          <Route path="zoo/:id" element={<ZooDetail />} />
          <Route path="zoo/:zooId/camera" element={<CameraDetail />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
