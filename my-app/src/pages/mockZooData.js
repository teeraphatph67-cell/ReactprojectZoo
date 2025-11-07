// src/data/mockZooData.js
import ubuzoo from "../assets/ubuzoo.webp";
import cameraImg from "../assets/camera.jpg";

export const mockZoos = [
  {
    id: 1,
    name: "สวนสัตว์เปิดเขาเขียว",
    image: ubuzoo,
    image2: cameraImg,
    cameras: [
      { id: 1, name: "กล้องโซนยีราฟ", status: "online" },
      { id: 2, name: "กล้องโซนช้าง", status: "offline" },
      { id: 3, name: "กล้องโซนหมี", status: "online" },
    ],
  },
  {
    id: 2,
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
  {
    id: 4,
    name: "สวนสัตว์นครราชสีมา",
    image: ubuzoo,
    image2: cameraImg,
    cameras: [
      { id: 1, name: "กล้องโซนช้างป่า", status: "online" },
      { id: 2, name: "กล้องโซนเสือโคร่ง", status: "offline" },
    ],
  },
  {
    id: 5,
    name: "สวนสัตว์ขอนแก่น",
    image: ubuzoo,
    image2: cameraImg,
    cameras: [
      { id: 1, name: "กล้องโซนแพนด้า", status: "online" },
      { id: 2, name: "กล้องโซนหมีขาว", status: "offline" },
    ],
  },
  {
    id: 6,
    name: "สวนสัตว์สงขลา",
    image: ubuzoo,
    image2: cameraImg,
    cameras: [
      { id: 1, name: "กล้องโซนเสือ", status: "online" },
      { id: 2, name: "กล้องโซนลิง", status: "offline" },
      { id: 3, name: "กล้องโซนเต่า", status: "online" },
    ],
  },
];
