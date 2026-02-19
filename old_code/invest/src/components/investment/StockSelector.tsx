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
    <div className="flex justify-center gap-2 py-4">
      {stocks.map((stock) => (
        <button
          key={stock.type}
          onClick={() => setSelectedStock(stock.type)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedStock === stock.type
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {stock.label}
        </button>
      ))}
    </div>
  )
}
