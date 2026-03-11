import React from 'react';
import { View, Text } from 'react-native';

export function StudioScreen() {
    return (
        <View className="flex-1 bg-background items-center justify-center p-4">
            <Text className="text-2xl font-heading font-bold text-secondary mb-2 text-center">Mobile Studio</Text>
            <Text className="text-muted text-center">Record your 15-second masterpiece and challenge the best.</Text>
            <View className="mt-8 bg-surface border border-surface p-10 rounded-3xl w-full max-w-sm items-center">
                <Text className="text-secondary font-bold text-lg">Coming Soon</Text>
                <Text className="text-muted text-center mt-2 text-sm italic">Camera integration will be implemented in Phase 3.</Text>
            </View>
        </View>
    );
}
