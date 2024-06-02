import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = ({style = {}}) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="none">
    <Path
      stroke="#373737"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4h8M4 8h24m-2.667 0-.935 14.026c-.14 2.104-.21 3.156-.665 3.954a4 4 0 0 1-1.73 1.62c-.827.4-1.881.4-3.99.4h-4.026c-2.108 0-3.163 0-3.99-.4a4 4 0 0 1-1.73-1.62c-.455-.798-.525-1.85-.665-3.954L6.667 8"
    />
  </Svg>
)
export default SvgComponent
