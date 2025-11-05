import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero/Hero.jsx'
import './App.css'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Edit from "./pages/Edit.jsx";
import Project from "./pages/Project.jsx";
import Calendar from "./pages/Calendar.jsx";
import Ubu from "./pages/ubu.jsx";
import ZooUbu from './pages/Zooubu.jsx'
import AddCamera from "./pages/AddCamera.jsx";


function App() {
  

  return (
    
    <>
    
     <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Edit" element={<Edit />} />
        <Route path="/Project" element={<Project />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/ubu" element={<Ubu/>} />
        <Route path="/ZooUbu" element={<ZooUbu />} />
        <Route path="/AddCamera" element={<AddCamera />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
