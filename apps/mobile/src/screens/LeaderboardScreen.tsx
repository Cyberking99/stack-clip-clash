import React from 'react';
import { View, Text } from 'react-native';

export function LeaderboardScreen() {
    return (
        <View className="flex-1 bg-background items-center justify-center p-4">
            <Text className="text-2xl font-heading font-bold text-accent mb-2 text-center">Hall of Fame</Text>
            <Text className="text-muted text-center">See who is dominating the charts this week across the arena.</Text>
            <View className="mt-8 bg-surface border border-surface p-10 rounded-3xl w-full max-w-sm items-center">
                <Text className="text-accent font-bold text-lg">Coming Soon</Text>
                <Text className="text-muted text-center mt-2 text-sm italic">Live leaderboards will be integrated in Phase 4.</Text>
            </View>
        </View>
    );
}
