import styled from "styled-components"

import IconButton from "../IconButton"
import Moon from "../Svgs/Moon"
import Sun from "../Svgs/Sun"

export const SunButton = styled(IconButton).attrs(
  ({
    theme: {
      colors: { iconBg },
    },
  }) => ({
    Icon: <Sun />,
    bgColor: iconBg,
    size: 32,
    mobileSize: 28,
    svgSize: 16,
    mobileSvgSize: 14,
    "aria-label": "Toggle Darkmode",
  }),
)``

export const MoonButton = styled(IconButton).attrs(
  ({
    theme: {
      colors: { iconBg },
    },
  }) => ({
    Icon: <Moon />,
    bgColor: iconBg,
    size: 32,
    mobileSize: 28,
    svgSize: 16,
    mobileSvgSize: 14,
    "aria-label": "Toggle Darkmode",
  }),
)``
