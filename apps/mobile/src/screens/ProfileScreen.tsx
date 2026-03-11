import React from 'react';
import { View, Text } from 'react-native';

export function ProfileScreen() {
    return (
        <View className="flex-1 bg-background items-center justify-center p-4">
            <Text className="text-2xl font-heading font-bold text-text mb-2 text-center">Performer Profile</Text>
            <Text className="text-muted text-center">Manage your identity, view your stats, and showcase your wins.</Text>
            <View className="mt-8 bg-surface border border-surface p-10 rounded-3xl w-full max-w-sm items-center">
                <Text className="text-text font-bold text-lg">Coming Soon</Text>
                <Text className="text-muted text-center mt-2 text-sm italic">BNS integration and stats will be implemented in Phase 4.</Text>
            </View>
        </View>
    );
}
