import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Typography } from "./Typography";
import { AlertTriangle, RefreshCcw } from "lucide-react-native";
import * as Updates from "expo-updates";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Mobile Uncaught error:", error, errorInfo);
  }

  private handleReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      // Fallback if expo-updates isn't fully configured
      this.setState({ hasError: false, error: null });
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-background items-center justify-center p-6 text-center">
          <View className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
            <AlertTriangle size={40} color="#EF4444" />
          </View>
          
          <Typography variant="h1" className="text-white text-center mb-4">Arena Glitch</Typography>
          <Typography variant="body" className="text-muted text-center mb-10 px-4">
            The Arena encountered an unexpected crash. Let's restart the performance.
          </Typography>

          <TouchableOpacity
            onPress={this.handleReload}
            className="flex-row items-center justify-center gap-3 px-8 py-4 bg-[#FF3D00] rounded-2xl w-full max-w-xs shadow-xl active:scale-95 transition-all"
          >
            <RefreshCcw size={20} color="white" />
            <Typography variant="label" className="text-white font-bold tracking-widest">RELOAD ARENA</Typography>
          </TouchableOpacity>
          
          {__DEV__ && (
            <View className="mt-10 p-4 bg-zinc-950 rounded-xl border border-white/5 w-full">
              <Typography variant="muted" className="text-[10px] text-red-300 font-mono">
                {this.state.error?.toString()}
              </Typography>
            </View>
          )}
        </View>
      );
    }

    return this.children;
  }
}
