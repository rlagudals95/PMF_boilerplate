import PaymentCancelPage from "@/modules/payment/ui/payment-cancel-page";

type SearchParams = Record<string, string | string[] | undefined>;

const getFirstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function PayCancelPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <PaymentCancelPage
      orderNo={getFirstValue(params.orderNo)}
      payToken={getFirstValue(params.payToken)}
      payMethod={getFirstValue(params.payMethod)}
    />
  );
}
