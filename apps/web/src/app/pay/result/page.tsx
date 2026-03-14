import PaymentResultPage from "@/modules/payment/ui/payment-result-page";

type SearchParams = Record<string, string | string[] | undefined>;

const getFirstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function PayResultPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <PaymentResultPage
      status={getFirstValue(params.status) ?? getFirstValue(params.paymentStatus)}
      orderNo={getFirstValue(params.orderNo)}
      payToken={getFirstValue(params.payToken)}
      payMethod={getFirstValue(params.payMethod)}
    />
  );
}
