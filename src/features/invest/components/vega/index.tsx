import type { WorkerApi } from './worker'
import { wrap } from 'comlink'
import MyWorker from './worker?worker'
import { useEffect, useRef } from 'react'
import embed from 'vega-embed'
import { stockAtom } from '../../store/investStore'
import { useAtom } from 'jotai'


const DAYS: [number, string][] = [
    [1, '1天'],
    [3, '3天'],
    [5, '1周'],
    [10, '2周'],
    [21, '1月'],
    [63, '1季'],
    [250, '1年'],
    [1250, '5年'],
    [2500, '10年'],
]
const ddict: Record<number, string> = {}
DAYS.forEach(([val, label]) => {
    ddict[val] = label
})

export default function VegaChart() {
    const chartRef = useRef<HTMLDivElement>(null)
    const [stock] = useAtom(stockAtom)

    useEffect(() => {

        if (!chartRef.current) return

        const worker = new MyWorker();
        const workerApi = wrap<WorkerApi>(worker);

        (async () => {
            const vals = await Promise.all(DAYS.map(
                async ([val, _]) => {
                    const plotdata = await workerApi.compute_data(val, new URL(`../../assets/data/data_${stock}.csv`, import.meta.url).href)

                    return {
                        days: val,
                        mean: plotdata.mean,
                        std: plotdata.sd,
                        p10: plotdata.percentile10,
                        p90: plotdata.percentile90,
                        p5: plotdata.percentile5,
                        p95: plotdata.percentile95,
                    }
                }
            ))

            const rst = await embed(chartRef.current!, {
                data: { values: vals },
                config: { customFormatTypes: true },
                width: 'container',
                height: 360,
                encoding: {
                    x: {
                        field: 'days',
                        type: 'quantitative',
                        scale: { type: 'log' },
                        axis: {
                            values: DAYS.map(([v]) => v),
                            ticks: true,
                            formatType: 'customFormatA',
                        }
                    },
                },
                layer: [
                    {
                        mark: 'line',
                        encoding: {
                            y: { field: 'mean', type: 'quantitative' }
                        },
                    },
                    {
                        mark: 'errorband',
                        encoding: {
                            y: { field: 'p10', type: 'quantitative' },
                            y2: { field: 'p90', type: 'quantitative' }
                        },
                    },
                ],
                params: [
                    // {
                    //     name: 'slidescale',
                    //     select: { type: 'interval', encodings: ['x', 'y'] },
                    //     bind: 'scales'
                    // }
                ],
            }, {
                expressionFunctions: {
                    customFormatA: (datum: number) => ddict[datum]
                }
            })
            rst.view
        })();

        return () => {
            worker.terminate()
        };
    }, [stock])

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
                {/* Vega 图表挂载点 - 使用 Tailwind 控制尺寸 */}
                <div ref={chartRef} className="w-full h-[400px]" />
                <p className="text-center text-gray-500 text-sm mt-2">中水平组😐（正确率0.5）</p>
            </div>
        </div>
    )
}
