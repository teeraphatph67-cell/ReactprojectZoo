// src/data/mockZooData.js
import ubuzoo from "../assets/ubuzoo.webp";
import cameraImg from "../assets/camera.jpg";


export const mockZoos = [
  {
    id: 1,
    name: "สวนสัตว์อุบลราชธานี",
    image: ubuzoo,
    image2: cameraImg,
    cameras: [
      { id: 1, name: "กล้องโซนช้าง", status: "online" },
      { id: 2, name: "กล้องโซนสิงโต", status: "online" },
      { id: 3, name: "กล้องโซนยีราฟ", status: "offline" },
    ],
  },
  {
    id: 2,
    name: "สวนสัตว์โคราช",
    image: ubuzoo,
    image2: cameraImg,
    cameras: [
      { id: 1, name: "กล้องโซนแพนด้า", status: "online" },
      { id: 2, name: "กล้องโซนหมีขาว", status: "offline" },
    ],
  },
  {
    id: 3,
    name: "สวนสัตว์เชียงใหม่",
    image: ubuzoo,
    image2: cameraImg,
    cameras: [
      { id: 1, name: "กล้องโซนลิง", status: "online" },
      { id: 2, name: "กล้องโซนเสือ", status: "online" },
      { id: 3, name: "กล้องโซนแพะ", status: "offline" },
      { id: 4, name: "กล้องโซนเต่า", status: "online" },
    ],
  },
  
//   {
//   id: 5,
//   name: "กล้องโซนช้าง 1",
//   image: "https://example.com/elephant-cam.jpg",
//   status: "online",
//   zone: "โซนช้าง",
//   resolution: "1920x1080 (Full HD)",
//   lastUpdate: "09:45 น.",
//   recording: true
// }

];
