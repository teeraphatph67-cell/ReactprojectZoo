// src/components/YouTubePlayer.jsx
import React, { useMemo } from "react";

function extractVideoId(input = "") {
  // รับทั้งลิงก์เต็มและ id ตรง ๆ
  try {
    const u = new URL(input);
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v") || "";
      if (u.pathname.startsWith("/live/")) return u.pathname.split("/").pop();
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/").pop();
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/").pop();
    }
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
  } catch {
    // ไม่ใช่ URL ก็อาจเป็น id ตรง ๆ
    return input.trim();
  }
  return input.trim();
}

export default function YouTubePlayer({
  videoInput = "",      // video URL/ID (VOD หรือ live แบบรู้ videoId)
  channelId = "",       // ใช้สำหรับดึงไลฟ์ล่าสุดของช่อง
  autoPlay = true,
  mute = true,
  showControls = true,
  className = "",
}) {
  const base = "https://www.youtube-nocookie.com";
  const videoId = useMemo(() => extractVideoId(videoInput), [videoInput]);

  // ถ้ามี videoId จะฝังวิดีโอ/ไลฟ์ตาม id นั้น
  // ถ้าไม่มีแต่มี channelId จะฝัง "ไลฟ์ล่าสุดของช่อง"
  const src = videoId
    ? `${base}/embed/${videoId}`
    : channelId
    ? `${base}/embed/live_stream?channel=${channelId}`
    : "";

  if (!src) {
    return (
      <div className={`w-full aspect-video grid place-items-center bg-black/5 rounded-xl ${className}`}>
        <span className="text-sm text-gray-600">กรอก Video URL/ID หรือ Channel ID ก่อน</span>
      </div>
    );
  }

  const params = new URLSearchParams({
    autoplay: autoPlay ? "1" : "0",
    mute: mute ? "1" : "0",
    controls: showControls ? "1" : "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  }).toString();

  return (
    <div className={`w-full aspect-video rounded-xl overflow-hidden ${className}`}>
      <iframe
        src={`${src}?${params}`}
        title="YouTube Player"
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
