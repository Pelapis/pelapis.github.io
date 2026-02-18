import { create } from 'zustand'

export type StockType = 'index' | 'maotai' | 'mengjie'

interface InvestmentState {
  selectedStock: StockType
  setSelectedStock: (stock: StockType) => void
}

export const useInvestmentStore = create<InvestmentState>((set) => ({
  selectedStock: 'index',
  setSelectedStock: (stock) => set({ selectedStock: stock }),
}))
