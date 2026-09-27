import { Image, type ImageProps, type ImageSource } from "expo-image";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, type DerivedValue } from "react-native-reanimated";

import { Label } from "./Label";

type PassThroughImageProps = Omit<ImageProps, "source" | "style" | "contentFit">;

interface BeforeClipProps {
  source: ImageSource | number;
  contentFit?: ImageProps["contentFit"];
  imageProps?: PassThroughImageProps;
  measuredWidth: number;
  splitPx: DerivedValue<number>;
  beforeLabel?: string;
}

export function BeforeClip(props: BeforeClipProps) {
  const { measuredWidth, splitPx, source, contentFit, imageProps, beforeLabel } = props;

  const clipStyle = useAnimatedStyle(() => ({ width: splitPx.get() }));

  return (
    <Animated.View style={[styles.clip, clipStyle]}>
      {measuredWidth > 0 && (
        <>
          <Image
            {...imageProps}
            accessible={false}
            source={source}
            contentFit={contentFit}
            style={[styles.leftImage, { width: measuredWidth }]}
          />
          {beforeLabel && (
            <View style={{ width: measuredWidth }}>
              <Label text={beforeLabel} alignSelf="flex-start" testID="before-label" />
            </View>
          )}
        </>
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
