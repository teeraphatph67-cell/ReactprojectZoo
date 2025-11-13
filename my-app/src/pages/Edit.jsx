// src/pages/YouTubeDemo.jsx
import React, { useState } from "react";
import YouTubePlayer from "../components/YouTubePlayer";

export default function YouTubeDemo() {
  const [videoInput, setVideoInput] = useState("M7lc1UVf-VE"); // ตัวอย่างคลิปสาธิตของ YouTube
  const [channelId, setChannelId] = useState("");              // ใส่ UC... จะดูไลฟ์ล่าสุดของช่อง
  const [autoPlay, setAutoPlay] = useState(true);
  const [mute, setMute] = useState(true);
  const [controls, setControls] = useState(true);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">YouTube Live/VOD Demo</h1>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Video URL/ID (VOD หรือ Live ที่รู้ videoId)</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="เช่น https://youtu.be/VIDEO_ID หรือ VIDEO_ID"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            ถ้ากรอกช่องนี้ ระบบจะใช้ videoId นี้ก่อน (เหนือกว่า Channel ID)
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Channel ID (ดึงไลฟ์ล่าสุดของช่อง)</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="เช่น UCxxxxxxxxxxxxxxxxx"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            ใช้ได้เมื่อช่องกำลังไลฟ์อยู่จริง (ถ้าไม่มีไลฟ์จะขึ้นหน้าว่าง)
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} />
          Autoplay
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={mute} onChange={(e) => setMute(e.target.checked)} />
          Mute (แนะนำเปิดไว้ถ้าจะ Autoplay)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={controls} onChange={(e) => setControls(e.target.checked)} />
          Show controls
        </label>
      </div>

      <YouTubePlayer
        videoInput={videoInput}
        channelId={channelId}
        autoPlay={autoPlay}
        mute={mute}
        showControls={controls}
        className="shadow"
      />

      <div className="text-xs text-gray-500">
        ทิป: ถ้าจะฝัง Live Chat ด้วย ต้องใช้ <code>videoId</code> และใส่ <code>embed_domain</code> ให้ตรงโดเมนที่รันเว็บ
      </div>
    </div>
  );
}
