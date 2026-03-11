import React from 'react';
import { View } from 'react-native';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { Trophy } from 'lucide-react-native';

export function LeaderboardScreen() {
    return (
        <View className="flex-1 bg-background items-center justify-center p-6">
            <Typography variant="h1" className="mb-2 text-center text-accent">Hall of Fame</Typography>
            <Typography variant="body" className="text-muted text-center mb-10">
                See who is dominating the charts this week across the arena.
            </Typography>
            <View className="bg-surface border border-surface p-8 rounded-3xl w-full items-center shadow-xl">
                <Trophy size={48} color="#F59E0B" className="mb-4" />
                <Typography variant="h2" className="text-accent mb-2">Coming Soon</Typography>
                <Typography variant="muted" className="text-center mb-6 italic">
                    Live leaderboards will be integrated in Phase 4.
                </Typography>
                <Button title="View Rankings" variant="outline" className="w-full" disabled />
            </View>
        </View>
    );
}
