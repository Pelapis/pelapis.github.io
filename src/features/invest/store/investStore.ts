import { atom } from 'jotai'

export type StockType = 'index' | 'maotai' | 'mengjie'
export const stockAtom = atom<StockType>('index')
