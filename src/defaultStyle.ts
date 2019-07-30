import { ViewStyle, StyleSheet } from 'react-native'

type Styles = {
  readonly container: ViewStyle
}

export const defaultStyle = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: '100%'
  }
})
