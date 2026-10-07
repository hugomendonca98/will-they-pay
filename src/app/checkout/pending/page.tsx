import { CheckoutResultPage } from "@/components/checkout-result";

export default function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CheckoutResultPage outcome="pending" searchParams={searchParams} />;
}
