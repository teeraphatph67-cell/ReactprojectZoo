import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout/MainLayout.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Edit from "./pages/Edit.jsx";
import Project from "./pages/Project.jsx";
import Addzoo from "./pages/Addzoo.jsx";
import ZooUbu from './pages/Zooubu.jsx'
import AddCamera from "./pages/AddCamera.jsx";
import ZooDetail from "./pages/ZooDetail.jsx";
import CameraDetail from "./pages/CameraDetail.jsx";

function App() {
  return (
    
<BrowserRouter>
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Hero />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="edit" element={<Edit />} />
      <Route path="project" element={<Project />} />
      <Route path="Addzoo" element={<Addzoo />} />
      <Route path="zooubu" element={<ZooUbu />} />
      <Route path="AddCamera" element={<AddCamera />} />
      <Route path="zoo/:id" element={<ZooDetail />} />
      <Route path="zoo/:zooId/camera/:cameraId" element={<CameraDetail />} />
    </Route>
  </Routes>
</BrowserRouter>
  );
}

export default App;
