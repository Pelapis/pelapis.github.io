import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
