"use client"

import { useEffect, useRef } from "react"
import { useAtomValue } from "jotai"
import { wrap } from "kkrpc"
import { workerTransport } from "kkrpc/worker"
import embed from "vega-embed"
import { stockAtom } from "./atoms"
import type { WorkerApi } from "./worker"

const DAY_DICT: Record<number, string> = {
  1: "1天",
  3: "3天",
  5: "1周",
  10: "2周",
  21: "1月",
  63: "1季",
  250: "1年",
  1250: "5年",
  2500: "10年",
}

export function VegaChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const stock = useAtomValue(stockAtom)

  useEffect(() => {
    if (!chartRef.current) return

    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    })
    const api = wrap<WorkerApi>(workerTransport(worker))

    ;(async () => {
      const vals = await Promise.all(
        Object.keys(DAY_DICT).map(async (val) => {
          const plotdata = await api.computeData(
            Number(val),
            `/invest/data_${stock}.csv`
          )

          return {
            days: Number(val),
            daylabel: DAY_DICT[Number(val)],
            mean: plotdata.mean - 1,
            p10: plotdata.percentile10 - 1,
            p90: plotdata.percentile90 - 1,
            p5: plotdata.percentile5 - 1,
            p95: plotdata.percentile95 - 1,
            std: plotdata.sd,
          }
        })
      )

      await embed(
        chartRef.current!,
        {
          data: { values: vals },
          config: { customFormatTypes: true },
          width: "container",
          height: 360,
          encoding: {
            x: {
              field: "days",
              type: "quantitative",
              scale: { type: "log", domain: [1, 2500] },
              axis: {
                values: Object.keys(DAY_DICT).map(Number),
                formatType: "showTimeLabel",
                title: "单次持有时间",
              },
            },
            y: {
              axis: {
                format: ".0%",
                title: "收益率",
              },
            },
            tooltip: [
              { field: "days", title: "单次持有天数" },
              { field: "mean", format: ".1%", title: "平均收益率" },
              { field: "p10", format: ".1%", title: "10%分位数" },
              { field: "p90", format: ".1%", title: "90%分位数" },
            ],
          },
          layer: [
            {
              mark: "line",
              encoding: {
                y: { field: "mean", type: "quantitative" },
              },
            },
            {
              mark: "errorband",
              encoding: {
                y: { field: "p10", type: "quantitative" },
                y2: { field: "p90", type: "quantitative" },
              },
            },
          ],
        },
        {
          expressionFunctions: {
            showTimeLabel: (datum: number) => DAY_DICT[datum],
          },
        }
      )
    })()

    return () => {
      worker.terminate()
    }
  }, [stock])

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-4">
        {/* Vega 图表挂载点 - 使用 Tailwind 控制尺寸 */}
        <div ref={chartRef} className="w-full h-[400px]" />
      </div>
    </div>
  )
}
