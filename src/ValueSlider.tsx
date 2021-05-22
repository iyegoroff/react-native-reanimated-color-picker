import React from 'react'
import Animated from 'react-native-reanimated'
import {
  View,
  ViewStyle,
  StyleSheet,
  LayoutChangeEvent,
  StyleProp
} from 'react-native'
import {
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
  State as GestureState
} from 'react-native-gesture-handler'
import { Slider } from './Slider'
import { Size } from './size'
import { defaultStyle } from './defaultStyle'

const {
  Value,
  lessThan,
  greaterThan,
  cond,
  divide,
  color,
  event,
  block,
  set,
  and,
  neq,
  multiply,
  round,
  sub
} = Animated

type Props = {
  readonly style: StyleProp<ViewStyle>
  readonly initialValue?: number
  readonly onValueInit: (
    value: Animated.Node<number>,
    gestureState: Animated.Node<GestureState>
  ) => void
  readonly thumbWidth?: number
}

type State = {
  readonly width?: number
  readonly height?: number
  readonly pos?: Animated.Node<number>
  readonly translate?: Animated.Node<number>
  readonly value?: Animated.Node<number>
  readonly thumbColor?: Animated.Node<string>
  readonly panGestureEvent?: (
    event: PanGestureHandlerGestureEvent | TapGestureHandlerGestureEvent
  ) => void
  readonly gestureState?: Animated.Node<GestureState>
  readonly codeKey?: number
}

export class ValueSlider extends React.PureComponent<Props, State> {
  static defaultProps: Partial<Props> = {
    thumbWidth: 50
  }

  constructor(props: Props) {
    super(props)

    const { style, thumbWidth, initialValue } = props
    const { width, height } = ValueSlider.size(style)

    this.state =
      width === undefined || height === undefined || thumbWidth === undefined
        ? {}
        : ValueSlider.state(width, height, thumbWidth, 0, initialValue)
  }

  private static state(
    width: number,
    height: number,
    thumbWidth: number,
    codeKey: number = 0,
    initialValue: number = 1
  ): Required<State> {
    const size = width - thumbWidth
    const pos = new Value(size * initialValue)
    const gestureState = new Value(GestureState.UNDETERMINED)

    const translate: Animated.Node<number> = cond(
      greaterThan(pos, size),
      size,
      cond(lessThan(pos, 0), 0, pos)
    )

    const value = divide(translate, size)
    const col = round(multiply(value, 255))

    return {
      codeKey: codeKey + 1,
      width,
      height,
      gestureState,
      pos,
      translate,
      value,
      // tslint:disable-next-line: no-any
      thumbColor: color(col, col, col) as any,
      panGestureEvent: event([
        {
          nativeEvent: ({
            x,
            state
          }: {
            x: number
            y: number
            state: GestureState
          }) =>
            block([
              set(gestureState, state),
              cond(
                and(
                  neq(gestureState, GestureState.UNDETERMINED),
                  neq(gestureState, GestureState.FAILED)
                ),
                set(pos, sub(x, thumbWidth / 2))
              )
            ])
        }
      ])
    }
  }

  private static size(style?: StyleProp<ViewStyle>): Size {
    if (style !== undefined) {
      const { width, height } = StyleSheet.flatten(style)

      if (typeof width === 'number' && typeof height === 'number') {
        return { width, height }
      }
    }

    return { width: undefined, height: undefined }
  }

  componentDidMount() {
    const { width, height, value } = this.state

    if (width !== undefined && height !== undefined && value !== undefined) {
      this.props.onValueInit(value, new Animated.Value(GestureState.END))
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { style, onValueInit, thumbWidth, initialValue } = this.props
    const { width, height } = StyleSheet.flatten(style)
    const { width: prevWidth, height: prevHeight } = StyleSheet.flatten(
      prevProps.style
    )
    const size = ValueSlider.size(style)

    if (prevHeight !== height || prevWidth !== width) {
      this.setState(size)
    } else {
      const { width: curWidth = size.width, height: curHeight = size.height } =
        this.state

      if (
        curWidth !== undefined &&
        curHeight !== undefined &&
        thumbWidth !== undefined &&
        (curWidth !== prevState.width ||
          curHeight !== prevState.height ||
          thumbWidth !== prevProps.thumbWidth)
      ) {
        const state = ValueSlider.state(
          curWidth,
          curHeight,
          thumbWidth,
          prevState.codeKey,
          initialValue
        )

        onValueInit(state.value, state.gestureState)
        this.setState(state)
      }
    }
  }

  render() {
    const { width, height, translate, thumbColor, panGestureEvent, codeKey } =
      this.state
    const { style, thumbWidth } = this.props

    return (
      <View
        style={[defaultStyle.container, style]}
        key={`slider_${codeKey}`}
        onLayout={this.layout}
      >
        {width !== undefined &&
        height !== undefined &&
        thumbColor !== undefined &&
        translate !== undefined &&
        panGestureEvent !== undefined &&
        thumbWidth !== undefined ? (
          <Slider
            width={width}
            height={height}
            translate={translate}
            thumbColor={thumbColor}
            panGestureEvent={panGestureEvent}
            thumbWidth={thumbWidth}
          />
        ) : (
          false
        )}
      </View>
    )
  }

  private layout = ({
    nativeEvent: {
      layout: { width, height }
    }
  }: LayoutChangeEvent) => {
    this.setState({ width, height })
  }
}
