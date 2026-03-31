/* tslint:disable */
/* eslint-disable */

export class PlotData {
    /**
     ** Return copy of self without private attributes.
     */
    toJSON(): Object;
    /**
     * Return stringified version of self.
     */
    toString(): string;
    free(): void;
    [Symbol.dispose](): void;
    constructor(mean: number, sd: number, percentile90: number, percentile10: number, percentile95: number, percentile5: number);
    mean: number;
    percentile10: number;
    percentile5: number;
    percentile90: number;
    percentile95: number;
    sd: number;
}

export function curve_data(csv_text: string, num_investors: number, trading_cost: number, level: number, hold: number, participation: number): PlotData;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_plotdata_free: (a: number, b: number) => void;
    readonly __wbg_get_plotdata_mean: (a: number) => number;
    readonly __wbg_set_plotdata_mean: (a: number, b: number) => void;
    readonly __wbg_get_plotdata_sd: (a: number) => number;
    readonly __wbg_set_plotdata_sd: (a: number, b: number) => void;
    readonly __wbg_get_plotdata_percentile90: (a: number) => number;
    readonly __wbg_set_plotdata_percentile90: (a: number, b: number) => void;
    readonly __wbg_get_plotdata_percentile10: (a: number) => number;
    readonly __wbg_set_plotdata_percentile10: (a: number, b: number) => void;
    readonly __wbg_get_plotdata_percentile95: (a: number) => number;
    readonly __wbg_set_plotdata_percentile95: (a: number, b: number) => void;
    readonly __wbg_get_plotdata_percentile5: (a: number) => number;
    readonly __wbg_set_plotdata_percentile5: (a: number, b: number) => void;
    readonly plotdata_new: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
    readonly curve_data: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
