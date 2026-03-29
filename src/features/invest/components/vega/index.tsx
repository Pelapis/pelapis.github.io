import type { WorkerApi } from './worker'
import { wrap } from 'comlink'
import MyWorker from './worker?worker'
import { useEffect } from 'react'
import embed from 'vega-embed'

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

export default function Vega() {
    useEffect(() => {
        const worker = new MyWorker();
        const workerApi = wrap<WorkerApi>(worker);
        (async () => {
            const vals = await Promise.all(DAYS.map(
                async ([val, _]) => ({ x: val, y: (await workerApi.compute_data(val)).mean })
            ))
            const rst = await embed('#hello-worker', {
                data: {
                    values: vals,
                },
                "config": { "view": { "continuousWidth": 300, "continuousHeight": 300 } },
                "mark": "line",
                "encoding": {
                    "x": { "field": "x", "type": "nominal" },
                    "y": { "field": "y", "type": "quantitative" }
                },
                "params": [
                    {
                        "name": "xyscale",
                        "select": { "type": "interval", "encodings": ["x", "y"] },
                        "bind": "scales"
                    }
                ],
            })
            console.log(rst, rst.view)
        })();

        return () => {
            worker.terminate()
        };
    }, [])

    return (
        <h1 className="text-2xl font-bold text-gray-800" id="hello-worker">hello worker</h1>
    )
}
