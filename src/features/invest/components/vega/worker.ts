import * as comlink from 'comlink'
import * as wasm from './wasm'

async function hello() {
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log('hello worker')
}

async function read_text(url: string) {
    const response = await fetch(new URL(url, import.meta.url))
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    const text = await response.text()
    return text
}

async function compute_data(n: number, url: string = '../../assets/data/data_index.csv', hold: number = 1) {
    const text = await read_text(url)
    console.log(text)
    const a = new wasm.PlotData(1, 1, 1, 1, 1, 1)
    console.log(a)
    return a
    // try {
    //     const data = await curve_data(text, n, 3, 0.001, 0.5, hold, 1)
    //     console.log(data)
    //     return data
    // } catch (error) {
    //     console.error('Error computing data:', error)
    //     throw error
    // }
}


const workerApi = {
    hello,
    compute_data,
}

comlink.expose(workerApi)
export type WorkerApi = typeof workerApi
