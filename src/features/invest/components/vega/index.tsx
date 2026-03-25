import type { WorkerApi } from './worker'
import * as comlink from 'comlink'
import MyWorker from './worker?worker'
import { useEffect } from 'react'


export default function Vega() {
    useEffect(() => {
        const worker = new MyWorker();
        const workerApi = comlink.wrap<WorkerApi>(worker);
        (async () => {
            await workerApi.hello()
            const data = await workerApi.compute_data(1)
        })();

        return () => {
            worker.terminate()
        };
    }, [])

    return (
        <h1 className="text-2xl font-bold text-gray-800">hello worker</h1>
    )
}
