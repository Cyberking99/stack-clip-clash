import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ArenaScreen } from '../screens/ArenaScreen';
import { StudioScreen } from '../screens/StudioScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Trophy, Swords, Video, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#0F172A', // background
                    borderTopWidth: 1,
                    borderTopColor: '#1E293B', // surface
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#8B5CF6', // primary
                tabBarInactiveTintColor: '#94A3B8', // muted
                headerStyle: {
                    backgroundColor: '#0F172A',
                    borderBottomWidth: 1,
                    borderBottomColor: '#1E293B',
                },
                headerTitleStyle: {
                    fontFamily: 'Outfit',
                    fontWeight: 'bold',
                    color: '#F8FAFC', // text
                },
            }}
        >
            <Tab.Screen
                name="Arena"
                component={ArenaScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Swords color={color} size={size} />,
                    title: 'Arena'
                }}
            />
            <Tab.Screen
                name="Studio"
                component={StudioScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Video color={color} size={size} />,
                    title: 'Studio'
                }}
            />
            <Tab.Screen
                name="Leaderboard"
                component={LeaderboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
                    title: 'Hall of Fame'
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    title: 'Profile'
                }}
            />
        </Tab.Navigator>
    );
}
