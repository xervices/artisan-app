import * as React from 'react';
import { LoaderCircle } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface LoadingIndicatorProps {
  /** Size of the loading indicator */
  size?: number;
  /** Color of the loading indicator */
  color?: string;
  /** Rotation speed in milliseconds (lower = faster) */
  speed?: number;
}

export function LoadingIndicator({
  size = 48,
  color = '#FE6A00',
  speed = 1000,
}: LoadingIndicatorProps) {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: speed,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animatedStyle,
      ]}>
      <LoaderCircle size={size} color={color} strokeWidth={1.5} />
    </Animated.View>
  );
}
