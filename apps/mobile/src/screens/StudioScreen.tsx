import React from 'react';
import { View } from 'react-native';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { Video } from 'lucide-react-native';

export function StudioScreen() {
    return (
        <View className="flex-1 bg-background items-center justify-center p-6">
            <Typography variant="h1" className="mb-2 text-center text-secondary">Mobile Studio</Typography>
            <Typography variant="body" className="text-muted text-center mb-10">
                Record your 15-second masterpiece and challenge the best.
            </Typography>
            <View className="bg-surface border border-surface p-8 rounded-3xl w-full items-center shadow-xl">
                <Video size={48} color="#10B981" className="mb-4" />
                <Typography variant="h2" className="text-secondary mb-2">Coming Soon</Typography>
                <Typography variant="muted" className="text-center mb-6 italic">
                    Camera integration will be implemented in Phase 3.
                </Typography>
                <Button title="Record Clip" variant="secondary" className="w-full" disabled />
            </View>
        </View>
    );
}
