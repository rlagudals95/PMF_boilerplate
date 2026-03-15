import { AuthCallbackPage } from "@/modules/auth/ui/auth-callback-page";

type SearchParams = Record<string, string | string[] | undefined>;

const getFirstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function AuthCallbackRoutePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <AuthCallbackPage
      provider={getFirstValue(params.provider)}
      code={getFirstValue(params.code)}
      state={getFirstValue(params.state)}
      error={getFirstValue(params.error)}
      errorDescription={getFirstValue(params.error_description)}
      next={getFirstValue(params.next)}
    />
  );
}
