import { CheckoutResultPage } from "@/components/checkout-result";

export default function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CheckoutResultPage outcome="failure" searchParams={searchParams} />;
}
