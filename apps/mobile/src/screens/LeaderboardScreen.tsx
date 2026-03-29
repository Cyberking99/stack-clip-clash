import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { Trophy, RefreshCcw } from 'lucide-react-native';
import { fetchLeaderboard } from '../lib/api';

interface RankItem {
  address: string;
  clout: number;
  rank: number;
  performerId: string;
}

export function LeaderboardScreen() {
    const [rankings, setRankings] = useState<RankItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'daily' | 'weekly'>('daily');

    const loadData = async () => {
        setIsLoading(true);
        const data = await fetchLeaderboard();
        setRankings(data.rankings || []);
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [filter]);

    const renderItem = ({ item }: { item: RankItem }) => (
        <View className="bg-surface/50 mb-3 p-4 rounded-2xl border border-surface flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
                <View className={`w-8 h-8 rounded-full items-center justify-center mr-4 ${item.rank <= 3 ? 'bg-accent/20' : 'bg-surface'}`}>
                    <Typography variant="label" className={item.rank <= 3 ? 'text-accent' : 'text-muted'}>
                        {item.rank}
                    </Typography>
                </View>
                <View>
                    <Typography variant="body" className="font-bold">
                        {item.address.substring(0, 6)}...{item.address.substring(item.address.length - 4)}
                    </Typography>
                    <Typography variant="muted" className="text-xs">ID: {item.performerId}</Typography>
                </View>
            </View>
            <View className="items-end">
                <Typography variant="h2" className="text-accent">{item.clout}</Typography>
                <Typography variant="label" className="text-[10px] uppercase text-muted">Clout Score</Typography>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-background p-6">
            <View className="flex-row items-center justify-between mb-6 mt-8">
                <Typography variant="h1" className="text-accent">Hall of Fame</Typography>
                <TouchableOpacity onPress={loadData}>
                    <RefreshCcw size={20} color="#64748B" />
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View className="flex-row bg-surface rounded-full p-1 mb-8">
                <TouchableOpacity 
                    className={`flex-1 py-3 rounded-full items-center ${filter === 'daily' ? 'bg-accent shadow-sm' : ''}`}
                    onPress={() => setFilter('daily')}
                >
                    <Typography variant="label" className={filter === 'daily' ? 'text-white' : 'text-muted'}>Daily</Typography>
                </TouchableOpacity>
                <TouchableOpacity 
                    className={`flex-1 py-3 rounded-full items-center ${filter === 'weekly' ? 'bg-accent shadow-sm' : ''}`}
                    onPress={() => setFilter('weekly')}
                >
                    <Typography variant="label" className={filter === 'weekly' ? 'text-white' : 'text-muted'}>Weekly</Typography>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color="#FF3D00" size="large" />
                </View>
            ) : rankings.length > 0 ? (
                <FlatList
                    data={rankings}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.address}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            ) : (
                <View className="flex-1 items-center justify-center opacity-50">
                    <Trophy size={60} color="#F59E0B" className="mb-4" />
                    <Typography variant="body" className="text-center italic">
                        No rankings found. Be the first to clash!
                    </Typography>
                </View>
            )}
        </View>
    );
}
