import React from 'react';
import { View } from 'react-native';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { Swords } from 'lucide-react-native';

export function ArenaScreen() {
    return (
        <View className="flex-1 bg-background items-center justify-center p-6">
            <Typography variant="h1" className="mb-2 text-center">The Arena</Typography>
            <Typography variant="body" className="text-muted text-center mb-10">
                Watch and vote on the latest 15s performance battles.
            </Typography>
            <View className="bg-surface border border-surface p-8 rounded-3xl w-full items-center shadow-xl">
                <Swords size={48} color="#8B5CF6" className="mb-4" />
                <Typography variant="h2" className="text-primary mb-2">Coming Soon</Typography>
                <Typography variant="muted" className="text-center mb-6 italic">
                    Video feed will be integrated in Phase 4.
                </Typography>
                <Button title="Enter Arena" className="w-full" disabled />
            </View>
        </View>
    );
}
