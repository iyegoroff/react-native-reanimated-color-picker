# react-native-reanimated-color-picker
[![npm version](https://badge.fury.io/js/react-native-reanimated-color-picker.svg?t=1495378566925)](https://badge.fury.io/js/react-native-reanimated-color-picker)
[![CircleCI](https://circleci.com/gh/iyegoroff/react-native-reanimated-color-picker.svg?style=svg)](https://circleci.com/gh/iyegoroff/react-native-reanimated-color-picker)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/standard/standard)
[![Dependency Status](https://david-dm.org/iyegoroff/react-native-reanimated-color-picker.svg?t=1495378566925)](https://david-dm.org/iyegoroff/react-native-reanimated-color-picker)
[![devDependencies Status](https://david-dm.org/iyegoroff/react-native-reanimated-color-picker/dev-status.svg)](https://david-dm.org/iyegoroff/react-native-reanimated-color-picker?type=dev)
[![typings included](https://img.shields.io/badge/typings-included-brightgreen.svg?t=1495378566925)](package.json)
[![npm](https://img.shields.io/npm/l/express.svg?t=1495378566925)](https://www.npmjs.com/package/react-native-reanimated-color-picker)

Natively animated HSV color picker for iOS & Android

## Installation

- Install peer dependencies: [react-native-image-filter-kit](https://github.com/iyegoroff/react-native-image-filter-kit#react-native-image-filter-kit), [react-native-reanimated](https://github.com/kmagiera/react-native-reanimated#getting-started), [react-native-gesture-handler](https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html#installation)

- `$ npm install react-native-reanimated-color-picker --save`

## Demo

<img src="./demo.gif" height="500">

## Example

```jsx
import * as React from 'react'
import { HueSaturationValuePicker } from 'react-native-reanimated-color-picker'

const wheelStyle = { width: '100%' }
const sliderStyle = { height: 50, width: '100%' }

const colorChanged = ({ h, s, v }) => {
  console.warn(h, s, v)
}

const picker = (
  <HueSaturationValuePicker
    wheelStyle={wheelStyle}
    sliderStyle={sliderStyle}
    onColorChangeComplete={colorChanged}
  />
)
```

## Description

There are three components:
- `HueSaturationWheel` - a wheel for selecting hue and saturation with constant value = 1
- `ValueSlider` - a slider for selecting value
- `HueSaturationValuePicker` - a composition of two first components

The library doesn't provide any color conversion functions, so you have to use a third-party module for color conversion

## Reference

### HueSaturationWheel props

<table>
  <tr>
    <th>prop</th>
    <th>type</th>
    <th>default</th>
    <th>desc</th>
  </tr>
  <tr>
    <td>style</td>
    <td><code>ViewStyle</code></td>
    <td>-</td>
    <td><strong>required</strong></td>
  </tr>
  <tr>
    <td>snapToCenter</td>
    <td><code>number</code></td>
    <td>-</td>
    <td>Thumb will snap to center of the wheel when the distance is less than <code>snapToCenter</code></td>
  </tr>
  <tr>
    <td>onColorChangeComplete</td>
    <td><pre>(color:&nbsp;{
  h:&nbsp;number,
  s:&nbsp;number,
  v:&nbsp;number
})&nbsp;=>&nbsp;void</pre></td>
    <td>-</td>
    <td>Called when touch ended</td>
  </tr>
  <tr>
    <td>onColorChange</td>
    <td><pre>(color:&nbsp;{
  h:&nbsp;number,
  s:&nbsp;number,
  v:&nbsp;number
})&nbsp;=>&nbsp;void</pre></td>
    <td>-</td>
    <td>Called when touch moved</td>
  </tr>
  <tr>
    <td>value</td>
    <td><code>Animated.Node&lt;number&gt;</code></td>
    <td><code>new Animated.Value(1)</code></td>
    <td>value node from ValueSlider</td>
  </tr>
  <tr>
    <td>valueGestureState</td>
    <td><code>Animated.Node&lt;number&gt;</code></td>
    <td><code>new Animated.Value(State.END)</code></td>
    <td>ValueSlider gesture state</td>
  </tr>
  <tr>
    <td>thumbRadius</td>
    <td><code>number</code></td>
    <td><code>50</code></td>
    <td></td>
  </tr>
  <tr>
    <td>initialHue</td>
    <td><code>number</code></td>
    <td><code>0</code></td>
    <td>hue in degrees</td>
  </tr>
  <tr>
    <td>initialSaturation</td>
    <td><code>number</code></td>
    <td><code>0</code></td>
    <td>[0..1]</td>
  </tr>
</table>

### ValueSlider props


<table>
  <tr>
    <th>prop</th>
    <th>type</th>
    <th>default</th>
    <th>desc</th>
  </tr>
  <tr>
    <td>style</td>
    <td><code>ViewStyle</code></td>
    <td>-</td>
    <td><strong>required</strong></td>
  </tr>
  <tr>
    <td>thumbWidth</td>
    <td><code>number</code></td>
    <td><code>50</code></td>
    <td></td>
  </tr>
  <tr>
    <td>initialValue</td>
    <td><code>number</code></td>
    <td><code>1</code></td>
    <td>[0..1]</td>
  </tr>
  <tr>
    <td>onValueInit</td>
    <td><pre>(value:&nbsp;Animated.Node&lt;number&gt;,
 gestureState:&nbsp;Animated.Node&lt;number&gt;)&nbsp;=>&nbsp;void</pre></td>
    <td>-</td>
    <td>used to wire ValudeSlider with HueSaturationWheel</td>
  </tr>
</table>


### HueSaturationValuePicker props

<table>
  <tr>
    <th>prop</th>
    <th>type</th>
    <th>default</th>
    <th>desc</th>
  </tr>
  <tr>
    <td>wheelStyle</td>
    <td><code>ViewStyle</code></td>
    <td>-</td>
    <td><strong>required</strong></td>
  </tr>
  <tr>
    <td>sliderStyle</td>
    <td><code>ViewStyle</code></td>
    <td>-</td>
    <td><strong>required</strong></td>
  </tr>
  <tr>
    <td>snapToCenter</td>
    <td><code>number</code></td>
    <td>-</td>
    <td>Thumb will snap to center of the wheel when the distance is less than <code>snapToCenter</code></td>
  </tr>
  <tr>
    <td>onColorChangeComplete</td>
    <td><pre>(color:&nbsp;{
  h:&nbsp;number,
  s:&nbsp;number,
  v:&nbsp;number
})&nbsp;=>&nbsp;void</pre></td>
    <td>-</td>
    <td>Called when touch ended</td>
  </tr>
  <tr>
    <td>onColorChange</td>
    <td><pre>(color:&nbsp;{
  h:&nbsp;number,
  s:&nbsp;number,
  v:&nbsp;number
})&nbsp;=>&nbsp;void</pre></td>
    <td>-</td>
    <td>Called when touch moved</td>
  </tr>
  <tr>
    <td>thumbSize</td>
    <td><code>number</code></td>
    <td><code>50</code></td>
    <td>thumbRadius and thumbWidth</td>
  </tr>
  <tr>
    <td>initialHue</td>
    <td><code>number</code></td>
    <td><code>0</code></td>
    <td>hue in degrees</td>
  </tr>
  <tr>
    <td>initialSaturation</td>
    <td><code>number</code></td>
    <td><code>0</code></td>
    <td>[0..1]</td>
  </tr>
  <tr>
    <td>initialValue</td>
    <td><code>number</code></td>
    <td><code>1</code></td>
    <td>[0..1]</td>
  </tr>
</table>

## Credits

- `colorHSV` function was taken from `react-native-reanimated` [example](https://github.com/kmagiera/react-native-reanimated/blob/master/Example/colors/index.js) by @kmagiera
