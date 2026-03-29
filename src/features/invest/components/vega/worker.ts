import { expose } from 'comlink'
import init, { curve_data, PlotData } from './wasm'


async function read_text(url: string) {
    const response = await fetch(new URL(url, import.meta.url))
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    const text = await response.text()
    return text
}

async function compute_data(hold: number = 1, url: string = '../../assets/data/data_index.csv') {
    await init()
    const csv_text = await read_text(url)
    const data = curve_data(csv_text, 10, 0.001, 0.5, hold, 1).toJSON()
    return data as PlotData
}

const workerApi = {
    compute_data,
    PlotData,
}

expose(workerApi)
export type WorkerApi = typeof workerApi
