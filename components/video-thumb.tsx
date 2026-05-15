import { useVideoPlayer, VideoView } from 'expo-video';
import { Play } from 'lucide-react-native';
import { View } from 'react-native';

export const isVideoUri = (uri?: string): boolean => {
  if (!uri || typeof uri !== 'string') return false;
  return /\.(mp4|mov|webm|mkv|m4v)($|\?)/i.test(uri);
};

interface VideoThumbProps {
  uri: string;
  iconSize?: number;
  badgeSize?: number;
}

export function VideoThumb({ uri, iconSize = 20, badgeSize = 40 }: VideoThumbProps) {
  const player = useVideoPlayer(uri, (p) => {
    p.muted = true;
    p.pause();
  });

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <VideoView
        player={player}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        nativeControls={false}
      />
      <View className="absolute inset-0 items-center justify-center bg-black/20">
        <View
          style={{
            height: badgeSize,
            width: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: 'rgba(255,255,255,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Play size={iconSize} color="#1B1B1E" fill="#1B1B1E" />
        </View>
      </View>
    </View>
  );
}
