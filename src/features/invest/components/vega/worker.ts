import { expose } from 'comlink'
import init, { curve_data, PlotData } from './wasm'


async function read_text(url: string) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    const text = await response.text()
    return text
}

async function compute_data(hold: number = 1, url: string = '/invest/data_index.csv') {
    await init('/invest/wasm_bg.wasm')
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
