import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <Text className="text-3xl font-heading font-bold text-primary mb-2">ClipClash</Text>
      <Text className="text-lg font-sans text-muted text-center">
        Your decentralized performance battle arena.
      </Text>
      <View className="mt-8 p-6 rounded-2xl bg-surface border border-surface w-full max-w-sm">
        <Text className="text-text font-bold text-xl mb-2 text-center">Ready to Clash?</Text>
        <Text className="text-muted text-center mb-6">
          Connect your wallet and start recording your 15-second masterpiece.
        </Text>
        <View className="bg-primary py-3 rounded-lg shadow-lg">
          <Text className="text-white font-bold text-center">Get Started</Text>
        </View>
      </View>
      <StatusBar style="light" />
    </View>
  );
}
