import { useInvestmentStore } from '../../store/investmentStore'
import type { StockType } from '../../store/investmentStore'

export function StockSelector() {
  const { selectedStock, setSelectedStock } = useInvestmentStore()

  const stocks: { type: StockType; label: string }[] = [
    { type: 'index', label: '沪深300' },
    { type: 'maotai', label: '贵州茅台' },
    { type: 'mengjie', label: '梦洁股份' },
  ]

  return (
    <nav className="stock-selector">
      {stocks.map((stock) => (
        <button
          key={stock.type}
          onClick={() => setSelectedStock(stock.type)}
          className={`stock-button ${selectedStock === stock.type ? 'active' : ''}`}
        >
          {stock.label}
        </button>
      ))}
    </nav>
  )
}
