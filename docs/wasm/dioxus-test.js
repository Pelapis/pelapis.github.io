import { RawInterpreter } from './snippets/dioxus-interpreter-js-4f3bdb922bc47527/inline0.js';
import { setAttributeInner } from './snippets/dioxus-interpreter-js-4f3bdb922bc47527/src/js/common.js';
import { get_select_data } from './snippets/dioxus-web-8edcfe18a14f88ed/inline0.js';
import { get_form_data } from './snippets/dioxus-web-8edcfe18a14f88ed/inline1.js';
import { WebDioxusChannel } from './snippets/dioxus-web-8edcfe18a14f88ed/src/js/eval.js';

let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

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
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_4.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_4.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
function __wbg_adapter_48(arg0, arg1, arg2) {
    try {
        wasm._ZN140__LT_dyn_u20_core__ops__function__FnMut_LT__LP__RF_A_C__RP__GT__u2b_Output_u20__u3d__u20_R_u20_as_u20_wasm_bindgen__closure__WasmClosure_GT_8describe6invoke17hb8163ead8a20d6faE(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_51(arg0, arg1) {
    wasm._ZN132__LT_dyn_u20_core__ops__function__FnMut_LT__LP__RP__GT__u2b_Output_u20__u3d__u20_R_u20_as_u20_wasm_bindgen__closure__WasmClosure_GT_8describe6invoke17hb71955ba43f0c9f6E(arg0, arg1);
}

function __wbg_adapter_54(arg0, arg1, arg2) {
    wasm._ZN136__LT_dyn_u20_core__ops__function__FnMut_LT__LP_A_C__RP__GT__u2b_Output_u20__u3d__u20_R_u20_as_u20_wasm_bindgen__closure__WasmClosure_GT_8describe6invoke17h40188d7c7427da91E(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_57(arg0, arg1) {
    wasm._ZN132__LT_dyn_u20_core__ops__function__FnMut_LT__LP__RP__GT__u2b_Output_u20__u3d__u20_R_u20_as_u20_wasm_bindgen__closure__WasmClosure_GT_8describe6invoke17h6e287d213ee07c34E(arg0, arg1);
}

function __wbg_adapter_60(arg0, arg1, arg2) {
    try {
        wasm._ZN140__LT_dyn_u20_core__ops__function__FnMut_LT__LP__RF_A_C__RP__GT__u2b_Output_u20__u3d__u20_R_u20_as_u20_wasm_bindgen__closure__WasmClosure_GT_8describe6invoke17h2de539f159126ddaE(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_63(arg0, arg1, arg2) {
    wasm._ZN136__LT_dyn_u20_core__ops__function__FnMut_LT__LP_A_C__RP__GT__u2b_Output_u20__u3d__u20_R_u20_as_u20_wasm_bindgen__closure__WasmClosure_GT_8describe6invoke17h864c393a4847860bE(arg0, arg1, addHeapObject(arg2));
}

const __wbindgen_enum_ScrollBehavior = ["auto", "instant", "smooth"];

const __wbindgen_enum_ScrollRestoration = ["auto", "manual"];

const JSOwnerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsowner_free(ptr >>> 0, 1));

export class JSOwner {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(JSOwner.prototype);
        obj.__wbg_ptr = ptr;
        JSOwnerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JSOwnerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsowner_free(ptr, 0);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_String_eecc4a11987127d6 = function(arg0, arg1) {
        const ret = String(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_addEventListener_562dd6708dd0467d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
    }, arguments) };
    imports.wbg.__wbg_addEventListener_e27053e488770e58 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    }, arguments) };
    imports.wbg.__wbg_alert_8a9f269e84b735e7 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).alert(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_altKey_56dd0987e7ccbbf2 = function(arg0) {
        const ret = getObject(arg0).altKey;
        return ret;
    };
    imports.wbg.__wbg_altKey_583c79ba3f4fce1e = function(arg0) {
        const ret = getObject(arg0).altKey;
        return ret;
    };
    imports.wbg.__wbg_altKey_9766087990a64e07 = function(arg0) {
        const ret = getObject(arg0).altKey;
        return ret;
    };
    imports.wbg.__wbg_animationName_ef8ca8f6ac5df7ad = function(arg0, arg1) {
        const ret = getObject(arg1).animationName;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_appendChild_805222aed73feea9 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).appendChild(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_append_d0b9455f2c1d649f = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).append(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_arc_fc059f20614ca305 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).arc(arg1, arg2, arg3, arg4, arg5);
    }, arguments) };
    imports.wbg.__wbg_back_d95961cb10df5888 = function() { return handleError(function (arg0) {
        getObject(arg0).back();
    }, arguments) };
    imports.wbg.__wbg_beginPath_e35881563afbe266 = function(arg0) {
        getObject(arg0).beginPath();
    };
    imports.wbg.__wbg_blockSize_e0006fb003814895 = function(arg0) {
        const ret = getObject(arg0).blockSize;
        return ret;
    };
    imports.wbg.__wbg_blur_5de3b295415a90b1 = function() { return handleError(function (arg0) {
        getObject(arg0).blur();
    }, arguments) };
    imports.wbg.__wbg_body_83d4bc4961a422aa = function(arg0) {
        const ret = getObject(arg0).body;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_borderBoxSize_4d340acfede8dade = function(arg0) {
        const ret = getObject(arg0).borderBoxSize;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_boundingClientRect_ca3deba82ff4024f = function(arg0) {
        const ret = getObject(arg0).boundingClientRect;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_bubbles_a66b5e3a25f9e38b = function(arg0) {
        const ret = getObject(arg0).bubbles;
        return ret;
    };
    imports.wbg.__wbg_buffer_6e1d53ff183194fc = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_button_db48f93638c59f95 = function(arg0) {
        const ret = getObject(arg0).button;
        return ret;
    };
    imports.wbg.__wbg_buttons_b962d6dc116cd1a5 = function(arg0) {
        const ret = getObject(arg0).buttons;
        return ret;
    };
    imports.wbg.__wbg_call_0411c0c3c424db9a = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_3114932863209ca6 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_changedTouches_1120694ede4321bc = function(arg0) {
        const ret = getObject(arg0).changedTouches;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_charCodeAt_99d2c127d011fdd5 = function(arg0, arg1) {
        const ret = getObject(arg0).charCodeAt(arg1 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_checked_42e1d6b6ad689b68 = function(arg0) {
        const ret = getObject(arg0).checked;
        return ret;
    };
    imports.wbg.__wbg_clearRect_ad26e3565a816cff = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).clearRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_clearTimeout_5a54f8841c30079a = function(arg0) {
        const ret = clearTimeout(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_clientX_505ff93b1712c529 = function(arg0) {
        const ret = getObject(arg0).clientX;
        return ret;
    };
    imports.wbg.__wbg_clientX_f02129d888351eb1 = function(arg0) {
        const ret = getObject(arg0).clientX;
        return ret;
    };
    imports.wbg.__wbg_clientY_3169d28f891e219e = function(arg0) {
        const ret = getObject(arg0).clientY;
        return ret;
    };
    imports.wbg.__wbg_clientY_373d758473493bb9 = function(arg0) {
        const ret = getObject(arg0).clientY;
        return ret;
    };
    imports.wbg.__wbg_closePath_acb735d4ced6e960 = function(arg0) {
        getObject(arg0).closePath();
    };
    imports.wbg.__wbg_code_d8226b2133366406 = function(arg0, arg1) {
        const ret = getObject(arg1).code;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_contentBoxSize_1ffe0adfed1a4ba0 = function(arg0) {
        const ret = getObject(arg0).contentBoxSize;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createComment_5113f05efa948483 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).createComment(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createElementNS_6c52d1028bca2999 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = getObject(arg0).createElementNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_createElement_22b48bfb31a0c20e = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_createTextNode_34f9987492bef549 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).createTextNode(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_crypto_ed58b8e10a292839 = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_ctrlKey_1556c0f6ef740b59 = function(arg0) {
        const ret = getObject(arg0).ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_60b29e015a543678 = function(arg0) {
        const ret = getObject(arg0).ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_ab341328ab202d37 = function(arg0) {
        const ret = getObject(arg0).ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_dataTransfer_e55d95fe65ed3f67 = function(arg0) {
        const ret = getObject(arg0).dataTransfer;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_data_955678973a75e5ba = function(arg0, arg1) {
        const ret = getObject(arg1).data;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_deltaMode_a4cc321212f87817 = function(arg0) {
        const ret = getObject(arg0).deltaMode;
        return ret;
    };
    imports.wbg.__wbg_deltaX_27e2939a1af8c940 = function(arg0) {
        const ret = getObject(arg0).deltaX;
        return ret;
    };
    imports.wbg.__wbg_deltaY_4bb52a4f0a7ad28b = function(arg0) {
        const ret = getObject(arg0).deltaY;
        return ret;
    };
    imports.wbg.__wbg_deltaZ_1bf455fd91f9f229 = function(arg0) {
        const ret = getObject(arg0).deltaZ;
        return ret;
    };
    imports.wbg.__wbg_detail_3b3ff84170a33ad2 = function(arg0) {
        const ret = getObject(arg0).detail;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_document_c488ca7509cc6938 = function(arg0) {
        const ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_done_adfd3f40364def50 = function(arg0) {
        const ret = getObject(arg0).done;
        return ret;
    };
    imports.wbg.__wbg_elapsedTime_7f52c57626426c68 = function(arg0) {
        const ret = getObject(arg0).elapsedTime;
        return ret;
    };
    imports.wbg.__wbg_elapsedTime_938e121f611cf304 = function(arg0) {
        const ret = getObject(arg0).elapsedTime;
        return ret;
    };
    imports.wbg.__wbg_entries_17b139d52288958f = function(arg0) {
        const ret = getObject(arg0).entries();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_entries_ce82e236f8300a53 = function(arg0) {
        const ret = Object.entries(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_error_2a6b93fdada7ff11 = function(arg0) {
        console.error(getObject(arg0));
    };
    imports.wbg.__wbg_error_818ac809371bfd77 = function(arg0, arg1, arg2, arg3) {
        console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));
    };
    imports.wbg.__wbg_error_f0dde81ae1e4cfea = function(arg0, arg1) {
        console.error(getObject(arg0), getObject(arg1));
    };
    imports.wbg.__wbg_fetch_2367a4a7762e7c4a = function(arg0, arg1) {
        const ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_fetch_ffad8c569a5e9c85 = function(arg0, arg1) {
        const ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_files_7925b63b783cb707 = function(arg0) {
        const ret = getObject(arg0).files;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_files_de8d8bd3adbff103 = function(arg0) {
        const ret = getObject(arg0).files;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_fillRect_8eafda871dc35099 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_fillText_e63c535690bf726a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillText(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_fill_dacef823dd06c8ed = function(arg0) {
        getObject(arg0).fill();
    };
    imports.wbg.__wbg_focus_c71947fc3fe22147 = function() { return handleError(function (arg0) {
        getObject(arg0).focus();
    }, arguments) };
    imports.wbg.__wbg_force_fd468d8bd1105322 = function(arg0) {
        const ret = getObject(arg0).force;
        return ret;
    };
    imports.wbg.__wbg_forward_a443fd141cef6070 = function() { return handleError(function (arg0) {
        getObject(arg0).forward();
    }, arguments) };
    imports.wbg.__wbg_getAttribute_c466e9ec51b7f80c = function(arg0, arg1, arg2, arg3) {
        const ret = getObject(arg1).getAttribute(getStringFromWasm0(arg2, arg3));
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getBoundingClientRect_d5aa7383cf5c9a73 = function(arg0) {
        const ret = getObject(arg0).getBoundingClientRect();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getContext_24d4414b979c1bbd = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_getElementById_7b2db24a9b54f077 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_getNode_1574bf0ca191ff6a = function(arg0, arg1) {
        const ret = getObject(arg0).getNode(arg1 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getRandomValues_bcb4912f16000dc4 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_get_68aa371864aa301a = function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_92a4780a3beb5fe9 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_get_d517571ff6ca648d = function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_getformdata_9c4731f3305f8e56 = function(arg0) {
        const ret = get_form_data(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getselectdata_4269073478da36cc = function(arg0, arg1) {
        const ret = get_select_data(getObject(arg1));
        const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_globalThis_1e2ac1d6eee845b3 = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_f25a574ae080367c = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_hash_7f9b669d9748278e = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg1).hash;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_height_2214bdee4f4047e3 = function(arg0) {
        const ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_height_4065e49e5ec4c4c1 = function(arg0) {
        const ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_height_55558fb5f05eb8ee = function(arg0) {
        const ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_height_e509816ec3fdf5b1 = function(arg0) {
        const ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_history_9f83c57680b319ca = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).history;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_identifier_190ff6fc4b8c412f = function(arg0) {
        const ret = getObject(arg0).identifier;
        return ret;
    };
    imports.wbg.__wbg_initialize_c0fcd33ef8886bff = function(arg0, arg1, arg2) {
        getObject(arg0).initialize(takeObject(arg1), getObject(arg2));
    };
    imports.wbg.__wbg_inlineSize_6f8d0983462c2919 = function(arg0) {
        const ret = getObject(arg0).inlineSize;
        return ret;
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_435fcead703e2827 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_765036dd08301de6 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof CanvasRenderingContext2D;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_DragEvent_f0858904651bc445 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof DragEvent;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Element_8d48056f7dc3afd9 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Element;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Error_5c7749b0124e9db4 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Error;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_9db0dfd54b2c5330 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLCanvasElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlElement_cf88a4b73702ca50 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlFormElement_71420e16c064d1e1 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLFormElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlInputElement_d01f8554d1afb4b9 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLInputElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlSelectElement_2800d503b3a0558e = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLSelectElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlTextAreaElement_7f0f254335ef1e49 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLTextAreaElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_KeyboardEvent_c86351a5e6432c21 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof KeyboardEvent;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Node_113dd493b0949712 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Node;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Response_0ec26bd2f8a75ca2 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Response;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_9b67296cab48238f = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_a959820eb267fe22 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_WorkerGlobalScope_b700fa20b56ab668 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof WorkerGlobalScope;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_intersectionRatio_a34d5d72e0303d60 = function(arg0) {
        const ret = getObject(arg0).intersectionRatio;
        return ret;
    };
    imports.wbg.__wbg_intersectionRect_da84cb6425b474ef = function(arg0) {
        const ret = getObject(arg0).intersectionRect;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_isArray_fcd559a3bcfde1e9 = function(arg0) {
        const ret = Array.isArray(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_isComposing_8bc0758f907b31f6 = function(arg0) {
        const ret = getObject(arg0).isComposing;
        return ret;
    };
    imports.wbg.__wbg_isIntersecting_9059d5bcaf29f415 = function(arg0) {
        const ret = getObject(arg0).isIntersecting;
        return ret;
    };
    imports.wbg.__wbg_isPrimary_9aec1eb2dbbc26d0 = function(arg0) {
        const ret = getObject(arg0).isPrimary;
        return ret;
    };
    imports.wbg.__wbg_isSafeInteger_4de146aa53f6e470 = function(arg0) {
        const ret = Number.isSafeInteger(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_item_dc82d4b06c16e6fa = function(arg0, arg1) {
        const ret = getObject(arg0).item(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_iterator_7a20c20ce22add0f = function() {
        const ret = Symbol.iterator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_key_02315cd3f595756b = function(arg0, arg1) {
        const ret = getObject(arg1).key;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_left_20475bbabd8b02a8 = function(arg0) {
        const ret = getObject(arg0).left;
        return ret;
    };
    imports.wbg.__wbg_length_1bf135cd2bac85bb = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_length_2e63ba34c4121df5 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_length_2f85adaf7e2cf83e = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_length_a01c8a0710cec6f4 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_length_e74df4881604f1d9 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_lineTo_4941568660ab379e = function(arg0, arg1, arg2) {
        getObject(arg0).lineTo(arg1, arg2);
    };
    imports.wbg.__wbg_location_54d35e8c85dcfb9c = function(arg0) {
        const ret = getObject(arg0).location;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_location_e9eba129bf0612a5 = function(arg0) {
        const ret = getObject(arg0).location;
        return ret;
    };
    imports.wbg.__wbg_message_142844ca2fe283e3 = function(arg0) {
        const ret = getObject(arg0).message;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_metaKey_34d5658170ffb3ee = function(arg0) {
        const ret = getObject(arg0).metaKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_6c8e9228e8dda152 = function(arg0) {
        const ret = getObject(arg0).metaKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_bf5ff677b99a2faf = function(arg0) {
        const ret = getObject(arg0).metaKey;
        return ret;
    };
    imports.wbg.__wbg_moveTo_8a1bf95c2dba01ea = function(arg0, arg1, arg2) {
        getObject(arg0).moveTo(arg1, arg2);
    };
    imports.wbg.__wbg_msCrypto_0a36e2ec3a343d26 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_name_1abd3f68be202781 = function(arg0, arg1) {
        const ret = getObject(arg1).name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_name_f717b4436a36a3ed = function(arg0) {
        const ret = getObject(arg0).name;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_076cac58bb698dd4 = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_0c28e72025e00594 = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_23362fa370a0a372 = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_2c0f3fd054794bda = function(arg0) {
        const ret = new WebDioxusChannel(JSOwner.__wrap(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_3f616ed16821b4c5 = function() {
        const ret = new Map();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_6684d1d61b5a2140 = function() { return handleError(function (arg0, arg1) {
        const ret = new URL(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_6bc3b9375b292047 = function() { return handleError(function () {
        const ret = new FileReader();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_bf0169946596a69c = function() { return handleError(function () {
        const ret = new URLSearchParams();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_e2ec18a02bb844cb = function() { return handleError(function () {
        const ret = new Headers();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_e38ceb072cc53907 = function(arg0) {
        const ret = new RawInterpreter(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newnoargs_19a249f4eceaaac3 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithargs_382c9e3099a22ec2 = function(arg0, arg1, arg2, arg3) {
        const ret = new Function(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_ee8def7000b7b2be = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithlength_91de49dea5643c87 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithstr_74898c29c3883dd2 = function() { return handleError(function (arg0, arg1) {
        const ret = new Request(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newwithstrandinit_ee1418802d8d481c = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_next_c591766a7286b02a = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).next();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_next_f387ecc56a94ba00 = function(arg0) {
        const ret = getObject(arg0).next;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_02999533c4ea02e3 = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_offsetHeight_1f290bd2c2530ec0 = function(arg0) {
        const ret = getObject(arg0).offsetHeight;
        return ret;
    };
    imports.wbg.__wbg_offsetWidth_93ce742061a4c2cb = function(arg0) {
        const ret = getObject(arg0).offsetWidth;
        return ret;
    };
    imports.wbg.__wbg_offsetX_0c73f313461b3e9b = function(arg0) {
        const ret = getObject(arg0).offsetX;
        return ret;
    };
    imports.wbg.__wbg_offsetY_b01533b7f32e2fe6 = function(arg0) {
        const ret = getObject(arg0).offsetY;
        return ret;
    };
    imports.wbg.__wbg_ownerDocument_2fb009a352af7d42 = function(arg0) {
        const ret = getObject(arg0).ownerDocument;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_pageX_a5eb80d57df9dedf = function(arg0) {
        const ret = getObject(arg0).pageX;
        return ret;
    };
    imports.wbg.__wbg_pageX_acec3e4ba8a13733 = function(arg0) {
        const ret = getObject(arg0).pageX;
        return ret;
    };
    imports.wbg.__wbg_pageY_0fce5f4e4fdd1f4c = function(arg0) {
        const ret = getObject(arg0).pageY;
        return ret;
    };
    imports.wbg.__wbg_pageY_8b64a67cd4e040bc = function(arg0) {
        const ret = getObject(arg0).pageY;
        return ret;
    };
    imports.wbg.__wbg_parentElement_decd639177ef1edc = function(arg0) {
        const ret = getObject(arg0).parentElement;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_pathname_3e09a06a0211aa66 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg1).pathname;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_pointerId_a2cbd2cdd6da90b2 = function(arg0) {
        const ret = getObject(arg0).pointerId;
        return ret;
    };
    imports.wbg.__wbg_pointerType_1b74686427cdec29 = function(arg0, arg1) {
        const ret = getObject(arg1).pointerType;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_pressure_8707a47b6fb1c1fd = function(arg0) {
        const ret = getObject(arg0).pressure;
        return ret;
    };
    imports.wbg.__wbg_preventDefault_faafffcaad92972d = function(arg0) {
        getObject(arg0).preventDefault();
    };
    imports.wbg.__wbg_process_5c1d670bc53614b8 = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_propertyName_5e4a9005435d01cf = function(arg0, arg1) {
        const ret = getObject(arg1).propertyName;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_pseudoElement_15f747b477fefd41 = function(arg0, arg1) {
        const ret = getObject(arg1).pseudoElement;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_pseudoElement_9129a15057ccc011 = function(arg0, arg1) {
        const ret = getObject(arg1).pseudoElement;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_pushState_ad84cec6498cc93c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).pushState(getObject(arg1), getStringFromWasm0(arg2, arg3), arg4 === 0 ? undefined : getStringFromWasm0(arg4, arg5));
    }, arguments) };
    imports.wbg.__wbg_push_3e9ce81246ef1d1b = function(arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_3d422e1ba49c2500 = function(arg0) {
        const ret = getObject(arg0).queueMicrotask;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_queueMicrotask_f301663ccadbb7d0 = function(arg0) {
        queueMicrotask(getObject(arg0));
    };
    imports.wbg.__wbg_radiusX_5becf98207e26202 = function(arg0) {
        const ret = getObject(arg0).radiusX;
        return ret;
    };
    imports.wbg.__wbg_radiusY_6e249be7539ada89 = function(arg0) {
        const ret = getObject(arg0).radiusY;
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_readAsArrayBuffer_1e016d077d0fd874 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).readAsArrayBuffer(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_readAsText_98b692db0b25347b = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).readAsText(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_remove_7dd176d7be8b9e3a = function(arg0) {
        getObject(arg0).remove();
    };
    imports.wbg.__wbg_repeat_56fa20e30d00be95 = function(arg0) {
        const ret = getObject(arg0).repeat;
        return ret;
    };
    imports.wbg.__wbg_replaceState_4894c5ce758e6a2e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).replaceState(getObject(arg1), getStringFromWasm0(arg2, arg3), arg4 === 0 ? undefined : getStringFromWasm0(arg4, arg5));
    }, arguments) };
    imports.wbg.__wbg_requestAnimationFrame_e8ca543d07df528e = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_require_79b1e9274cde3c87 = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_resolve_6a311e8bb26423ab = function(arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_restore_be09028064bc5a8b = function(arg0) {
        getObject(arg0).restore();
    };
    imports.wbg.__wbg_result_e434d4d3da5e9ef0 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).result;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_rootBounds_bf31502fe54e6364 = function(arg0) {
        const ret = getObject(arg0).rootBounds;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_rotate_10787f6f0f3d0131 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).rotate(arg1);
    }, arguments) };
    imports.wbg.__wbg_rotationAngle_a9bbf264bdeedd52 = function(arg0) {
        const ret = getObject(arg0).rotationAngle;
        return ret;
    };
    imports.wbg.__wbg_run_b272673a508980d4 = function(arg0) {
        getObject(arg0).run();
    };
    imports.wbg.__wbg_rustRecv_74d2fa43ec31fe5f = function(arg0) {
        const ret = getObject(arg0).rustRecv();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_rustSend_21592099b7772416 = function(arg0, arg1) {
        getObject(arg0).rustSend(takeObject(arg1));
    };
    imports.wbg.__wbg_saveTemplate_9ffcdeb2016e2364 = function(arg0, arg1, arg2, arg3) {
        var v0 = getArrayJsValueFromWasm0(arg1, arg2).slice();
        wasm.__wbindgen_free(arg1, arg2 * 4, 4);
        getObject(arg0).saveTemplate(v0, arg3);
    };
    imports.wbg.__wbg_save_2eafb4e2a565ebb8 = function(arg0) {
        getObject(arg0).save();
    };
    imports.wbg.__wbg_screenX_6a3c0f6a68abeb24 = function(arg0) {
        const ret = getObject(arg0).screenX;
        return ret;
    };
    imports.wbg.__wbg_screenX_bc0f91464aeee19d = function(arg0) {
        const ret = getObject(arg0).screenX;
        return ret;
    };
    imports.wbg.__wbg_screenY_29f2d9641751f0ab = function(arg0) {
        const ret = getObject(arg0).screenY;
        return ret;
    };
    imports.wbg.__wbg_screenY_6f9e77bd2b654c38 = function(arg0) {
        const ret = getObject(arg0).screenY;
        return ret;
    };
    imports.wbg.__wbg_scrollHeight_483dfeb44800a2ff = function(arg0) {
        const ret = getObject(arg0).scrollHeight;
        return ret;
    };
    imports.wbg.__wbg_scrollIntoView_c847fe6be33cc130 = function(arg0, arg1) {
        getObject(arg0).scrollIntoView(getObject(arg1));
    };
    imports.wbg.__wbg_scrollLeft_c408688966909283 = function(arg0) {
        const ret = getObject(arg0).scrollLeft;
        return ret;
    };
    imports.wbg.__wbg_scrollTo_64fb91708e07995b = function(arg0, arg1, arg2) {
        getObject(arg0).scrollTo(arg1, arg2);
    };
    imports.wbg.__wbg_scrollTop_75abd2f678a0a51e = function(arg0) {
        const ret = getObject(arg0).scrollTop;
        return ret;
    };
    imports.wbg.__wbg_scrollWidth_72251ddd2a423ddb = function(arg0) {
        const ret = getObject(arg0).scrollWidth;
        return ret;
    };
    imports.wbg.__wbg_scrollX_ff5e7807d4b4f5ad = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).scrollX;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scrollY_f8948645c01a393b = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).scrollY;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_search_4c8c4c416a168e55 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg1).search;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_search_90c2bd32621b49ea = function(arg0, arg1) {
        const ret = getObject(arg1).search;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_self_ac4343e4047b83cc = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setAttributeInner_fba2267444c6728f = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        setAttributeInner(takeObject(arg0), getStringFromWasm0(arg1, arg2), takeObject(arg3), arg4 === 0 ? undefined : getStringFromWasm0(arg4, arg5));
    };
    imports.wbg.__wbg_setAttribute_e5d83ecaf7f586d5 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setTimeout_db2dbaeefb6f39c7 = function() { return handleError(function (arg0, arg1) {
        const ret = setTimeout(getObject(arg0), arg1);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_set_1d975b42d95fd6c6 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_3807d5f0bfc24aa7 = function(arg0, arg1, arg2) {
        getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    };
    imports.wbg.__wbg_set_7b70226104a82921 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_set_a1fb6291729caffb = function(arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    };
    imports.wbg.__wbg_setbehavior_8422d7aea9fc4f9f = function(arg0, arg1) {
        getObject(arg0).behavior = __wbindgen_enum_ScrollBehavior[arg1];
    };
    imports.wbg.__wbg_setcapture_621e2ad0e4540716 = function(arg0, arg1) {
        getObject(arg0).capture = arg1 !== 0;
    };
    imports.wbg.__wbg_setfillStyle_bf63ae19c78f7602 = function(arg0, arg1, arg2) {
        getObject(arg0).fillStyle = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setfillStyle_c6f1f4d10d24bbc7 = function(arg0, arg1) {
        getObject(arg0).fillStyle = getObject(arg1);
    };
    imports.wbg.__wbg_setfont_63ebf02970994b00 = function(arg0, arg1, arg2) {
        getObject(arg0).font = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setheaders_1f2d4c08004f4227 = function(arg0, arg1) {
        getObject(arg0).headers = getObject(arg1);
    };
    imports.wbg.__wbg_sethref_908664f70823679b = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).href = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_setlineWidth_4a45829895d609d2 = function(arg0, arg1) {
        getObject(arg0).lineWidth = arg1;
    };
    imports.wbg.__wbg_setmethod_c704d56d480d8580 = function(arg0, arg1, arg2) {
        getObject(arg0).method = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setonce_fc9746c79ec638d1 = function(arg0, arg1) {
        getObject(arg0).once = arg1 !== 0;
    };
    imports.wbg.__wbg_setonload_e7719f23a09f4139 = function(arg0, arg1) {
        getObject(arg0).onload = getObject(arg1);
    };
    imports.wbg.__wbg_setpassive_0277065845eeb1e2 = function(arg0, arg1) {
        getObject(arg0).passive = arg1 !== 0;
    };
    imports.wbg.__wbg_setscrollRestoration_07358d942f7b790f = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).scrollRestoration = __wbindgen_enum_ScrollRestoration[arg1];
    }, arguments) };
    imports.wbg.__wbg_setsearch_c5fa155e66773753 = function(arg0, arg1, arg2) {
        getObject(arg0).search = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setstrokeStyle_87671aebb4f60d76 = function(arg0, arg1, arg2) {
        getObject(arg0).strokeStyle = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setstrokeStyle_a547446bc131f158 = function(arg0, arg1) {
        getObject(arg0).strokeStyle = getObject(arg1);
    };
    imports.wbg.__wbg_settextAlign_74c2e03c3665b044 = function(arg0, arg1, arg2) {
        getObject(arg0).textAlign = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settextBaseline_d5dffff0d818e27e = function(arg0, arg1, arg2) {
        getObject(arg0).textBaseline = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settextContent_c0dbcabb54599a32 = function(arg0, arg1, arg2) {
        getObject(arg0).textContent = arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_shiftKey_429fbf77e289eca6 = function(arg0) {
        const ret = getObject(arg0).shiftKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_570898b1142a9898 = function(arg0) {
        const ret = getObject(arg0).shiftKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_e90da27a3092777e = function(arg0) {
        const ret = getObject(arg0).shiftKey;
        return ret;
    };
    imports.wbg.__wbg_size_965da315036ee58c = function(arg0) {
        const ret = getObject(arg0).size;
        return ret;
    };
    imports.wbg.__wbg_state_9f800118bdc806f8 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).state;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_stringify_f5476f15b5654a07 = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_stroke_75d2e7e3f556b551 = function(arg0) {
        getObject(arg0).stroke();
    };
    imports.wbg.__wbg_subarray_b4e9772c34a7f5ba = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_tangentialPressure_b42650b55d0550ef = function(arg0) {
        const ret = getObject(arg0).tangentialPressure;
        return ret;
    };
    imports.wbg.__wbg_targetTouches_51e3aaca45afc3b5 = function(arg0) {
        const ret = getObject(arg0).targetTouches;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_target_57ef456bb808886b = function(arg0) {
        const ret = getObject(arg0).target;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_textContent_a4f9c95debb20de0 = function(arg0, arg1) {
        const ret = getObject(arg1).textContent;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_text_693c6c8a197588c7 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).text();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_then_5c6469c1e1da9e59 = function(arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_faeb8aed8c1629b7 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_tiltX_91cc617704523b1b = function(arg0) {
        const ret = getObject(arg0).tiltX;
        return ret;
    };
    imports.wbg.__wbg_tiltY_fb0f21706fa52908 = function(arg0) {
        const ret = getObject(arg0).tiltY;
        return ret;
    };
    imports.wbg.__wbg_time_2137663a7f162635 = function(arg0) {
        const ret = getObject(arg0).time;
        return ret;
    };
    imports.wbg.__wbg_toString_4ee42c50d3399a53 = function(arg0) {
        const ret = getObject(arg0).toString();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_toString_de21a47cfd5e84a2 = function(arg0) {
        const ret = getObject(arg0).toString();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_top_6105791de23fffbe = function(arg0) {
        const ret = getObject(arg0).top;
        return ret;
    };
    imports.wbg.__wbg_touches_aeefd32ebb91cffb = function(arg0) {
        const ret = getObject(arg0).touches;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_translate_23a5edb692833c2d = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).translate(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_twist_6d915197019ff20a = function(arg0) {
        const ret = getObject(arg0).twist;
        return ret;
    };
    imports.wbg.__wbg_type_49168fb8f8047e19 = function(arg0, arg1) {
        const ret = getObject(arg1).type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_type_707ee9861e060f61 = function(arg0, arg1) {
        const ret = getObject(arg1).type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_updatememory_6fb7a458522ef9dc = function(arg0, arg1) {
        getObject(arg0).update_memory(takeObject(arg1));
    };
    imports.wbg.__wbg_url_0797ed892dbbceed = function(arg0, arg1) {
        const ret = getObject(arg1).url;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_value_30db1d77772f3236 = function(arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_value_79f0e6ba240c90bc = function(arg0, arg1) {
        const ret = getObject(arg1).value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_value_9193a033c6866905 = function(arg0, arg1) {
        const ret = getObject(arg1).value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_value_e88c0b5368388056 = function(arg0, arg1) {
        const ret = getObject(arg1).value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_versions_c71aa1626a93e0a1 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_weak_de6cbe15d6ed861d = function(arg0) {
        const ret = getObject(arg0).weak();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_width_6472fed1f5b0a964 = function(arg0) {
        const ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_width_826b25a505a0b357 = function(arg0) {
        const ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_width_dfc6149b0c4d8821 = function(arg0) {
        const ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_width_f79c15469871247c = function(arg0) {
        const ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_window_1a23defd102c72f4 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_x_5fca6e21f61fd672 = function(arg0) {
        const ret = getObject(arg0).x;
        return ret;
    };
    imports.wbg.__wbg_y_c8508390fadef42e = function(arg0) {
        const ret = getObject(arg0).y;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = getObject(arg1);
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1001 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 319, __wbg_adapter_60);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper1499 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 667, __wbg_adapter_63);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper629 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 132, __wbg_adapter_48);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper934 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 295, __wbg_adapter_51);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper997 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 319, __wbg_adapter_54);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper999 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 319, __wbg_adapter_57);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = getObject(arg0) in getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'bigint';
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = getObject(arg0) === getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = getObject(arg0) == getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }


    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
