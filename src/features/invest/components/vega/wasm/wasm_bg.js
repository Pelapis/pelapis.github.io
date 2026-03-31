export class PlotData {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PlotData.prototype);
        obj.__wbg_ptr = ptr;
        PlotDataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PlotDataFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_plotdata_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get mean() {
        const ret = wasm.__wbg_get_plotdata_mean(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get percentile10() {
        const ret = wasm.__wbg_get_plotdata_percentile10(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get percentile5() {
        const ret = wasm.__wbg_get_plotdata_percentile5(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get percentile90() {
        const ret = wasm.__wbg_get_plotdata_percentile90(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get percentile95() {
        const ret = wasm.__wbg_get_plotdata_percentile95(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get sd() {
        const ret = wasm.__wbg_get_plotdata_sd(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} mean
     * @param {number} sd
     * @param {number} percentile90
     * @param {number} percentile10
     * @param {number} percentile95
     * @param {number} percentile5
     */
    constructor(mean, sd, percentile90, percentile10, percentile95, percentile5) {
        const ret = wasm.plotdata_new(mean, sd, percentile90, percentile10, percentile95, percentile5);
        this.__wbg_ptr = ret >>> 0;
        PlotDataFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} arg0
     */
    set mean(arg0) {
        wasm.__wbg_set_plotdata_mean(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set percentile10(arg0) {
        wasm.__wbg_set_plotdata_percentile10(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set percentile5(arg0) {
        wasm.__wbg_set_plotdata_percentile5(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set percentile90(arg0) {
        wasm.__wbg_set_plotdata_percentile90(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set percentile95(arg0) {
        wasm.__wbg_set_plotdata_percentile95(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set sd(arg0) {
        wasm.__wbg_set_plotdata_sd(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) PlotData.prototype[Symbol.dispose] = PlotData.prototype.free;

/**
 * @param {string} text
 * @param {number} n
 * @param {number} investors_no
 * @param {number} trading_cost
 * @param {number} level
 * @param {number} hold
 * @param {number} participation
 * @returns {PlotData[]}
 */
export function curve_data(text, n, investors_no, trading_cost, level, hold, participation) {
    const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.curve_data(ptr0, len0, n, investors_no, trading_cost, level, hold, participation);
    var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}
export function __wbg___wbindgen_throw_6ddd609b62940d55(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
}
export function __wbg_plotdata_new(arg0) {
    const ret = PlotData.__wrap(arg0);
    return ret;
}
export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
}
const PlotDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_plotdata_free(ptr >>> 0, 1));

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;


let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}
