import { expose } from "kkrpc"
import { workerSelfTransport } from "kkrpc/worker"
import init, { curve_data, type PlotData } from "./wasm"

async function readText(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }
  return response.text()
}

const api = {
  async computeData(
    hold: number = 1,
    url: string = "/invest/data_index.csv"
  ): Promise<PlotData> {
    await init("/invest/wasm_bg.wasm")
    const csvText = await readText(url)
    return curve_data(csvText, 10, 0.001, 0.5, hold, 1).toJSON() as PlotData
  },
}

export type WorkerApi = typeof api

expose(api, workerSelfTransport())
