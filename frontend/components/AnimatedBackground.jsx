import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');

const AnimatedBackground = ({ 
  variant = 'gradient',
  children,
  style 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const getBackgroundStyle = () => {
    switch (variant) {
      case 'gradient':
        return {
          backgroundColor: '#0f172a', // Static dark slate background
        };
      case 'wave':
        return {
          backgroundColor: colors.background,
        };
      default:
        return {
          backgroundColor: colors.background,
        };
    }
  };

  if (variant === 'wave') {
    return (
      <View style={[styles.container, style]}>
        <Animated.View style={[styles.wave, getBackgroundStyle()]} />
        <Animated.View style={[styles.wave2, getBackgroundStyle()]} />
        <Animated.View style={[styles.wave3, getBackgroundStyle()]} />
        {children}
      </View>
    );
  }

  if (variant === 'gradient') {
    return (
      <View style={[styles.container, { backgroundColor: '#0f172a' }, style]}>
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#0f172a']}
          style={StyleSheet.absoluteFill}
        />
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, getBackgroundStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    opacity: 0.1,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.5 }],
  },
  wave2: {
    position: 'absolute',
    top: height * 0.1,
    left: 0,
    right: 0,
    height: height * 0.4,
    opacity: 0.08,
    transform: [{ scaleX: 1.5 }, { scaleY: 1.2 }],
  },
  wave3: {
    position: 'absolute',
    top: height * 0.2,
    left: 0,
    right: 0,
    height: height * 0.3,
    opacity: 0.06,
    transform: [{ scaleX: 1.8 }, { scaleY: 1.1 }],
  },
});

export default AnimatedBackground;
