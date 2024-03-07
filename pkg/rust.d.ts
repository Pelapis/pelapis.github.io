/* tslint:disable */
/* eslint-disable */
/**
* @param {string} path
* @returns {DataGenerator}
*/
export function data_generator(path: string): DataGenerator;
/**
*/
export class DataGenerator {
  free(): void;
/**
* @param {Float64Array} return_vector
* @param {number} num_investors
* @param {number} trading_cost
* @returns {DataGenerator}
*/
  static new(return_vector: Float64Array, num_investors: number, trading_cost: number): DataGenerator;
/**
* @param {number} level
* @param {number} hold
* @param {number} participation
* @returns {Float64Array}
*/
  plot_data(level: number, hold: number, participation: number): Float64Array;
}
/**
*/
export class DataReader {
  free(): void;
/**
* @param {string} path
* @returns {Float64Array}
*/
  static return_vector_from_path(path: string): Float64Array;
/**
* @param {string} content
* @returns {Float64Array}
*/
  static return_vector_from_string(content: string): Float64Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_datareader_free: (a: number) => void;
  readonly datareader_return_vector_from_path: (a: number, b: number, c: number) => void;
  readonly datareader_return_vector_from_string: (a: number, b: number, c: number) => void;
  readonly __wbg_datagenerator_free: (a: number) => void;
  readonly datagenerator_new: (a: number, b: number, c: number, d: number) => number;
  readonly datagenerator_plot_data: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly data_generator: (a: number, b: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
