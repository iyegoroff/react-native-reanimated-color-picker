import Animated from 'react-native-reanimated'

const {
  multiply,
  divide,
  abs,
  sub,
  modulo,
  color,
  round,
  add,
  cond,
  lessThan,
  proc
} = Animated

export const colorHSV = proc(
  (
    h: Animated.Adaptable<number>,
    s: Animated.Adaptable<number>,
    v: Animated.Adaptable<number>
  ): Animated.Node<number> => {
    // Converts color from HSV format into RGB
    // Formula explained here: https://www.rapidtables.com/convert/color/hsv-to-rgb.html
    const c = multiply(v, s)
    const hh = divide(h, 60)
    const x = multiply(c, sub(1, abs(sub(modulo(hh, 2), 1))))

    const m = sub(v, c)

    const colorRGB = (
      r: Animated.Adaptable<number>,
      g: Animated.Adaptable<number>,
      b: Animated.Adaptable<number>
    ) =>
      color(
        round(multiply(255, add(r, m))),
        round(multiply(255, add(g, m))),
        round(multiply(255, add(b, m)))
      )

    // @ts-expect-error
    return cond(
      lessThan(h, 60),
      colorRGB(c, x, 0),
      cond(
        lessThan(h, 120),
        colorRGB(x, c, 0),
        cond(
          lessThan(h, 180),
          colorRGB(0, c, x),
          cond(
            lessThan(h, 240),
            colorRGB(0, x, c),
            cond(lessThan(h, 300), colorRGB(x, 0, c), colorRGB(c, 0, x))
          )
        )
      )
    )
  }
)
