"use client";

import { CheckCircle2, Copy, Palette, RotateCcw } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Input,
  CardTitle,
} from "@pmf/ui";

import { brandTheme, createThemeCssVars, type AppThemeBrandOverrides } from "@/lib/app-theme";

type BrandThemePlaygroundProps = {
  themeFilePath: string;
  themeSteps: readonly string[];
  themeSurfaces: readonly string[];
};

type ThemeDraft = {
  primary: string;
  primaryForeground: string;
  accent: string;
  usePrimaryAccent: boolean;
};

type EditableThemeField = Exclude<keyof ThemeDraft, "usePrimaryAccent">;

const defaultDraft: ThemeDraft = {
  primary: brandTheme.primary,
  primaryForeground: brandTheme.primaryForeground,
  accent: brandTheme.accent ?? brandTheme.primary,
  usePrimaryAccent: !brandTheme.accent,
};

const themeFieldMeta = [
  {
    key: "primary",
    label: "Primary",
    description: "주요 CTA와 강조색",
  },
  {
    key: "primaryForeground",
    label: "Primary Foreground",
    description: "primary 위에 올라가는 텍스트 색",
  },
] as const;

const hexPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function isValidHexColor(value: string): boolean {
  return hexPattern.test(value.trim());
}

function toColorInputValue(
  value: AppThemeBrandOverrides["primary"],
): AppThemeBrandOverrides["primary"] {
  if (value.length === 4) {
    const expanded = value
      .slice(1)
      .split("")
      .map((char) => `${char}${char}`)
      .join("");

    return `#${expanded}`;
  }

  return value;
}

function normalizeHexColor(
  value: string,
  fallback: AppThemeBrandOverrides["primary"],
): AppThemeBrandOverrides["primary"] {
  const normalized = value.trim();

  if (!hexPattern.test(normalized)) {
    return fallback;
  }

  return normalized as AppThemeBrandOverrides["primary"];
}

export function BrandThemePlayground({
  themeFilePath,
  themeSteps,
  themeSurfaces,
}: BrandThemePlaygroundProps) {
  const [draft, setDraft] = useState(defaultDraft);
  const [copyLabel, setCopyLabel] = useState("스니펫 복사");

  const resolvedPrimary = normalizeHexColor(draft.primary, brandTheme.primary);
  const resolvedPrimaryForeground = normalizeHexColor(
    draft.primaryForeground,
    brandTheme.primaryForeground,
  );
  const resolvedAccent = normalizeHexColor(draft.accent, resolvedPrimary);
  const isPrimaryValid = isValidHexColor(draft.primary);
  const isPrimaryForegroundValid = isValidHexColor(draft.primaryForeground);
  const isAccentValid = draft.usePrimaryAccent || isValidHexColor(draft.accent);

  const resolvedTheme: AppThemeBrandOverrides = draft.usePrimaryAccent
    ? {
        primary: resolvedPrimary,
        primaryForeground: resolvedPrimaryForeground,
      }
    : {
        primary: resolvedPrimary,
        primaryForeground: resolvedPrimaryForeground,
        accent: resolvedAccent,
      };

  const themeSnippet = [
    "export const brandTheme = {",
    `  primary: "${resolvedTheme.primary}",`,
    `  primaryForeground: "${resolvedTheme.primaryForeground}",`,
    ...(resolvedTheme.accent ? [`  accent: "${resolvedTheme.accent}",`] : []),
    "};",
  ].join("\n");

  useEffect(() => {
    const root = document.documentElement;
    const cssVars = createThemeCssVars(
      draft.usePrimaryAccent
        ? {
            primary: resolvedPrimary,
            primaryForeground: resolvedPrimaryForeground,
          }
        : {
            primary: resolvedPrimary,
            primaryForeground: resolvedPrimaryForeground,
            accent: resolvedAccent,
          },
    ) as Record<string, string>;
    const previousValues: Array<[string, string]> = Object.keys(cssVars).map((token) => [
      token,
      root.style.getPropertyValue(token),
    ]);

    Object.entries(cssVars).forEach(([token, value]) => {
      root.style.setProperty(token, value);
    });

    return () => {
      previousValues.forEach(([token, value]) => {
        if (value) {
          root.style.setProperty(token, value);
          return;
        }

        root.style.removeProperty(token);
      });
    };
  }, [draft.usePrimaryAccent, resolvedAccent, resolvedPrimary, resolvedPrimaryForeground]);

  const setThemeField = <TKey extends keyof ThemeDraft>(key: TKey, value: ThemeDraft[TKey]) => {
    setCopyLabel("스니펫 복사");
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const setColorField =
    (key: EditableThemeField) => (event: ChangeEvent<HTMLInputElement>) => {
      setThemeField(key, event.currentTarget.value);
    };

  const handleReset = () => {
    setDraft(defaultDraft);
    setCopyLabel("스니펫 복사");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(themeSnippet);
      setCopyLabel("복사됨");
    } catch {
      setCopyLabel("복사 실패");
    }
  };

  return (
    <Card className="overflow-hidden bg-white/95">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="accent">Interactive Theme Editor</Badge>
          <Palette className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl">
            랜딩에서 바로 미리 보고, 마지막에 파일로 반영합니다
          </CardTitle>
          <CardDescription className="leading-6">
            아래 컨트롤은 현재 브라우저 세션의 CSS 변수를 바로 바꿉니다. 값이 마음에 들면
            스니펫을 복사해 <code className="font-mono text-xs">{themeFilePath}</code>에
            반영하면 됩니다.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {themeFieldMeta.map((field) => (
            <div
              key={field.key}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-950">{field.label}</p>
                <p className="text-sm text-slate-600">{field.description}</p>
                {field.key === "primary" && !isPrimaryValid ? (
                  <p className="text-xs text-danger">hex 형식으로 입력하면 즉시 미리보기에 반영됩니다.</p>
                ) : null}
                {field.key === "primaryForeground" && !isPrimaryForegroundValid ? (
                  <p className="text-xs text-danger">hex 형식으로 입력하면 즉시 미리보기에 반영됩니다.</p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <input
                  aria-label={field.label}
                  type="color"
                  value={toColorInputValue(
                    field.key === "primary" ? resolvedPrimary : resolvedPrimaryForeground,
                  )}
                  onChange={setColorField(field.key)}
                  className="h-11 w-14 cursor-pointer rounded-xl border border-border bg-transparent p-1"
                />
                <Input
                  aria-label={`${field.label} hex`}
                  value={draft[field.key]}
                  onChange={setColorField(field.key)}
                  className="w-36 font-mono"
                  spellCheck={false}
                />
                <div className="min-w-[112px] rounded-xl border border-border bg-muted/60 px-3 py-2 font-mono text-sm text-slate-700">
                  {draft[field.key]}
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-950">Accent</p>
                <p className="text-sm text-slate-600">
                  꺼두면 primary를 그대로 재사용합니다.
                </p>
                {!isAccentValid ? (
                  <p className="text-xs text-danger">accent도 hex 형식으로 입력하면 즉시 적용됩니다.</p>
                ) : null}
              </div>
              <Button
                type="button"
                variant={draft.usePrimaryAccent ? "default" : "outline"}
                size="sm"
                onClick={() => setThemeField("usePrimaryAccent", !draft.usePrimaryAccent)}
              >
                {draft.usePrimaryAccent ? "Accent = Primary" : "Accent Custom"}
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                aria-label="Accent"
                type="color"
                value={toColorInputValue(draft.usePrimaryAccent ? resolvedPrimary : resolvedAccent)}
                onChange={setColorField("accent")}
                disabled={draft.usePrimaryAccent}
                className="h-11 w-14 cursor-pointer rounded-xl border border-border bg-transparent p-1 disabled:cursor-not-allowed disabled:opacity-40"
              />
              <Input
                aria-label="Accent hex"
                value={draft.usePrimaryAccent ? draft.primary : draft.accent}
                onChange={setColorField("accent")}
                disabled={draft.usePrimaryAccent}
                className="w-36 font-mono"
                spellCheck={false}
              />
              <div className="min-w-[112px] rounded-xl border border-border bg-muted/60 px-3 py-2 font-mono text-sm text-slate-700">
                {draft.usePrimaryAccent ? `${draft.primary} (primary)` : draft.accent}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-muted/50 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button">Primary CTA</Button>
            <Button type="button" variant="secondary">
              Secondary
            </Button>
            <Badge variant="accent">Accent Badge</Badge>
            <div className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-slate-700 shadow-glow">
              Focus ring / glow preview
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Theme applies to
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {themeSurfaces.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-950">app-theme.ts snippet</p>
              <p className="text-sm text-slate-600">
                편집 결과를 파일에 반영할 때 그대로 사용합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                초기값 복원
              </Button>
              <Button type="button" size="sm" onClick={() => void handleCopy()}>
                <Copy className="mr-2 h-4 w-4" />
                {copyLabel}
              </Button>
            </div>
          </div>

          <pre className="mt-4 overflow-x-auto rounded-2xl bg-foreground p-4 text-sm leading-6 text-background">
            <code>{themeSnippet}</code>
          </pre>

          <div className="mt-5 space-y-3">
            {themeSteps.map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
