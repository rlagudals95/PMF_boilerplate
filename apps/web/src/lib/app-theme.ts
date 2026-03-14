import type { CSSProperties } from "react";

export type HexColor = `#${string}`;

export type AppThemeBrandOverrides = {
  primary: HexColor;
  primaryForeground: HexColor;
  accent?: HexColor;
  accentForeground?: HexColor;
};

type AppTheme = {
  background: string;
  backgroundAlt: string;
  foreground: string;
  surface: string;
  surfaceForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  ring: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  danger: string;
  dangerForeground: string;
};

export type ThemeCssVars = CSSProperties & Record<`--${string}`, string>;

export const isHexColor = (value: string): value is HexColor =>
  /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value);

const defaultTheme: AppTheme = {
  background: "42 33% 98%",
  backgroundAlt: "210 40% 96%",
  foreground: "222 47% 11%",
  surface: "0 0% 100%",
  surfaceForeground: "222 47% 11%",
  muted: "210 28% 95%",
  mutedForeground: "215 16% 40%",
  border: "214 32% 88%",
  ring: "222 47% 11%",
  primary: "222 47% 11%",
  primaryForeground: "210 40% 98%",
  accent: "222 47% 11%",
  accentForeground: "210 40% 98%",
  success: "142 71% 45%",
  successForeground: "138 76% 97%",
  warning: "43 96% 56%",
  warningForeground: "222 47% 11%",
  danger: "0 72% 51%",
  dangerForeground: "0 86% 97%",
};

const toCssVarName = (token: string) =>
  `--${token.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;

function hexToHslToken(color: HexColor): string {
  const hex = color.slice(1);
  const normalizedHex =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : hex;

  if (!/^[0-9a-fA-F]{6}$/.test(normalizedHex)) {
    throw new Error(`Invalid hex color: ${color}`);
  }

  const red = Number.parseInt(normalizedHex.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return `0 0% ${Math.round(lightness * 100)}%`;
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue = 0;

  switch (max) {
    case red:
      hue = 60 * (((green - blue) / delta) % 6);
      break;
    case green:
      hue = 60 * ((blue - red) / delta + 2);
      break;
    case blue:
      hue = 60 * ((red - green) / delta + 4);
      break;
    default:
      hue = 0;
  }

  if (hue < 0) {
    hue += 360;
  }

  return `${Math.round(hue)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
}

function createAppTheme(overrides: AppThemeBrandOverrides): AppTheme {
  const primary = hexToHslToken(overrides.primary);
  const primaryForeground = hexToHslToken(overrides.primaryForeground);
  const accent = overrides.accent ? hexToHslToken(overrides.accent) : primary;
  const accentForeground = overrides.accentForeground
    ? hexToHslToken(overrides.accentForeground)
    : primaryForeground;

  return {
    ...defaultTheme,
    primary,
    primaryForeground,
    accent,
    accentForeground,
    ring: primary,
  };
}

export const brandTheme: AppThemeBrandOverrides = {
  primary: "#f6a328",
  primaryForeground: "#0f172a",
};

export const appTheme = createAppTheme(brandTheme);

function appThemeToCssVars(theme: AppTheme): ThemeCssVars {
  return Object.fromEntries(
    Object.entries(theme).map(([token, value]) => [toCssVarName(token), value]),
  ) as ThemeCssVars;
}

export function createThemeCssVars(overrides: AppThemeBrandOverrides): ThemeCssVars {
  return appThemeToCssVars(createAppTheme(overrides));
}

export const themeCssVars = appThemeToCssVars(appTheme);
