// src/pages/mockZooData.js
import chiangmaizoo from "../assets/chiangmaizoo.png"
import khaokheowzoo from "../assets/khaokheowzoo.png"
import khonkaenzoo from "../assets/khonkaenzoo.png"
import nakhonratchasimazooo from "../assets/nakhonratchasimazoo.png"
import songkhlazoo from "../assets/songkhlazoo.png"
import ubonratchathanizoo from "../assets/ubonratchathanizoo.png"
export const mockZoos = [
  {
    id: 1,
    name: "Chiang Mai Zoo",
    location: "Chiang Mai",
    image: chiangmaizoo ,
    cameras: [
      { id: 1, name: "Elephant Zone", status: "online", streamUrl: "https://example.com/chiangmai1" },
      { id: 2, name: "Panda House", status: "offline", streamUrl: "https://example.com/chiangmai2" },
    ],
  },
  {
    id: 2,
    name: "Khon Kaen Zoo",
    location: "Khon Kaen",
    image: khonkaenzoo,
    cameras: [
      { id: 1, name: "Tiger Zone", status: "online", streamUrl: "https://example.com/khonkaen1" },
    ],
  },
  {
    id: 3,
    name: "Nakhon Ratchasima Zoo",
    location: "Nakhon Ratchasima",
    image: nakhonratchasimazooo,
    cameras: [
      { id: 1, name: "Hippo Pool", status: "online", streamUrl: "https://example.com/korat1" },
    ],
  },
  {
    id: 4,
    name: "Ubon Ratchathani Zoo",
    location: "Ubon Ratchathani",
    image: ubonratchathanizoo,
    cameras: [
      { id: 1, name: "Lion Enclosure", status: "online", streamUrl: "https://example.com/ubon1" },
       { id: 1, name: "Lion Enclosure", status: "online", streamUrl: "https://example.com/ubon1" },
        { id: 1, name: "Lion Enclosure", status: "online", streamUrl: "https://example.com/ubon1" },
         { id: 1, name: "Lion Enclosure", status: "online", streamUrl: "https://example.com/ubon1" },
          { id: 1, name: "Lion Enclosure", status: "online", streamUrl: "https://example.com/ubon1" },
           { id: 1, name: "Lion Enclosure", status: "online", streamUrl: "https://example.com/ubon1" },
           
    ],
  },
  {
    id: 5,
    name: "Songkhla Zoo",
    location: "Songkhla",
    image: songkhlazoo,
    cameras: [
      { id: 1, name: "Bird Dome", status: "offline", streamUrl: "https://example.com/songkhla1" },
    ],
  },
  {
    id: 6,
    name: "khaokheowzoo",
    location: "Chonburi",
    image: khaokheowzoo ,
    cameras: [
      { id: 1, name: "Monkey Hill", status: "online", streamUrl: "https://example.com/khaokheow1" },
    ],
  },
];
