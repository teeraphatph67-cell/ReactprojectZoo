import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout/MainLayout.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/register.jsx";
import Edit from "./pages/Edit.jsx";
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

        {/* หน้า dashboard / admin ใช้ layout */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/"element={<Hero />} />
          <Route path="edit" element={<Edit />} />
          <Route path="AddCamera" element={<AddCamera />} />
          <Route path="zoo/:id" element={<ZooDetail />} />
          <Route path="zoo/:zooId/camera/:cameraId" element={<CameraDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
