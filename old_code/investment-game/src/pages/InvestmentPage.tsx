import { StockSelector } from '../components/investment/StockSelector'
import { InvestmentChart } from '../components/investment/InvestmentChart'

export function InvestmentPage() {
  return (
    <div className="investment-page">
      <header className="investment-header">
        <h1>投资模拟</h1>
        <p>沪深300指数，贵州茅台 和 梦洁股份</p>
      </header>
      <StockSelector />
      <main className="investment-main">
        <InvestmentChart />
      </main>
    </div>
  )
}
