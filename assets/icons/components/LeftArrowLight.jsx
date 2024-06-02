import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} fill="none">
    <Path
      stroke="#373737"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M25 15H5m0 0 7.5 7.5M5 15l7.5-7.5"
    />
  </Svg>
)
export default SvgComponent
