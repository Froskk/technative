const BASE_FONT_SIZE = 16;
const pxToEm = (px: number): string => `${px / BASE_FONT_SIZE}em`;

const theme = {
  color: {
    dark: "hsl(200, 10%, 10%)",
    light: "hsl(200, 100%, 90%)",
    accent: "hsl(200, 100%, 75%)",
  },
  size: {
    s: "0.8rem",
    m: "1rem",
    l: "2.5rem",
    xl: "5rem",
  },
  font: {
    tiny: pxToEm(12),
    small: pxToEm(14),
    medium: pxToEm(16),
    large: pxToEm(24),
    huge: pxToEm(60),
  },
};

export type Theme = typeof theme;

declare module "styled-components" {
  interface DefaultTheme extends Theme {}
}

export { theme, BASE_FONT_SIZE };
