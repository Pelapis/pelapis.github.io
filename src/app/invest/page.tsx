import type { Metadata } from "next"
import InvestClient from "./InvestClient"
import { NavBar } from "./NavBar"
import { Footer } from "./Footer"

export const metadata: Metadata = {
  title: "投资模拟",
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1">
        <InvestClient />
      </main>
      <Footer />
    </div>
  )
}
