export interface DataItem {
  date: string
  value: number
  low: number
  up: number
}

export const DAYS: [number, string][] = [
  [1, '1天'],
  [2, '2天'],
  [3, '3天'],
  [5, '1周'],
  [10, '2周'],
  [21, '1月'],
  [63, '1季'],
  [250, '1年'],
  [1250, '5年'],
  [2500, '10年'],
]

export async function requestCSVData(path: string): Promise<string> {
  const response = await fetch(path)
  return response.text()
}

export function parseCSVData(text: string): number[] {
  return text
    .split('\n')
    .map((line) => line.split(',').at(2))
    .filter((value): value is string => value !== undefined)
    .map((value) => parseFloat(value))
    .filter((value) => !isNaN(value))
}

export function computeData(returnVector: number[]): DataItem[] {
  const investorCount = 100
  const tradingCost = 0.001
  const level = 0.5
  const participation = 0.5

  return DAYS.map(([holdDay, dayName]) => {
    const holdCount = Math.ceil(returnVector.length / holdDay)
    const adjustedReturns: number[] = []

    for (let j = 0; j < holdCount; j++) {
      const start = j * holdDay
      const end = Math.min((j + 1) * holdDay, returnVector.length)
      const segment = returnVector.slice(start, end)
      const product = segment.reduce((acc, val) => acc * val, 1)
      adjustedReturns.push(product)
    }

    const investorReturns: number[] = []

    for (let i = 0; i < investorCount; i++) {
      let finalReturn = 1

      for (const thisReturn of adjustedReturns) {
        const isGrowing = thisReturn > 1
        const willWin = level > Math.random()
        const willParticipate = participation > Math.random()

        if (isGrowing === willWin && willParticipate) {
          finalReturn = finalReturn * thisReturn * (1 - tradingCost)
        }
      }

      investorReturns.push(finalReturn)
    }

    investorReturns.sort((a, b) => a - b)

    const mean = investorReturns.reduce((sum, val) => sum + val, 0) / investorCount
    const percentile10 = investorReturns[Math.floor(investorCount / 10)]
    const percentile90 = investorReturns[Math.floor((investorCount * 9) / 10)]

    return {
      date: dayName,
      value: mean,
      low: percentile10,
      up: percentile90,
    }
  })
}

export async function fetchAndComputeData(stockType: 'index' | 'maotai' | 'mengjie'): Promise<DataItem[]> {
  const paths: Record<string, string> = {
    index: '/data/data_index.csv',
    maotai: '/data/data_maotai.csv',
    mengjie: '/data/data_mengjie.csv',
  }

  const text = await requestCSVData(paths[stockType])
  const returnVector = parseCSVData(text)
  return computeData(returnVector)
}
