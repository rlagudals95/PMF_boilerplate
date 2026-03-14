const TOSS_CREATE_PAYMENT_URL = "https://pay.toss.im/api/v2/payments";

type CreateTossCheckoutInput = {
  orderNo: string;
  amount: number;
  productDescription: string;
  customerName: string;
  customerEmail?: string;
};

type CreateTossCheckoutResult = {
  payToken: string;
  checkoutUrl: string;
  raw: Record<string, unknown>;
};

const optionalString = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getTossConfiguration = () => {
  const apiKey = optionalString(process.env.TOSS_PAYMENTS_API_KEY);
  const siteUrl = optionalString(process.env.NEXT_PUBLIC_SITE_URL);

  if (!apiKey) {
    throw new Error("TOSS_PAYMENTS_API_KEY가 설정되어 있지 않습니다.");
  }

  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL이 설정되어 있지 않습니다.");
  }

  return {
    apiKey,
    siteUrl: trimTrailingSlash(siteUrl),
  };
};

const resolveCheckoutUrl = (value: unknown) => {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "url" in value &&
    typeof value.url === "string" &&
    value.url.length > 0
  ) {
    return value.url;
  }

  return undefined;
};

const asRecord = (value: unknown) =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

export const isTossPaymentsConfigured = () => {
  return Boolean(
    optionalString(process.env.TOSS_PAYMENTS_API_KEY) &&
      optionalString(process.env.NEXT_PUBLIC_SITE_URL),
  );
};

export const createTossCheckout = async (
  input: CreateTossCheckoutInput,
): Promise<CreateTossCheckoutResult> => {
  const { apiKey, siteUrl } = getTossConfiguration();
  const body = new URLSearchParams({
    apiKey,
    orderNo: input.orderNo,
    amount: String(input.amount),
    amountTaxFree: "0",
    productDesc: input.productDescription,
    autoExecute: "true",
    retUrl: `${siteUrl}/pay/result`,
    retCancelUrl: `${siteUrl}/pay/cancel`,
    resultCallback: `${siteUrl}/api/payments/toss/callback`,
  });

  const customerName = optionalString(input.customerName);
  const customerEmail = optionalString(input.customerEmail);

  if (customerName) {
    body.set("customerName", customerName);
  }

  if (customerEmail) {
    body.set("customerEmail", customerEmail);
  }

  const response = await fetch(TOSS_CREATE_PAYMENT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: body.toString(),
    cache: "no-store",
  });

  const payload = asRecord(await response.json().catch(() => null));
  const checkoutUrl = resolveCheckoutUrl(payload.checkoutPage);
  const payToken = typeof payload.payToken === "string" ? payload.payToken : undefined;
  const errorMessage = typeof payload.msg === "string" ? payload.msg : undefined;

  if (!response.ok || !checkoutUrl || !payToken) {
    throw new Error(errorMessage ?? "Toss 결제 세션 생성에 실패했습니다.");
  }

  return {
    payToken,
    checkoutUrl,
    raw: payload,
  };
};
