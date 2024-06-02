import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
const SvgComponent = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} fill="none">
    <Circle cx={16} cy={15} r={9} fill="#FEFEFE" />
    <Path
      fill="#7BAECF"
      fillRule="evenodd"
      d="M15 1.25C7.406 1.25 1.25 7.406 1.25 15S7.406 28.75 15 28.75 28.75 22.594 28.75 15 22.594 1.25 15 1.25Zm6.509 10.884a1.25 1.25 0 0 0-1.768-1.768l-6.616 6.616-2.866-2.866a1.25 1.25 0 0 0-1.768 1.768l3.75 3.75a1.25 1.25 0 0 0 1.768 0l7.5-7.5Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default SvgComponent
