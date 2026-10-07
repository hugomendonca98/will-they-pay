import { CheckoutResultPage } from "@/components/checkout-result";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CheckoutResultPage outcome="success" searchParams={searchParams} />;
}
