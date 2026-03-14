import { describe, expect, it } from "vitest";

import { appTheme, brandTheme, themeCssVars } from "./app-theme";

describe("appTheme", () => {
  it("fills non-brand tokens from shared defaults", () => {
    expect(appTheme.surface).toBe("0 0% 100%");
    expect(appTheme.mutedForeground).toBe("215 16% 40%");
    expect(appTheme.success).toBe("142 71% 45%");
  });

  it("falls back accent tokens to the primary palette when no accent override is set", () => {
    expect(brandTheme.primary).toBe("#f6a328");
    expect(brandTheme.primaryForeground).toBe("#0f172a");
    expect(appTheme.primary).toBe("36 92% 56%");
    expect(appTheme.primaryForeground).toBe("222 47% 11%");
    expect(appTheme.accent).toBe(appTheme.primary);
    expect(appTheme.accentForeground).toBe(appTheme.primaryForeground);
  });

  it("maps theme tokens to css custom properties", () => {
    expect(themeCssVars["--primary"]).toBe(appTheme.primary);
    expect(themeCssVars["--background-alt"]).toBe(appTheme.backgroundAlt);
    expect(themeCssVars["--accent-foreground"]).toBe(appTheme.accentForeground);
  });
});
