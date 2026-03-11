import React from 'react';
import { View } from 'react-native';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { User } from 'lucide-react-native';

export function ProfileScreen() {
    return (
        <View className="flex-1 bg-background items-center justify-center p-6">
            <Typography variant="h1" className="mb-2 text-center text-text">Performer Profile</Typography>
            <Typography variant="body" className="text-muted text-center mb-10">
                Manage your identity, view your stats, and showcase your wins.
            </Typography>
            <View className="bg-surface border border-surface p-8 rounded-3xl w-full items-center shadow-xl">
                <User size={48} color="#F8FAFC" className="mb-4" />
                <Typography variant="h2" className="text-white mb-2">Coming Soon</Typography>
                <Typography variant="muted" className="text-center mb-6 italic">
                    BNS integration and stats will be implemented in Phase 4.
                </Typography>
                <Button title="Connect Wallet" className="w-full" />
            </View>
        </View>
    );
}
