import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { User, Trophy, ShieldCheck, Zap, ExternalLink } from 'lucide-react-native';

export function ProfileScreen() {
    const [isConnected, setIsConnected] = useState(false);

    // Mock stats
    const stats = {
        wins: 12,
        losses: 4,
        clout: 850,
        address: "SP2P...3X4Y",
        bns: "flowking.stx"
    };

    const renderStat = (label: string, value: string | number, Icon: any) => (
        <View className="flex-1 bg-surface/40 p-4 rounded-2xl border border-surface/50 items-center justify-center">
            <Icon size={20} color="#FF3D00" className="mb-2" />
            <Typography variant="h2" className="text-white">{value}</Typography>
            <Typography variant="label" className="text-[10px]">{label}</Typography>
        </View>
    );

    if (!isConnected) {
        return (
            <View className="flex-1 bg-background items-center justify-center p-6">
                <View className="w-24 h-24 rounded-full bg-accent/20 items-center justify-center mb-6">
                    <User size={48} color="#FF3D00" />
                </View>
                <Typography variant="h1" className="mb-2 text-center">Your Arena Identity</Typography>
                <Typography variant="body" className="text-muted text-center mb-10">
                    Connect your Stacks wallet to sync your performance history, BNS name, and trophy cabinet.
                </Typography>
                <Button 
                    title="Connect Wallet" 
                    className="w-full h-16 rounded-2xl" 
                    onPress={() => setIsConnected(true)} 
                />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-background">
            <View className="p-6 pt-12">
                {/* Header / Identity */}
                <View className="items-center mb-8">
                    <View className="w-24 h-24 rounded-full bg-surface border-4 border-accent/30 p-1 mb-4 shadow-2xl">
                        <View className="flex-1 rounded-full bg-zinc-800 items-center justify-center">
                            <User size={40} color="#64748B" />
                        </View>
                    </View>
                    <Typography variant="h1">{stats.bns}</Typography>
                    <Typography variant="muted" className="mb-2 font-mono">{stats.address}</Typography>
                    
                    <View className="bg-accent/10 px-4 py-1 rounded-full border border-accent/20 flex-row items-center">
                        <ShieldCheck size={12} color="#FF3D00" className="mr-1" />
                        <Typography variant="label" className="text-accent">Verified Performer</Typography>
                    </View>
                </View>

                {/* Stats Grid */}
                <View className="flex-row gap-3 mb-8">
                    {renderStat('Wins', stats.wins, Trophy)}
                    {renderStat('Losses', stats.losses, Zap)}
                    {renderStat('Clout', stats.clout, Zap)}
                </View>

                {/* Trophy Cabinet Section */}
                <View className="mb-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <Typography variant="h2">Trophy Cabinet</Typography>
                        <Typography variant="label" className="text-accent underline">View All</Typography>
                    </View>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
                        {[1, 2, 3].map((i) => (
                            <View key={i} className="w-32 h-40 bg-surface rounded-2xl border border-surface p-4 items-center justify-center">
                                <Trophy size={32} color={i === 1 ? "#FFD700" : "#C0C0C0"} className="mb-2" />
                                <Typography variant="label" className="text-center text-[10px]">Battle #{100+i}</Typography>
                                <Typography variant="muted" className="text-center text-[8px]">Mar 2026</Typography>
                                <TouchableOpacity className="mt-2">
                                    <ExternalLink size={12} color="#FF3D00" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity className="w-32 h-40 bg-surface/20 rounded-2xl border border-surface border-dashed items-center justify-center">
                            <Typography variant="label" className="text-muted text-[10px]">Placeholder</Typography>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Account Settings / Actions */}
                <View className="bg-surface rounded-3xl p-4 border border-surface">
                    <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-white/5">
                        <Typography variant="body">Edit Profile</Typography>
                        <Zap size={16} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className="flex-row items-center justify-between p-4"
                        onPress={() => setIsConnected(false)}
                    >
                        <Typography variant="body" className="text-red-500">Sign Out</Typography>
                        <Zap size={16} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
