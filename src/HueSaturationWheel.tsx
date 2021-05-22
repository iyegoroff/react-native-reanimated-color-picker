// tslint:disable:max-file-line-count
import React from 'react'
import { View, ViewStyle, StyleSheet, LayoutChangeEvent, StyleProp } from 'react-native'
import {
  State as GestureState,
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent
} from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { Wheel } from './Wheel'
import { colorHSV } from './colorHSV'
import { defaultStyle } from './defaultStyle'

const {
  and,
  neq,
  set,
  block,
  Value,
  multiply,
  divide,
  sqrt,
  pow,
  sub,
  add,
  greaterThan,
  cond,
  event,
  interpolateNode,
  Extrapolate,
  lessThan,
  acos,
  eq,
  lessOrEq
} = Animated

export type HSV = {
  readonly h: number
  readonly s: number
  readonly v: number
}

type Props = {
  readonly style: StyleProp<ViewStyle>,
  readonly snapToCenter?: number
  readonly onColorChangeComplete?: (color: HSV) => void
  readonly onColorChange?: (color: HSV) => void
  readonly value?: Animated.Node<number>
  readonly valueGestureState?: Animated.Node<GestureState>
  readonly thumbRadius?: number
  readonly initialHue?: number
  readonly initialSaturation?: number
}

type State = {
  readonly hue?: Animated.Node<number>
  readonly saturation?: Animated.Node<number>
  readonly side?: number
  readonly posX?: Animated.Node<number>
  readonly posY?: Animated.Node<number>
  readonly startX?: Animated.Node<number>
  readonly startY?: Animated.Node<number>
  readonly translateX?: Animated.Node<number>
  readonly translateY?: Animated.Node<number>
  readonly thumbColor?: Animated.Node<string>
  readonly wheelOpacity?: Animated.Node<number>
  readonly panGestureEvent?: (
    event: PanGestureHandlerGestureEvent | TapGestureHandlerGestureEvent
  ) => void
  readonly gestureState?: Animated.Node<GestureState>
  readonly codeKey?: number
}

export class HueSaturationWheel extends React.PureComponent<Props, State> {

  static defaultProps: Partial<Props> = {
    value: new Value(1),
    valueGestureState: new Animated.Value(GestureState.UNDETERMINED),
    thumbRadius: 50
  }

  constructor(props: Props) {
    super(props)

    const { style, snapToCenter, value, thumbRadius, initialHue, initialSaturation } = props
    const side = HueSaturationWheel.side(style)

    this.state = side === undefined || thumbRadius === undefined
      ? {}
      : (
        HueSaturationWheel.state(
          side,
          thumbRadius,
          value!,
          0,
          snapToCenter,
          initialHue,
          initialSaturation
        )
      )
  }

  static isGestureStartedInsideCircle(
    gestureState: Animated.Node<GestureState>,
    startX: Animated.Node<number>,
    startY: Animated.Node<number>,
    thumbSize: number,
    side: number
  ) {
    const halfThumbSize = thumbSize / 2
    const center = HueSaturationWheel.center(side, thumbSize)
    const radius = center

    return (
      and(
        neq(gestureState, GestureState.UNDETERMINED),
        neq(gestureState, GestureState.FAILED),
        lessOrEq(
          sqrt(
            add(
              pow(sub(startX, center + halfThumbSize), 2),
              pow(sub(startY, center + halfThumbSize), 2)
            )
          ),
          radius + thumbSize / 1.5
        )
      )
    )
  }

  private static center(side: number, thumbSize: number) {
    return (side - thumbSize) / 2
  }

  private static toCartesian(degree: number, radius: number) {
    const rad = degree / 180 * Math.PI

    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius
    }
  }

  private static state(
    side: number,
    thumbRadius: number,
    value: Animated.Node<number>,
    codeKey: number = 0,
    snapToCenter: number = 0,
    initialHue: number = 0,
    initialSaturation: number = 0
  ): Required<State> {
    const halfThumbSize = thumbRadius / 2
    const center = HueSaturationWheel.center(side, thumbRadius)
    const radius = center
    const startX = new Value<number>(0)
    const startY = new Value<number>(0)
    const cartesian = HueSaturationWheel.toCartesian(-initialHue, initialSaturation * radius)
    const posX = new Value(center + cartesian.x)
    const posY = new Value(center + cartesian.y)
    const gestureState = new Value(GestureState.UNDETERMINED)
    const distance = sqrt(add(pow(sub(posX, center), 2), pow(sub(posY, center), 2)))
    const shouldSnapToCenter = lessThan(distance, snapToCenter)
    const dist = cond(shouldSnapToCenter, 0, distance)
    const isOutsideWheel = greaterThan(dist, radius)
    const isInCenter = eq(dist, 0)
    const sinT = cond(isInCenter, 0, divide(sub(posY, center), dist))
    const cosT = cond(isInCenter, 1, divide(sub(posX, center), dist))

    const translateX: Animated.Node<number> = cond(
      shouldSnapToCenter,
      center,
      cond(isOutsideWheel, add(center, multiply(radius, cosT)), posX)
    )

    const translateY: Animated.Node<number> = cond(
      shouldSnapToCenter,
      center,
      cond(isOutsideWheel, add(center, multiply(radius, sinT)), posY)
    )

    const angle = divide(multiply(acos(cosT), 180), Math.PI)
    const hue = cond(
      greaterThan(sub(translateY, center), 0),
      sub(360, angle),
      angle
    )

    const saturation = interpolateNode(dist, {
      inputRange: [0, radius],
      outputRange: [0, 1],
      extrapolate: Extrapolate.CLAMP
    })

    return {
      codeKey: codeKey + 1,
      wheelOpacity: sub(1, value),
      gestureState,
      side,
      translateX,
      translateY,
      posX,
      posY,
      startX,
      startY,
      hue,
      saturation,
      // tslint:disable-next-line: no-any
      thumbColor: colorHSV(hue, saturation, value) as any,
      panGestureEvent: event([{
        nativeEvent: ({ x, y, state }: { x: number, y: number, state: GestureState }) => (
          block([
            set(gestureState, state),
            cond(
              eq(gestureState, GestureState.BEGAN),
              [
                set(startX, x),
                set(startY, y)
              ]
            ),
            cond(
              HueSaturationWheel.isGestureStartedInsideCircle(
                gestureState,
                startX,
                startY,
                thumbRadius,
                side
              ),
              [
                set(posX, sub(x, halfThumbSize)),
                set(posY, sub(y, halfThumbSize))
              ]
            )
          ])
        )
      }])
    }
  }

  private static side(style?: StyleProp<ViewStyle>): number | undefined {
    if (style !== undefined) {
      const { width, height } = StyleSheet.flatten(style)

      if (typeof width === 'number' && typeof height === 'number') {
        return Math.min(width, height)
      }

      if (typeof width === 'number') {
        return width
      }

      if (typeof height === 'number') {
        return height
      }
    }

    return undefined
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { style, snapToCenter, value, thumbRadius, initialHue, initialSaturation } = this.props
    const { width, height } = StyleSheet.flatten(style)
    const { width: prevWidth, height: prevHeight } = StyleSheet.flatten(prevProps.style)

    if (prevHeight !== height || prevWidth !== width) {
      this.setState({ side: HueSaturationWheel.side(style) })

    } else {
      const { side = HueSaturationWheel.side(style) } = this.state

      if ((
        side !== undefined && thumbRadius !== undefined
      ) && (
        side !== prevState.side ||
        value !== prevProps.value ||
        snapToCenter !== prevProps.snapToCenter ||
        thumbRadius !== prevProps.thumbRadius
      )) {
        this.setState(HueSaturationWheel.state(
          side,
          thumbRadius,
          value!,
          prevState.codeKey,
          snapToCenter,
          initialHue,
          initialSaturation
        ))
      }
    }
  }

  render() {
    const { style, valueGestureState, thumbRadius, value } = this.props
    const {
      side,
      codeKey,
      thumbColor,
      translateX,
      translateY,
      wheelOpacity,
      panGestureEvent,
      gestureState,
      startX,
      startY,
      hue,
      saturation
    } = this.state

    const containerStyle = side === undefined ? {} : { width: side, height: side }

    return (
      <View
        style={[defaultStyle.container, style, containerStyle]}
        key={`wheel_${codeKey}`}
        onLayout={this.layout}
      >
        {(
          side !== undefined &&
          thumbColor !== undefined &&
          translateX !== undefined &&
          translateY !== undefined &&
          wheelOpacity !== undefined &&
          panGestureEvent !== undefined &&
          gestureState !== undefined &&
          codeKey !== undefined &&
          startX !== undefined &&
          startY !== undefined &&
          valueGestureState !== undefined &&
          thumbRadius !== undefined &&
          hue !== undefined &&
          saturation !== undefined &&
          value !== undefined
        ) ? (
            <Wheel
              hue={hue}
              saturation={saturation}
              value={value}
              side={side}
              thumbColor={thumbColor}
              startX={startX}
              startY={startY}
              translateX={translateX}
              translateY={translateY}
              thumbSize={thumbRadius}
              wheelOpacity={wheelOpacity}
              panGestureEvent={panGestureEvent}
              gestureState={gestureState}
              valueGestureState={valueGestureState}
              onColorChange={this.colorChange}
              onColorChangeComplete={this.colorChangeComplete}
              codeKey={codeKey}
            />
          )
          : false
        }
      </View>
    )
  }

  private colorChangeComplete = ([h, s, v]: readonly number[]) => {
    const { onColorChangeComplete = noop } = this.props

    onColorChangeComplete({ h, s, v })
  }

  private colorChange = ([h, s, v]: readonly number[]) => {
    const { onColorChange = noop } = this.props

    onColorChange({ h, s, v })
  }

  private layout = ({ nativeEvent: { layout: { width, height } } }: LayoutChangeEvent) => {
    this.setState({ side: Math.min(width, height) })
  }
}

const noop = () => { /* */ }
