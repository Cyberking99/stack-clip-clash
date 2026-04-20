import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Play } from 'lucide-react-native';

interface VideoPlayerProps {
  url: string;
  className?: string;
}

export function VideoPlayer({ url, className = "" }: VideoPlayerProps) {
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<Video>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (status && 'isPlaying' in status && status.isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
    }
  };

  return (
    <View className={`relative aspect-[9/16] bg-black overflow-hidden ${className}`}>
      {isLoading && (
        <View className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
          <ActivityIndicator size="large" color="#FF3D00" />
        </View>
      )}

      <Video
        ref={videoRef}
        source={{ uri: url }}
        className="w-full h-full"
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted={true}
        shouldPlay={true}
        onPlaybackStatusUpdate={status => setStatus(status)}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
      />

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={togglePlay}
        className="absolute inset-0 flex items-center justify-center"
      >
        {status && 'isPlaying' in status && !status.isPlaying && !isLoading && (
          <View className="h-16 w-16 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <Play size={32} color="white" fill="white" />
          </View>
        )}
      </TouchableOpacity>

      <View className="absolute bottom-4 left-4 z-20 pointer-events-none">
        <View className="px-3 py-1 rounded-full bg-black/50 border border-white/5">
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
            <View className="text-[10px] uppercase font-bold text-white tracking-widest">
              Live Arena
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
