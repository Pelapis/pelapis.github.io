import type { Metadata } from "next";
import AppLayout from "@/components/layout/AppLayout";
import AboutPage from "@/features/home/AboutPage";

export const metadata: Metadata = {
  title: "关于",
};

export default function Page() {
  return (
    <AppLayout>
      <AboutPage />
    </AppLayout>
  );
}
