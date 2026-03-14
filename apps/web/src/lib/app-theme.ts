import type { CSSProperties } from "react";

export type AppThemeBrandOverrides = {
  primary: string;
  primaryForeground: string;
  accent?: string;
  accentForeground?: string;
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

function createAppTheme(overrides: AppThemeBrandOverrides): AppTheme {
  const accent = overrides.accent ?? overrides.primary;
  const accentForeground = overrides.accentForeground ?? overrides.primaryForeground;

  return {
    ...defaultTheme,
    primary: overrides.primary,
    primaryForeground: overrides.primaryForeground,
    accent,
    accentForeground,
    ring: overrides.primary,
  };
}

export const appTheme = createAppTheme({
  primary: "36 92% 56%",
  primaryForeground: "222 47% 11%",
});

export const themeCssVars = Object.fromEntries(
  Object.entries(appTheme).map(([token, value]) => [toCssVarName(token), value]),
) as CSSProperties;
