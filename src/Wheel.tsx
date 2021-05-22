import React from 'react'
import Animated from 'react-native-reanimated'
import {
  TapGestureHandlerGestureEvent,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  PanGestureHandler,
  State as GestureState
} from 'react-native-gesture-handler'
import { View, ViewStyle, StyleSheet } from 'react-native'
import {
  SrcInComposition,
  SweepGradient,
  ImagePlaceholder,
  RadialGradient
} from 'react-native-image-filter-kit'
import { HueSaturationWheel } from './HueSaturationWheel'

const { call, cond, eq, and, or, set } = Animated

type Props = {
  readonly hue: Animated.Node<number>
  readonly saturation: Animated.Node<number>
  readonly value: Animated.Node<number>
  readonly side: number
  readonly thumbSize: number
  readonly translateX: Animated.Node<number>
  readonly translateY: Animated.Node<number>
  readonly startX: Animated.Node<number>
  readonly startY: Animated.Node<number>
  readonly thumbColor: Animated.Node<string>
  readonly wheelOpacity: Animated.Node<number>
  readonly panGestureEvent: (
    event: PanGestureHandlerGestureEvent | TapGestureHandlerGestureEvent
  ) => void
  readonly gestureState: Animated.Node<GestureState>
  readonly valueGestureState: Animated.Node<GestureState>
  readonly codeKey: number
  readonly onColorChangeComplete?: ([
    hue,
    saturation,
    value
  ]: readonly number[]) => void
  readonly onColorChange?: ([hue, saturation, value]: readonly number[]) => void
}

type GradientProps = React.ComponentProps<typeof SweepGradient>

const colors: GradientProps['colors'] = [
  '#FF0000',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#FF00FF',
  '#FF0000'
]
const stops: GradientProps['stops'] = [0, 0.165, 0.33, 0.495, 0.66, 0.825, 1]
const radialColors: GradientProps['colors'] = ['#00000000', '#000000FF']

export const Wheel = React.memo((props: Props) => {
  const {
    side,
    thumbSize,
    translateX,
    translateY,
    thumbColor,
    wheelOpacity,
    panGestureEvent,
    onColorChange,
    onColorChangeComplete,
    codeKey,
    gestureState,
    startX,
    startY,
    valueGestureState,
    hue,
    saturation,
    value
  } = props

  const thumbOffset = -thumbSize / 2
  const imageSide = side - thumbSize
  const containerStyle = { width: side, height: side }
  const imageStyle = {
    width: imageSide,
    height: imageSide,
    borderRadius: imageSide / 2
  }
  const thumbStyle = {
    width: thumbSize,
    height: thumbSize,
    borderRadius: thumbSize / 2
  }

  return (
    <TapGestureHandler onHandlerStateChange={panGestureEvent}>
      <Animated.View style={[styles.container, containerStyle]}>
        <PanGestureHandler
          maxPointers={1}
          onGestureEvent={panGestureEvent}
          onHandlerStateChange={panGestureEvent}
        >
          <Animated.View style={[styles.container, containerStyle]}>
            <View style={[styles.wheel, imageStyle]}>
              <SrcInComposition
                srcImage={
                  <SweepGradient
                    colors={colors}
                    stops={stops}
                    image={<ImagePlaceholder style={imageStyle} />}
                  />
                }
                dstImage={
                  <RadialGradient
                    colors={radialColors}
                    image={<ImagePlaceholder style={imageStyle} />}
                  />
                }
              />
              <Animated.View
                style={[
                  imageStyle,
                  styles.wheelOverlay,
                  { opacity: wheelOpacity }
                ]}
              />
              <Animated.View
                style={[
                  styles.thumb,
                  thumbStyle,
                  // @ts-expect-error
                  {
                    backgroundColor: thumbColor,
                    transform: [
                      { translateX },
                      { translateY },
                      { translateX: thumbOffset },
                      { translateY: thumbOffset }
                    ]
                  }
                ]}
              />
              {onColorChangeComplete !== undefined ? (
                <Animated.Code
                  key={`change_complete_${codeKey}`}
                  exec={cond<GestureState>(
                    and(
                      or(
                        eq(gestureState, GestureState.END),
                        eq(gestureState, GestureState.UNDETERMINED)
                      ),
                      or(
                        eq(valueGestureState, GestureState.END),
                        eq(valueGestureState, GestureState.UNDETERMINED)
                      ),
                      or(
                        HueSaturationWheel.isGestureStartedInsideCircle(
                          gestureState,
                          startX,
                          startY,
                          thumbSize,
                          side
                        ),
                        eq(valueGestureState, GestureState.END)
                      )
                    ),
                    [
                      set(
                        valueGestureState as Animated.Value<GestureState>,
                        GestureState.UNDETERMINED
                      ),
                      call([hue, saturation, value], onColorChangeComplete)
                    ]
                  )}
                />
              ) : (
                false
              )}
              {onColorChange !== undefined ? (
                <Animated.Code
                  key={`change_${codeKey}`}
                  exec={cond(
                    or(
                      HueSaturationWheel.isGestureStartedInsideCircle(
                        gestureState,
                        startX,
                        startY,
                        thumbSize,
                        side
                      ),
                      eq(valueGestureState, GestureState.BEGAN),
                      eq(valueGestureState, GestureState.ACTIVE)
                    ),
                    call([hue, saturation, value], onColorChange)
                  )}
                />
              ) : (
                false
              )}
            </View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  )
})

type Styles = {
  readonly container: ViewStyle
  readonly thumb: ViewStyle
  readonly wheel: ViewStyle
  readonly wheelOverlay: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  wheel: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  wheelOverlay: {
    position: 'absolute',
    backgroundColor: 'black'
  },
  thumb: {
    position: 'absolute',
    borderColor: 'white',
    borderWidth: 2
  }
})
