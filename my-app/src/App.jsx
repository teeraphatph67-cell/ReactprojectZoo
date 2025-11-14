import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout/MainLayout.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Login from "./pages/Login.jsx";
import Edit from "./pages/Edit.jsx";
import AddCamera from "./pages/AddCamera.jsx";
import ZooDetail from "./pages/ZooDetail.jsx";
import CameraDetail from "./pages/CameraDetail.jsx";
import EditCamera from "./pages/EditCamera.jsx";
import Managecamera from "./pages/Managecamera.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* หน้า login / register */}
        <Route path="/login" element={<Login />} />

        
        
        {/* หน้า dashboard / admin ใช้ layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Hero />} /> {/* ใช้ index แทน path="/" */}
          <Route path="edit" element={<Edit />} />
          <Route path="AddCamera" element={<AddCamera />} />
          <Route path="zoo/:id" element={<ZooDetail />} />
          <Route path="zoo/:zooId/camera" element={<CameraDetail />} />
          <Route path="/edit-camera/:id" element={<EditCamera />} />
          <Route path="/CameraDetail" element={<CameraDetail />} />
          <Route path="/Managecamera" element={<Managecamera />} />
            
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
