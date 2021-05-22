import React from 'react'
import { ViewStyle, StyleProp } from 'react-native'
import Animated from 'react-native-reanimated'
import { State as GestureState } from 'react-native-gesture-handler'
import { HSV, HueSaturationWheel } from './HueSaturationWheel'
import { ValueSlider } from './ValueSlider'

type Props = {
  readonly wheelStyle: StyleProp<ViewStyle>
  readonly sliderStyle: StyleProp<ViewStyle>
  readonly snapToCenter?: number
  readonly onColorChangeComplete?: (color: HSV) => void
  readonly onColorChange?: (color: HSV) => void
  readonly thumbSize?: number
  readonly initialHue?: number
  readonly initialSaturation?: number
  readonly initialValue?: number
}

type State = {
  readonly value: Animated.Node<number>
  readonly valueGestureState: Animated.Node<GestureState>
}

export class HueSaturationValuePicker extends React.PureComponent<
  Props,
  State
> {
  state: State = {
    value: new Animated.Value(1),
    valueGestureState: new Animated.Value(GestureState.UNDETERMINED)
  }

  render() {
    const {
      wheelStyle,
      sliderStyle,
      thumbSize,
      snapToCenter,
      initialHue,
      initialValue,
      initialSaturation,
      onColorChange,
      onColorChangeComplete
    } = this.props
    const { value, valueGestureState } = this.state

    return (
      <>
        <HueSaturationWheel
          style={wheelStyle}
          initialHue={initialHue}
          initialSaturation={initialSaturation}
          snapToCenter={snapToCenter}
          onColorChangeComplete={onColorChangeComplete}
          onColorChange={onColorChange}
          value={value}
          valueGestureState={valueGestureState}
          thumbRadius={thumbSize}
        />
        <ValueSlider
          initialValue={initialValue}
          style={sliderStyle}
          onValueInit={this.valueInit}
          thumbWidth={thumbSize}
        />
      </>
    )
  }

  private valueInit = (
    value: Animated.Node<number>,
    valueGestureState: Animated.Node<GestureState>
  ) => {
    this.setState({ value, valueGestureState })
  }
}
