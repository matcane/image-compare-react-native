import { Image, type ImageProps, type ImageSource } from "expo-image";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, type DerivedValue } from "react-native-reanimated";

type PassThroughImageProps = Omit<ImageProps, "source" | "style" | "contentFit">;

interface BeforeClipProps {
  source: ImageSource | number;
  contentFit?: ImageProps["contentFit"];
  imageProps?: PassThroughImageProps;
  measuredWidth: number;
  splitPx: DerivedValue<number>;
}

export function BeforeClip(props: BeforeClipProps) {
  const { measuredWidth, splitPx, source, contentFit, imageProps } = props;

  const clipStyle = useAnimatedStyle(() => ({ width: splitPx.get() }));

  return (
    <Animated.View style={[styles.clip, clipStyle]}>
      {measuredWidth > 0 && (
        <Image
          {...imageProps}
          accessible={false}
          source={source}
          contentFit={contentFit}
          style={[styles.leftImage, { width: measuredWidth }]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  clip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    overflow: "hidden",
  },
  leftImage: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
  },
});
