import { expect, test } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /PMF 실험용 보일러플레이트가.*기본으로 제공하는 기능/i,
    }),
  ).toBeVisible();
  await expect(page.getByTestId("lead-form")).toBeVisible();
});

test("funnel demo is reachable from landing", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "퍼널 데모 보기" }).first().click();

  await expect(
    page.getByRole("heading", {
      name: /단계형 제품 흐름을 빠르게 조립하는.*useFunnel.*데모/i,
    }),
  ).toBeVisible();
  await expect(page.getByTestId("funnel-demo")).toBeVisible();
});

test("lead form submits", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("이름").fill("테스트 사용자");
  await page.getByLabel("전화번호").fill("010-1234-5678");
  await page.getByLabel("관심 주제").fill("업무 자동화");
  await page
    .getByLabel("개인정보 수집 및 후속 연락에 동의합니다.")
    .check();
  await page.getByTestId("lead-submit").click();

  await expect(page.getByTestId("lead-message")).toContainText(
    "문의가 접수되었습니다",
  );
});

test("consultation form submits", async ({ page }) => {
  await page.goto("/consult");

  await page.getByLabel("이름").fill("테스트 사용자");
  await page.getByLabel("전화번호").fill("010-9999-8888");
  await page.getByLabel("상담 제품").fill("정수기 렌탈");
  await page.getByLabel("예산 범위").fill("월 3-5만원");
  await page
    .getByLabel("상담 진행을 위한 개인정보 수집 및 연락에 동의합니다.")
    .check();
  await page.getByTestId("consult-submit").click();

  await expect(page.getByTestId("consult-message")).toContainText(
    "상담 요청이 접수되었습니다",
  );
});

test("admin leads page renders", async ({ page }) => {
  await page.goto("/admin/leads");

  await expect(page.getByTestId("admin-leads-heading")).toBeVisible();
  await expect(page.getByRole("cell", { name: "김민서" })).toBeVisible();
});
