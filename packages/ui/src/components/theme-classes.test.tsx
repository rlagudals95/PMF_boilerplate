import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Badge } from "./badge";
import { buttonVariants } from "./button";
import { Input } from "./input";

describe("theme classes", () => {
  it("keeps button variants tied to semantic theme tokens", () => {
    expect(buttonVariants({ variant: "default" })).toContain("bg-primary");
    expect(buttonVariants({ variant: "default" })).toContain("text-primary-foreground");
    expect(buttonVariants({ variant: "secondary" })).toContain("ring-border");
  });

  it("renders inputs with semantic surface and focus classes", () => {
    const markup = renderToStaticMarkup(<Input placeholder="Email" />);

    expect(markup).toContain("border-border");
    expect(markup).toContain("bg-surface");
    expect(markup).toContain("focus-visible:border-primary");
  });

  it("renders accent badges with semantic brand classes", () => {
    const markup = renderToStaticMarkup(<Badge variant="accent">Brand</Badge>);

    expect(markup).toContain("bg-primary/10");
    expect(markup).toContain("text-primary");
  });
});
