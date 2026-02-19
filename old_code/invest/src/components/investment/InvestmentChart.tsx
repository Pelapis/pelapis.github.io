import { useEffect, useState } from 'react'
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useInvestmentStore } from '../../store/investmentStore'
import { fetchAndComputeData } from '../../utils/dataProcessor'
import type { DataItem } from '../../utils/dataProcessor'

export function InvestmentChart() {
  const { selectedStock } = useInvestmentStore()
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const result = await fetchAndComputeData(selectedStock)
        setData(result)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedStock])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">正在计算数据...</div>
      </div>
    )
  }

  const chartData = data.map((item, index) => ({
    name: item.date,
    value: item.value,
    low: item.low,
    up: item.up,
    index,
  }))

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="up"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.2}
            name="90%分位数"
          />
          <Area
            type="monotone"
            dataKey="low"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.2}
            name="10%分位数"
          />
          <Line type="monotone" dataKey="value" stroke="#000000" strokeWidth={3} name="平均收益" />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-center text-gray-500 text-sm mt-2">中水平组😐（正确率0.5）</p>
    </div>
  )
}
