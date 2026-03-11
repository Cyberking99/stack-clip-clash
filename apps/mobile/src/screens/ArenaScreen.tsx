import React from 'react';
import { View, Text } from 'react-native';

export function ArenaScreen() {
    return (
        <View className="flex-1 bg-background items-center justify-center p-4">
            <Text className="text-2xl font-heading font-bold text-text mb-2 text-center">The Arena</Text>
            <Text className="text-muted text-center">Watch and vote on the latest 15s performance battles.</Text>
            <View className="mt-8 bg-surface border border-surface p-10 rounded-3xl w-full max-w-sm items-center">
                <Text className="text-primary font-bold text-lg">Coming Soon</Text>
                <Text className="text-muted text-center mt-2 text-sm italic">Video feed will be integrated in Phase 4.</Text>
            </View>
        </View>
    );
}
