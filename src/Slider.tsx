import React from 'react'
import Animated from 'react-native-reanimated'
import {
  PanGestureHandler,
  TapGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent
} from 'react-native-gesture-handler'
import { View, ViewStyle, StyleSheet } from 'react-native'
import { LinearGradient, ImagePlaceholder } from 'react-native-image-filter-kit'

type Props = {
  readonly width: number
  readonly height: number
  readonly thumbWidth: number
  readonly translate: Animated.Node<number>
  readonly panGestureEvent: (
    event: PanGestureHandlerGestureEvent | TapGestureHandlerGestureEvent
  ) => void
  readonly thumbColor: Animated.Node<string>
}

type GradientProps = React.ComponentProps<typeof LinearGradient>

const colors: GradientProps['colors'] = ['#000000FF', '#00000000']

export const Slider = React.memo((props: Props) => {
  const { panGestureEvent, translate, thumbColor, width, height, thumbWidth } =
    props

  const imageWidth = width - thumbWidth
  const imageStyle = { width: imageWidth, height, borderRadius: 5 }
  const containerStyle = { width, height }
  const offset = -thumbWidth / 2

  return (
    <TapGestureHandler onHandlerStateChange={panGestureEvent}>
      <Animated.View style={containerStyle}>
        <PanGestureHandler
          maxPointers={1}
          onGestureEvent={panGestureEvent}
          onHandlerStateChange={panGestureEvent}
        >
          <Animated.View style={[styles.container, containerStyle]}>
            <View style={[styles.slider, imageStyle]}>
              <LinearGradient
                colors={colors}
                image={<ImagePlaceholder style={imageStyle} />}
              />
              <Animated.View
                style={[
                  styles.thumb,
                  // @ts-expect-error
                  {
                    width: thumbWidth,
                    height,
                    backgroundColor: thumbColor,
                    transform: [
                      { translateX: translate },
                      { translateX: offset }
                    ]
                  }
                ]}
              />
            </View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  )
})

type Styles = {
  readonly container: ViewStyle
  readonly slider: ViewStyle
  readonly thumb: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  slider: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  thumb: {
    position: 'absolute',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 5
  }
})
