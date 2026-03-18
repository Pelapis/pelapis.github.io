import { StockSelector } from './components/investment/StockSelector'
import { InvestmentChart } from './components/investment/InvestmentChart'

export default function InvestmentPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">投资模拟</h1>
        <p className="text-gray-500 mt-2">沪深300指数，贵州茅台 和 梦洁股份</p>
      </header>
      <StockSelector />
      <main className="mt-6">
        <InvestmentChart />
      </main>
    </div>
  )
}
