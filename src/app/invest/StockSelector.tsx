"use client"

import { useAtom } from "jotai"
import { stockAtom, type StockType } from "./atoms"

const stocks: { type: StockType; label: string }[] = [
  { type: "index", label: "沪深300" },
  { type: "maotai", label: "贵州茅台" },
  { type: "mengjie", label: "梦洁股份" },
]

export function StockSelector() {
  const [stockState, setStockState] = useAtom(stockAtom)

  return (
    <div className="flex justify-center gap-2 py-4">
      {stocks.map((stock) => (
        <button
          key={stock.type}
          onClick={() => setStockState(stock.type)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            stockState === stock.type
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {stock.label}
        </button>
      ))}
    </div>
  )
}
