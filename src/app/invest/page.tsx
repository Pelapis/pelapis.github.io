import type { Metadata } from "next";
import { AppLayout } from "@/features/invest/components/layout/AppLayout";
import InvestClient from "./InvestClient";

export const metadata: Metadata = {
  title: "投资模拟",
};

export default function Page() {
  return (
    <AppLayout>
      <InvestClient />
    </AppLayout>
  );
}
