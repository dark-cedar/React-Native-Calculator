import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} fill="none">
    <Path
      stroke="#373737"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M26.25 15h-15m15-7.5h-15m15 15h-15m-5-7.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm0-7.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm0 15a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
    />
  </Svg>
)
export default SvgComponent
