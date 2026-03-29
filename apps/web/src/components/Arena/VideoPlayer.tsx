"use client";

import React, { useState, useRef, useEffect } from "react";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
}

export default function VideoPlayer({ url, poster, className = "" }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`relative aspect-[9/16] overflow-hidden bg-black ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#FF3D00] border-t-transparent"></div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        className="h-full w-full object-cover"
        playsInline
        muted
        loop
        onCanPlay={() => setIsLoading(false)}
        onClick={togglePlay}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!isPlaying && !isLoading && (
          <div className="h-20 w-20 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <svg className="h-10 w-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Overlay UI for interaction feedback */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest border border-white/5">
              Live Stream
          </div>
      </div>
    </div>
  );
}
