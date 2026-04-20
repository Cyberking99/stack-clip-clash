import React, { useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Typography } from './Typography';
import { CheckCircle2, AlertCircle } from 'lucide-react-native';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onHide: () => void;
}

export function Toast({ message, type = 'success', onHide }: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { opacity: fadeAnim, backgroundColor: type === 'success' ? '#10B981' : '#EF4444' }
      ]}
    >
      <View className="flex-row items-center px-4 py-3">
        {type === 'success' ? (
          <CheckCircle2 size={18} color="white" className="mr-2" />
        ) : (
          <AlertCircle size={18} color="white" className="mr-2" />
        )}
        <Typography variant="label" className="text-white font-bold">{message}</Typography>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});
