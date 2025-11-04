import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar.jsx'
import Hero from './components/Hero/Hero.jsx'
import './App.css'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Team from "./pages/Team.jsx";
import Project from "./pages/Project.jsx";
import Calendar from "./pages/Calendar.jsx";


function App() {
  

  return (
    
    <>
     <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Team" element={<Team />} />
        <Route path="/Project" element={<Project />} />
        <Route path="/Calendar" element={<Calendar />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
