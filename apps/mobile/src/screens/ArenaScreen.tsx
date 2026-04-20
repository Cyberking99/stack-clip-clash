import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Typography } from '../components/Typography';
import { VideoPlayer } from '../components/VideoPlayer';
import { Swords, Zap, Flame } from 'lucide-react-native';
import { fetchArenaData } from '../lib/api';
import { useStacks } from '../hooks/useStacks';
import { Toast } from '../components/Toast';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Performer {
  id: string;
  name: string;
  avatar?: string;
  videoUrl: string;
  votes: number;
}

interface Battle {
  id: string;
  performerA: Performer;
  performerB: Performer;
  timeLeft: number;
}

export function ArenaScreen() {
    const { userData } = useStacks();
    const [battle, setBattle] = useState<Battle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasVoted, setHasVoted] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        async function loadBattle() {
            try {
                const data = await fetchArenaData();
                setBattle(data);
            } catch (error) {
                console.error("Failed to load battle:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadBattle();
    }, []);

    const handleVote = async (performerId: string) => {
        if (!userData) {
            alert("Connect your wallet to vote!");
            return;
        }
        
        // Mock success for local UI feedback
        setHasVoted(true);
        setShowToast(true);
        // In a real app, this would call the API POST /api/arena
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" color="#FF3D00" />
            </View>
        );
    }

    if (!battle) return null;

    return (
        <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
            <View className="p-6 pt-12 items-center">
                <Typography variant="h1" className="text-accent mb-1">LIVE ARENA</Typography>
                <View className="bg-red-500/10 px-3 py-1 rounded-full flex-row items-center mb-6">
                    <Typography variant="label" className="text-red-500 text-[10px]">Battle #{battle.id.split('_')[1]}</Typography>
                </View>
            </View>

            <View className="flex-row w-full bg-zinc-900" style={{ height: SCREEN_HEIGHT * 0.6 }}>
                {/* Performer A */}
                <View className="flex-1 relative border-r border-white/5">
                    <VideoPlayer url={battle.performerA.videoUrl} />
                    <View className="absolute bottom-4 left-4 right-4 items-center">
                        <Typography variant="label" className="text-white mb-2 shadow-lg">{battle.performerA.name}</Typography>
                        <TouchableOpacity 
                            className={`w-full py-3 rounded-xl items-center ${hasVoted ? 'bg-zinc-800' : 'bg-[#FF3D00]'}`}
                            onPress={() => handleVote(battle.performerA.id)}
                            disabled={hasVoted}
                        >
                            <Typography variant="label" className="text-white">
                                {hasVoted ? 'VOTED' : 'FIRE 🔥'}
                            </Typography>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* VS Badge */}
                <View className="absolute left-1/2 top-1/2 -ml-6 -mt-6 z-30 w-12 h-12 bg-zinc-950 rounded-full items-center justify-center border-2 border-accent">
                    <Typography variant="label" className="text-accent italic font-black">VS</Typography>
                </View>

                {/* Performer B */}
                <View className="flex-1 relative">
                    <VideoPlayer url={battle.performerB.videoUrl} />
                    <View className="absolute bottom-4 left-4 right-4 items-center">
                        <Typography variant="label" className="text-white mb-2 shadow-lg">{battle.performerB.name}</Typography>
                        <TouchableOpacity 
                            className={`w-full py-3 rounded-xl items-center ${hasVoted ? 'bg-zinc-800' : 'bg-primary'}`}
                            onPress={() => handleVote(battle.performerB.id)}
                            disabled={hasVoted}
                        >
                            <Typography variant="label" className="text-white">
                                {hasVoted ? 'VOTED' : 'VIBE 💎'}
                            </Typography>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View className="p-6 items-center">
                <View className="flex-row items-center gap-2 mb-4">
                    <Typography variant="muted">Ends in </Typography>
                    <Typography variant="h2" className="text-white font-mono">{Math.floor(battle.timeLeft / 60)}:{(battle.timeLeft % 60).toString().padStart(2, '0')}</Typography>
                </View>

                <View className="w-full bg-zinc-900 rounded-2xl p-6 border border-white/5">
                    <View className="flex-row justify-between mb-2">
                        <Typography variant="label">Collective Fire</Typography>
                        <Typography variant="label">{Math.round((battle.performerA.votes / (battle.performerA.votes + battle.performerB.votes)) * 100)}%</Typography>
                    </View>
                    <View className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <View className="h-full bg-[#FF3D00]" style={{ width: `${(battle.performerA.votes / (battle.performerA.votes + battle.performerB.votes)) * 100}%` }} />
                    </View>
                </View>
            </View>

            {showToast && (
                <Toast 
                    message="Vote cast successfully! 🗳️" 
                    onHide={() => setShowToast(false)} 
                />
            )}
        </ScrollView>
    );
}
