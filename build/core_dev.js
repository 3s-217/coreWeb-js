(function(exports){'use strict';/**
 * Utilities
 * @namespace utils
 * @static
 * @alias __o.utils
 * @type {object}
 * @description Core utilities
 * @license MIT
 * @author 3s217
 * @version 0.13.0
 */
const utils = async (rt) => {
    if (!rt) throw new Error('util requires extens {./core.js}');
    rt.utils = {
        /**
         * Generates a unique identifier.
         * @method ider
         * @memberof utils
         * @return {string} A randomly generated unique identifier.
         */
        ider() {
            var s = () => (Math.floor((1 + Math.random()) * 0x1e4).toString(16).substring(1));
            return s() + s() + '-' + s();
        },
        /**
         * @name math
         * @memberof utils
         * @namespace utils.math 
         * @type {object}
         * @description Math utilities
         */
        math: {
            th: v => ((v ?? 1) * 1e3),
            /**
             * Generates a random number between the given min and max values.
             * @method rNum
             * @memberof utils.math
             * @param {number} min - The minimum value for the random number.
             * @param {number} max - The maximum value for the random number.
             * @param {boolean} f - Optional flag to specify whether to return a float or an integer. Defaults to false.
             * @return {number} The randomly generated number.
             */
            rNum(min, max, f) {
                let v = (Math.random() * (max - min) + min);
                return f ? v : Math.floor(v);
            },
            per: {
                to: (total, avail, cur) => (cur / (total - avail) * 100),
                from: (total, avail, per) => ((per / 100) * (total - avail)),
            },
            /**
             * Rounds a given value to a specified number of decimal places.
             * @method round
             * @memberof utils.math
             * @param {number} v - The value to be rounded.
             * @param {number} s - The number of decimal places to round to.
             * @param {number} [d=1] - The direction of rounding. Defaults to 1 (round up).
             * @return {number} The rounded value.
             */
            round(v, s, d = 1) {
                const f = Math.pow(10, s);
                return (d !== 1 ? Math.floor(v * f) : Math.ceil(v * f)) / f;
            }
        },
        /**
         * @name Time
         * @memberof utils
         * @namespace utils.Time
         * @type {object}
         * @description Utilities for working with time.
         */
        Time: {
            // lite_start
            /**
             * Delay execution of a function.
             * @method delay
             * @memberof utils.Time
             * @param {number} time - The number of milliseconds to delay.
             * @param {number} [max] - The maximum number of milliseconds to delay.
             * @param {boolean} [f] - float =true, integer = false
             * @return {Promise} A promise that resolves after the specified time has elapsed.
             */
            delay(time, max, f) {
                let { th, rNum } = __o.utils.math;
                return new Promise(function (resolve) { setTimeout(resolve, th(max ? rNum(time, max, f) : time)); });
            },
            // lite_end
            /**
             * Format a duration value.
             * @method fmt
             * @memberof utils.Time
             * @param {string|number|Date} dur - The duration value to format. Can be a string, number, or Date object.
             * @param {string} type - The unit type to convert the duration to. Can be one of: 'n', 'mc', 'ms', 's', 'm', 'h', 'd', 'mn', 'y'.
             * @param {string} [pt=''] - The format pattern for the duration. Optional. Defaults to an empty string.
             * @returns {string|number|Object} - The formatted duration value. Can be a string, number, or an object containing the individual components.
             */
            fmt(dur, type, pt = '') {
                let ty = __o.utils.type;
                if (ty(dur, 'str') || ty(dur, 'inst', Date)) {
                    const dt = ty(dur, 'str') ? new Date(dur) : dur;
                    if (ty(dt.getTime(), 'num')) {
                        dur = dt.getTime();
                        type = "ms";
                    } else return;
                }
                if (!ty(dur, 'num')) throw new Error('Invalid number (dur)');
                let mu, fl = Math.floor.bind(Math);
                let pd = (v) => (v < 10 ? `0${v}` : v);
                let re = '', c = 60, z = 1e3, x = z * c, w = c * 24;
                let ft = (a, b, c = ':') => (a > 0 ? b + c : '');
                let ry = (l, k) => { re = l; pt = pt.replace(k, ''); };
                let p = '.ms';
                switch (type) {
                    case 'n': mu = 1 / 1e6; break;
                    case 'mc': mu = 1 / z; break;
                    case 'ms': mu = 1; break;
                    case 's': mu = z; break;
                    case 'm': mu = (x); break;
                    case 'h': mu = (x * c); break;
                    case 'd': mu = (x * w); break;
                    case 'mn': mu = (x * w * 30); break;
                    case 'y': mu = (x * w * 30 * 12); break;
                    default: return;
                }
                const ms = dur * mu, s = fl(ms / z), m = fl(s / c), h = fl(m / c),
                    d = fl(h / 24), mn = fl(d / 30), y = fl(mn / 12),
                    fy = pd(y), fmn = pd(mn % 12), fd = pd(d % 30),
                    fh = pd(h % 24), fm = pd(m % c), fs = pd(s % c),
                    fms = pd(fl(ms % z));
                // todo: clean up
                if (pt.endsWith(p)) ry(`.${fms}`, p);
                if (pt.endsWith(':s')) ry(':' + fs + re, 's');
                switch (pt) {
                    case 'ms': return ms;
                    case 's': return ms / z;
                    case 'm': return s / c;
                    case 'h': return m / c;
                    case 'd': return h / 24;
                    case 'mn': return d / 30;
                    case 'y': return mn / 12;
                    case 'm:': return `${pd(m)}${re}`;
                    case 'h:m:': return `${pd(h)}:${fm}${re}`;
                    case 'd:h:m:': return `${pd(d)}:${fh}:${fm}${re}`;
                    case 'mn:d:h:m:': return `${pd(mn)}:${fd}:${fh}:${fm}${re}`;
                    case 'y:mn:d:h:m:': return `${fy}:${fmn}:${fd}:${fh}:${fm}${re}`;
                    case 'y:mn:d:h:m': return `${fy}:${fmn}:${fd}:${fh}:${fm}`;
                    case 'y:mn:d:h': return `${fy}:${fmn}:${fd}:${fh}`;
                    case 'y:mn:d': return `${fy}:${fmn}:${fd}`;
                    case 'y:mn': return `${fy}:${fmn}`;
                    case "auto": return [[y, fy], [mn, fmn], [d, fd], [h, fh], [m, fm], [s, fs, '.']].map(v => ft(...v)).concat([`${fms}`]).join('');
                    default: return { ms, s, m, h, d, mn, y, fy, fmn, fd, fh, fm, fs, fms };
                }
            },
        },
        // lite_start
        /**
         * Copies all properties from _source to _target
         * @method copy
         * @memberof utils
         * @param _target {Object}
         * @param _source {Object}
         * 
         */
        copy(_target, _source) {
            for (let key of Reflect.ownKeys(_source)) {
                if (key !== "constructor" && key !== "prototype" && key !== "name") {
                    let desc = Object.getOwnPropertyDescriptor(_source, key);
                    Object.defineProperty(_target, key, desc);
                }
            }
        },
        /**
        * @method equal
        * @memberof utils
        * @description Compares two objects deeply
        * @param x {Object}
        * @param y {Object}
        * @param z - 0: no copy, 1: copy y to x
        * @return {boolean}
         */
        equal(x, y, z) {
            if (x === y) return true;
            else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
                if (Object.keys(x).length != Object.keys(y).length) return z == 1 ? x[p] = y[p] : false;
                for (var p in x) {
                    var a = () => ((typeof y[p] == "string") ? x[p] = `${y[p]}` : this.copy(x[p], y[p]));
                    if (y.hasOwnProperty(p)) {
                        if (!this.equal(x[p], y[p])) z == 1 ? a() : false;
                    } else return z == 1 ? a() : false;
                }
                return true;
            }
            else return z == 1 ? x = y : false;
        },
        /**
        * Generates a new array with additional methods for set operations.
        *
        * @method splAr
        * @memberof utils
        * @param {Array} array - The array to be extended.
        * @return {Array} The extended array.
        */
        splAr(array = []) {
            array.prototype.intersection = (arr) => { this.filter(x => arr.includes(x)); };
            array.prototype.difference = (arr) => { this.filter(x => !arr.includes(x)); };
            array.prototype.symmetricDifference = (arr) => {
                this.filter(x => !arr.includes(x))
                    .concat(arr.filter(x => !this.includes(x)));
            };
            return array;
        },
        // lite_end
        /**
         * @method type
         * @memberof utils
         * @param v - value to check
         * @param t - type of value to check
         * @param u -  t==inst use this value to check for instance of
         * @return {boolean}
         */
        type(v, t, u) {
            let n = 'number', o = "object", f = "function", s = "string", i = 'bigint', b = "boolean", sym = "symbol",
                a = _ => isNaN(v), z = _ => v instanceof _, c = _ => Array.isArray(v), l = null, d = undefined, h = (k) => typeof v === k, j = _ => t === _;
            return j('int') ? Number.isInteger(v) :
                j('float') || j('.1') || j(.1) ? (h(n) && !a() && v % 1 !== 0) :
                    j('num') || j(n) ? h(n) && !a() :
                        j(i) ? h(v) :
                            j('-') ? v < 0 : j('+') ? v > 0 :
                                j('array') || j('arr') ? c() :
                                    j('null') ? v === l :
                                        j('unu') ? v === l || v === d :
                                            j('emp') ? v === l || v === d || v === '' :
                                                j('bool') ? h(b) :
                                                    j('str') || j(s) ? h(s) :
                                                        j("func") || j("fn") || j(f) ? h(f) :
                                                            j('obj') || j(o) ? (h(o) && !c() && v !== l) :
                                                                j('set') ? z(Set) :
                                                                    j('map') ? z(Map) :
                                                                        j('wSet') ? z(WeakSet) :
                                                                            j('wMap') ? z(WeakMap) :
                                                                                j('inst') ? z(u) :
                                                                                    j('sym') || j(sym) ? h(sym) :
                                                                                        j('date') ? z(Date) :
                                                                                            j('regexp') || j('rx') ? z(RegExp) :
                                                                                                j('promise') || j("prm") ? z(Promise) :
                                                                                                    j('error') || j('err') ? z(Error) : d;
        }
        //toPer: (total, avail, cur) => (cur / (total - avail) * 100),
        //fromPer: (total, avail, per) => ((per / 100) * (total - avail)),
    };
    rt.utils.Time.ctime = rt.utils.Time.fmt;
    //util.copy(__o.utils, util);
};/**
 * @namespace vdom
 */
const vdom = async (rt) => {
    if (!rt) throw new Error('vdom requires __o {mknode,mkEl,utils} {./core.js}');
    const { mknode, log, _pEl: parse, utils } = rt;

    let updateQueue = [];
    let isRendering = false;

    function enqueueUpdate(rtEl, vEl, opt = {}) {
        updateQueue.push({ rtEl, vEl, opt });
        if (!isRendering) {
            isRendering = true;
            __o.reqAnima(processQueue);
        }
    }

    function processQueue() {
        while (updateQueue.length > 0) {
            const { rtEl, vEl, opt } = updateQueue.shift();
            renderVDOM(rtEl, vEl, opt);
        }
        isRendering = false;
    }
    // User-facing render function
    function render(rtEl, vEl, opt = {}) {
        (opt.force ? renderVDOM : enqueueUpdate)(rtEl, vEl, opt);
    }
    function comp(rEl, vEl, opt = {}) {
        if (vEl === undefined || vEl === null) return removeEventListeners(rEl), { remove: true };
        if (typeof vEl === 'string') return rEl.nodeType === Node.TEXT_NODE && rEl.textContent === vEl;
        const pvel = parse(vEl);
        if (rEl?.tagName?.toLowerCase() !== pvel.t) return { tagName: true };
        const c = new rt(rEl);
        const t = v => (Object.keys(v).length > 0);
        const r = i => (Object.entries(i));
        const at = Array.from(rEl?.attributes || []);
        const lt = rEl?.__listen ?? {};
        const vp = vEl.props ?? {};
        const added = {};
        const removed = {};
        const changed = {};
        const listen = {};
        // todo: add force update?
        for (const [key, value] of r(vp)) {
            if (key.startsWith('on')) {
                if (opt.debug)
                    log('listen', lt, value, utils.type(lt[key], 'emp'), lt[key]?.toString() !== value?.toString());
                if (lt[key] && lt[key]?.toString() !== value?.toString())
                    listen[key] = value;
                else if (utils.type(lt[key], 'emp')) listen[key] = value, opt.dbg ? log("lt", lt, key, value) : 0;
                continue;
            }
            let k = key === "html" ? c.attr("html") : (key === "class") ? pvel.c : key == "id" ? pvel.i : c.gat(key);
            if ((k == undefined || k == "") && value) added[key] = value;
            else if (k != value) changed[key] = value;
        }
        for (const [key] of r(lt)) (!vp[key]) ? listen[key] = null : 0;
        for (const { name: nm, value: v } of at) {
            //__o.log(nm, /^(class|id)$/.test(nm), utils.type(pvel[nm[0]], 'unu'), v, pvel[nm[0]], v === pvel[nm[0]]);
            if (/^(class|id)$/.test(nm)) (utils.type(pvel[nm[0]], 'unu') || pvel[nm[0]] != v) ?
                changed[nm] = pvel[nm[0]] : 0;
            else if (!(nm in vp)) removed[nm] = null, (opt.dbg) ? __o.log('comp-d', nm) : 0;
        }
        //*! might be a problem => typeof vp.html == 'undefined' hope fully vEl.children.length < 1 controls it
        if (rEl?.innerHTML?.length > 0 && typeof vp.html == 'undefined' && vEl.children.length < 1) removed.html = null;
        if (t(changed) || t(removed) || t(added) || t(listen)) {
            //console.log('comp-up', t(changed), t(removed), t(added) ? added : 0, t(listen));
            return { added, removed, changed, listen };
        }
        return null;
    }
    function removeEventListeners(node) {
        const clone = node.cloneNode(true);
        node.parentNode.replaceChild(clone, node);
    }
    function __vd(rEl, vEl, ovEl, opt = {}) {
        if (rt.utils.type(vEl, "obj") && vEl.type) {
            const ne = parse(vEl?.type);
            opt.dbg ? log(rEl) : 0;
            opt.dbg ? log('__vd_p', vEl.type, 'parse', ne) : 0;
        }
        let { root, force } = opt;
        let res;
        if (vEl === undefined || vEl === null) {
            if (rEl && rEl.parentNode) {
                rEl.parentNode.removeChild(rEl);
            }
            return null;
        }
        if (!rEl && typeof vEl !== 'string') {
            res = mknode(vEl, opt.dbg ?? opt.debug);
            if (!(root ?? res).__listen)
                (root ?? res).__listen = {};
            return res;
        }
        if (typeof vEl === 'string') {
            let t = 'textContent';
            if (rEl.nodeType === Node.TEXT_NODE) {
                if (rEl[t] !== vEl) rEl[t] = vEl;
            }
            else {
                rEl[t] = '';
                rEl.appendChild(document.createTextNode(vEl));
            }
            return null;
        }
        try {
            //if ((vEl && vEl.props?.forceUpdate) || force) {
            //console.log("real-vdom");
            res = comp(rEl, vEl, opt);
            //console.timeEnd("real-vdom");
            //}
            //else {
            //console.time("both-vdom");
            //    res = compV(ovEl ?? {}, vEl, rEl.__listen, opt);
            //console.timeEnd("both-vdom");
            //}
        } catch (error) {
            log(error);
            //console.timeEnd("both-vdom");
            //console.timeEnd("real-vdom");
        }
        //}
        if (rEl && !rEl.__listen) rEl.__listen = {};
        const y = v => (Object.keys(v)),
            t = v => (y(v).length > 0),
            tt = (v) => v && t(v);
        //======
        if (__o.utils.type(res, 'obj')) {
            if (opt.debug)
                log('vdom', rEl, vEl, res);
            if (res.remove) {
                return rEl.remove(), false;
            }
            if (res.tagName) {
                if (rEl) {
                    rEl.parentNode.replaceChild(mknode(vEl, opt.dbg ?? opt.debug), rEl);
                }
                return false;
            }
            let r = new rt(rEl);
            if (tt(res.added)) {
                if (!res?.added?.forceUpdate) {
                    r.attr(res.added);
                }
            }
            if (tt(res.removed)) {
                for (const key of y(res.removed)) {
                    if (opt.debug) log('removed', key, res.removed[key]);
                    if (!/force(U|u)padate/i.test(key))
                        r.attr(key, 0, 'r');
                }
            }
            if (tt(res.changed)) {
                if (opt.debug) log('changed', res.changed);
                for (const key of y(res.changed)) {
                    if (force || !utils.type(res.changed[key], "unu") || /force(U|u)padate/i.test(key)) {
                        if (opt.debug) log('changed', key);
                        if (rEl instanceof HTMLInputElement && key === 'value') {
                            if (rEl.value !== vEl.props.value) {
                                rEl.value = vEl.props.value;
                            }
                        } else if (/force(U|u)padate/i.test(key)) ;
                        else {
                            r.attr(key, res.changed[key]);
                        }
                    }
                    //__o.log(rEl);
                }
            }
            if (opt.debug && tt(res.listen))
                log(vEl, res.listen);
            if (tt(res.listen)) {
                if (opt.debug && rEl.__listen) log(Object.entries(rEl.__listen));
                for (const key of y(rEl.__listen)) {
                    if (!key || !key.startsWith('on')) continue;
                    let v = rEl.__listen[key];
                    if (res.listen[key] == null || v?.toString() !== vEl?.props[key]?.toString()) {
                        if (opt.debug) log('off', rEl, key, res.listen[key]);
                        var k = key.slice(2);
                        if (__o.utils.type(v, 'obj'))
                            r.off(k, v.f ?? v.fn, v.o ?? v.opt);
                        else r.off(k, v);
                        delete rEl.__listen[key];
                    }                }
                for (const key of y(vEl.props)) {
                    if (!key || !key.startsWith('on')) continue;
                    let v = rEl.__listen[key] = vEl.props[key], k = key.slice(2);                    if (__o.utils.type(v, 'obj'))
                        r.on(k, v.f ?? v.fn, v.o ?? v.opt);
                    else r.on(k, v);
                }
            }
        }
        //rt.log(vEl.props);
        if (vEl.props?.html) return null;
        const rch = Array.from(rEl.childNodes ?? []);
        const vch = vEl.children;
        const och = ovEl ? ovEl?.children : [];
        const length = Math.max(rch.length, vch?.length);
        for (let i = 0; i < length; i++) {
            if (opt.dbg) __o.log("rendering", i, rch[i], vch[i], och[i]);
            if (vch[i] == "") continue;
            let newrEl = __vd(rch[i] ?? null, vch[i] ?? null, och[i] ?? null, opt);
            if (newrEl) {
                if (rch[i] !== newrEl) {
                    if (rch[i]) {
                        if (opt.debug) log(rch[i].__listen);
                        for (const key of y(rch[i].__listen)) {
                            if (!key || !key.startsWith('on')) continue;
                            let v = rch[i].__listen[key];
                            if (v?.toString() !== vEl?.props[key]?.toString()) {
                                var k = key.slice(2);
                                if (rt.utils.type(v, 'obj'))
                                    r.off(k, v.f ?? v.fn, v.o ?? v.opt);
                                else r.off(k, v);
                                delete rch[i].__listen[key];
                            }                        }
                        rch[i].parentNode.replaceChild(newrEl, rch[i]);
                    }
                    else rEl.appendChild(newrEl);
                }
            }
        }
        return rEl;
    }
    //todo: cs/style as bojects instead of string need to be handled
    /**
     * Renders the given virtual element into the specified root element.
     * @method vdom
     * @memberof vdom
     * @param {HTMLElement|CustomElement} rtEl - The root element to render into.
     * @param {Array|Object} vEl - The virtual element to render. 
     * @param {Object} [opt={}] - Optional parameters.
     * @param {boolean} [opt.shadow] - Whether to render into the shadow root.
     * @param {boolean} [opt.debug] - Whether to include debug information in the output.
     * @param {boolean} [opt.el] - Whether to return the rendered element.
     * @return {Object} - The rendered element and additional information.
     * @argument vEl need to be created using __o.mkEl
     */
    function renderVDOM(rtEl, vEl, opt = {}) {
        let el;
        let { type } = rt.utils;
        //batchUpdate(i => {
        let a = type(rtEl, 'inst', rt) ? rtEl.gt : (type(rtEl, 'inst', HTMLElement) ? rtEl : new rt(rtEl).gt), f;
        //! needs fixing for shadow handleing
        let s = opt?.shadow;
        let r = type(vEl, 'arr');
        //? reworks/cleanup this for vdom handleing
        f = s ? a?.shadowRoot : r ? a : a?.firstChild;
        if (r) {
            let ch = a?.children;
            let mx = Math.max(ch?.length ?? 0, vEl?.length ?? 0);
            el = [];
            for (let i = 0; i < mx; i++) {
                const n = __vd(ch[i] ?? null, vEl[i] ?? null, type(a._chd, 'arr') ? a._chd[i] : null, opt);
                if (n !== null && n != false) {
                    if (!type(ch[i], 'obj')) f.appendChild(n);
                    else if (!n.isEqualNode(ch[i])) f.replaceChild(n, ch[i]);
                    el.push(n);
                }
            }
            a._chd = [].concat(vEl);
        }
        else {
            el = __vd(f, vEl, a._chd, opt);
            a._chd = {};
            Object.assign(a._chd, vEl);
            f == null && el != null ? (s ? s : a).append(el) : 0;
        }
        //});
        if (opt.debug)
            return { el, __ovt: vEl };
        if (opt.el)
            return { el };
    }
    rt.vdom = render;
    return rt;
};/* ================================================ */
/* =========== core.js [0.13.2] lib ================== */
/* ======== function _c() || class __o ============ */
/* ================================================ 
! use this file not core.0.9.0.js
* New wrappers | classes 
-----------------------------------
* Important:
! [+*] => Does not work with < 0.13.0 need to rewrite to migrate
* [++] => New functions & classes
* [✓] => Tested
* [?? ... d/m/y] => last checked lib|fn and could not figure out the logic behind it
* [?? d/m/y] => last checked whether method was implemented and tested
_____________________________________________________
* => for bundling use coreweb/{ wa, ws, sme, rme, pr } instead
* 🚨 ensure [coreweb] is installed as a dependency
* 📁 builds are in build/parts
_____________________________________________________
[+^]
  * websocket [+^]
    => (lib) ws.js [0.1.0] 
    => (class) _ws 
    !=> (wrapper) _o.ws 
...................................
[+^]
  * webaudio api
    => (lib) wa.js [0.1.0]  
    => (class) _WA 
    !=> (wrapper) _o.webaudio
...................................
[++]
  * vdom
    ! => (lib) vdom.js || build adds it in this file
    => (func) __o.vdom(root, vEl,opt={force?,debug?})
...................................
[+*]
  * utils
    ! => (lib) utils.js || build added it in this file
    => (obj) __o.utils 
    => (func) { math:{th(),rNum(),per:{to(),from()},round()},Time:{ctime,async delay},copy,equal,splAr}
...................................
[++]
  * 🚨 ⚠️ Camera, Mic, speaker, screen Streams, [?? sme.0.3.0.js 26/10/22] ⚠️ 🚨
    => (lib) sme.js [0.1.0 ? 0.3.0]
    => (class) _sMe
    => (wrapper) _o.sme('dio'||'uio'||'screen',opt)
    => _o.stop(el);
...................................
[++]
  * mediaRecord (need to refine)
    => (lib) rme.js [0.1.0]
    => (class) _rMe(stream, opt)
...................................
[++] 
    ? streamCapture 
    => (wrapper) _o.getStm
...................................
[++]
    ? crypt
    => (lib) crypt.js  [0.1.0]
    => (class) crypt
...................................
[++] 
TODO: Need to still build
  * Peer
    => (lib) pr.js  [0.1.0]
    => (dependency) ws, media streams
...................................
/* ================================================ */
/* 
! important
TODO: almost there ready for public release almost there
*/
let __o$1=class __o {
    /**
     * Element Selector or Objects to work on in the same class instance .
     *
     * @param {type} _ - description of parameter
     * @return {Object} - instance of the class
     */
    _(_) {
        if (this === _o) console.warn(`{ const: _o & fn: _n } is deprecated.\nPlease create a new one instead.`);
        this.el = _;
        this.fdoc = false;
        this.get();
        return this;
    }
    #El;
    /**
  * Retrieves an element based on the provided index or default element.
  *
  * @param {any} i - The index of the element to retrieve or the default element.
  * @param {any} d - The default element to use if no index is provided.
  * @return {HTMLElement | Document | Window | Object | undefined} The retrieved element or undefined if not found.
  */
    get(i, d) {
        var el = i ?? this.el;
        let { type } = __o.utils;
        if (type(el, "inst", HTMLElement) || type(el, "inst", Window) || type(el, "inst", Document)) return this.#El = el;
        else if (type(el, "obj")) {
            return this.#El = el;
        }
        else if (type(el, "str")) {
            if (el.search(/^\w+:\/\//g) > -1 && el.search(/\w+\[*\]/g) == -1)
                return;
            var doc = !this.fdoc ? document : this.fdoc, qy = 'querySelector';
            //---------------------------------------------
            // * old: _c("#foo.class") ==> changed to _c("#foo .class")
            // TODO: switch to qy selector or improve logic ??? [done]
            //---------------------------------------------
            let tEl;
            try { tEl = doc[qy](el); } catch (e) { if (d) console.error(e); }            if (tEl)
                return this.#El = tEl;
        }
    }
    /**
  * Selects an element based on the given query and assigns it to the `#El` property.
  *
  * @param {string} i - The query used to select the element.
  * @return {Object} - Returns `this` to allow for method chaining.
  */
    qy(i) {
        this.#El = this.#El.querySelector(i);
        return this;
    }
    /**
   * This function takes two parameters: `e` and `i`. It returns an array containing all the elements that match the given `i` query selector, if provided, or all the elements that match the `e` query selector using the `querySelectorAll` method. The returned array is converted to an array using the `Array.from()` method.
   *
   * @param {type} e - The query selector to match the elements against.
   * @param {type} i - The optional query selector to match the elements against.
   * @return {Array} - The array containing the matched elements.
   */
    all(e, i) {
        var a = "querySelectorAll";
        return Array.from((i) ? this.get(e)[a](i) : this.gt[a](e));
    }
    /**
     * Append an element to the current element.
     *
     * @param {type} type - the type of element to append
     * @param {attr} attr - the attributes of the element
     * @return {Object} - the current object instance
     */
    append(type, attr) {
        //__o.log(this);
        var u = __o.utils.type, m = this.mk.bind(this);
        u(type, "obj") || u(type, 'inst', HTMLElement) ?
            this.gt.appendChild(type) :
            u(type, 'emp') ? m(this.el, attr) :
                u(this.el, 'emp') ? m(type, attr) :
                    this.gt.appendChild(m(type, attr));
        //this.add = () => { return _elem; };
        return this;
    }
    /*lite_start*/
    //!===== needs checking ============== [?? 26/10/22]
    prepend(type, attr, ind) {
        let mk = this.mk, El = this.gt;
        var ins = (...a) => El.insertBefore(...a),
            ch = (...a) => El.childNodes(...a),
            f = (v) => ((v == null || undefined) ? 0 : v);
        let _elem = (typeof type === "object") ?
            ins(type, (typeof attr === "number" ? ch[f(attr)] : attr)) :
            ins(mk(type, attr), (typeof ind === "number" ? ch[f(ind)] : ind));
        this.add = () => { return _elem; };
        return this;
    }
    /*lite_end*/
    mk(type, attr) {
        // __o.log(this);
        var e = (i) => (document.createElement(i)), o = "obj", b, x, u = __o.utils.type;
        if (this.el && !u(this.el, "str") && u(type, "unu") && u(attr, "unu")) x = e("div");
        else {
            x = (u(type, o)) ? e(this.el) :
                (type == "") ? e(this.el) : e(type);
            b = attr ?? type;
            if (u(b, o))
                __o.each(b, "k", v => {
                    var t = b[v];
                    (v == "text") ? x.innerText = t :
                        (v == "html") ? x.innerHTML = t :
                            (v == "style" && u(t, o)) ?
                                __o.each(t, "k", s => x.style[s] = t[s]) :
                                x.setAttribute(v, t);
                });
        }
        return x;
    }
    /**
    * Clone the given node.
    *
    * @param {number} n - The number of clones to create.
    * @return {Node} The cloned node.
    */
    clone(n) {
        return this.gt.cloneNode(n);
    }
    //!===== needs checking ============== [?? 23/9/23]
    static delay(n, cb) {
        if (typeof cb === "function") return setTimeout(cb, n);
        else clearTimeout(n);
    }
    delay(n, cb) {
        var a = (cb ?? this.el);
        var b = __o.delay(n, typeof a === "function" ? a : 0);
        return b ? b : this;
    }
    del(e) {
        e === undefined ?
            this.gt.remove() : this.gt.parentNode.removeChild(e);
        return this;
    }
    attr(type = null, val, e) {
        let El = this.gt;
        if (__o.utils.type(type, 'obj')) {
            __o.each(type, "e", ([k, v]) => {
                (k == 'text') ? El.innerText = v :
                    (k == "html") ? El.innerHTML = v :
                        (k == "style" && __o.utils.type(v, 'obj')) ? this.css(v) :
                            (v != null || v != undefined) ? El.setAttribute(k, v) : 0;
            });
        }
        else {
            if (type == 'text') {
                if (val === undefined) return El.innerText;
                else El.innerText = val;
            } else if (type == "html") {
                if (val == undefined) return El.innerHTML;
                else El.innerHTML = val;
            } else {
                if (e || e === 'r') El.removeAttribute(type);
                else if (val != undefined) El.setAttribute(type, val);
                else if (type != null) return this.gat(type);
                else return El.attributes;
            }
        }
        return this;
    }
    gat = (t) => (this.gt.getAttribute(t));
    static each(a, f, z) {
        const { utils: { type: t } } = __o,
            fu = (j) => {
                var c = (t(f, "str")) ? z : f;
                if (t(c, "fn") && t(j, 'arr'))
                    j.forEach((v, i) => c(v, i));
            };
        if (t(f, "fn")) fu(t(a, "arr") ? a : Array.prototype.slice.call(a));
        else if (t(f, "str"))
            fu(Object[f + (f == 'k' ? 'eys' : f == 'v' ? 'alues' : f == 'e' ? 'ntries' : 1)](a));
        return this;
    }
    each = __o.each;
    class(type, val, ...mor) {
        const { utils: { type: t } } = __o,
            f = i => i.search(/add|remove|toggle/g) !== -1;
        var a = this.gt.classList;
        if (t(type, 'str') && f(type))
            a[type](val, ...mor);
        else if (t(type, 'obj'))
            this.each(type, 'k', e => f(e) ? a[e](type[e], ...mor) : 0);
        else { return a; }
        return this;
    }
    css(type = 0, val = null) {
        var e = this.gt.style, t = type, i = val;
        if (t == 0 && i == null)
            return e;
        else if (__o.utils.type(t, "obj"))
            this.each(t, "k", v => e[v] = t[v]);
        else if (__o.utils.type(t, "str") && /:/g.test(t)) {
            let o = t.split(';');
            for (let d of o) {
                let b = d.indexOf(':'), a = d.substring(0, b).trim().replace(/-([a-z])/g, (m, l) => l.toUpperCase());
                e[a] = d.substring(b + 1).trim();
            }
        }
        else if (i == null) return e[t];
        else e[t] = i;
        return this;
    }
    gcs(op, sty = null, ex = null) {
        var a = (ex == null) ? this.gt : this.get(op);
        var b = (ex == null) ? op : sty;
        var c = ex || sty;
        return window.getComputedStyle(a, b).getPropertyValue(c);
    }
    get rect() {
        return this.gt.getBoundingClientRect();
    }
    hide(i) {
        var d = 'display', o = "_o-show", j = (k) => (this.attr(o, k).css(d, k ? 'block' : 'none'));
        if (!i)
            j(this.gat(o) == 'false' || undefined || null ? true : false);
        else {
            if (i == "b") j(true);
            else if (i == "n") j(false);
        }
        return this;
    }
    val(i = null) {
        if (i !== null) this.gt.value = i;
        return i == null ? this.gt.value : this;
    }
    /*lite_start*/
    av(i, l = null) {
        if (l !== null) this.gt[i] = l;
        return l == null ? this.gt[i] : this;
    }
    /*lite_end*/
    txt(t = null) {
        if (t !== null) this.gt.textContent = t;
        return t == null ? this.gt.textContent : this;
    }
    on(e, f, b) {
        //if (Array.isArray(e)) return false;
        var a = 'addEventListener';
        if (__o.utils.type(e, "obj"))
            __o.each(e, 'k', v => this.gt[a](v, e[v], f));
        else
            this.gt[a](e, f, b);
        return this;
    }
    off(e, f, o) {
        this.gt.removeEventListener(e, f, o);
        return this;
    }
    static hw = (i) => {
        var h = 'Height', w = 'Width', j = 'offset', n = 'outer', m = 'inner',
            p = window,
            o = (h, w) => ({ h, w });
        return (i == 'e') ? o(this.gt[j + h], this.gt[j + w]) :
            (i == 'o') ? o(p[n + h], p[n + w]) :
                o(p[m + h], p[m + w]);
    };
    hw = __o.hw;
    frame(d = null) {
        var y = (this.gt.contentWindow ?? this.gt.contentDocument);
        if (d == null) return y;
        else if (d == "doc") return y.document;
        else if (typeof d == 'object') {
            if (y.document) {
                this.fdoc = y.document;
                if (d.el) this.get(d.el);
            }
        }
        return this;
    }
    frameEl(a) {
        this.#El = window.frameElement;
        return (a) ? this.attr(a) : this;
    }
    // ! needs checking
    parent(e) {
        var y = parent.document, i = 'doc';
        if (y) this.fdoc = y;
        else { if (e != i) this.#El = this.gt.parentNode; }
        return (e == i) ? y : this;
    }
    canvas = (e, i) => (typeof !i ? this.gt.getContext(e) : this.gt.getContext(e, i));
    atl(x) {
        alert(x);
        return this;
    }
    /* static ajax(obj = {}, fn) {
        let { url, method, body, head, async, type, username, password, cb } = obj;
        const xhr = new XMLHttpRequest();
        fn = fn ?? cb;
        if (typeof fn == 'function')
            xhr.onreadystatechange = () => { fn(xhr); };
        xhr.open(method ?? type, url, async, username, password);
        if (head)
            Object.entries(head).forEach(([k, v]) => xhr.setRequestHeader(k, v));
        xhr.send(body);
    } */
    static async fetch(obj = {}, fn) {
        let { url, method, body, head, type, username, password, cb } = obj, h = "headers";
        fn = fn ?? cb;
        const opt = {
            method: method ?? type,
            headers: head,
            body: body,
        };
        if (username && password) {
            opt[h] = opt[h] || {};
            opt[h]['Authorization'] = 'Basic ' + btoa(username + ':' + password);
        }
        try {
            const rs = await fetch(url, opt);
            const ct = rs[h].get('content-type');
            let data = ct.includes('application/json') ? await rs.json() :
                ct.includes('text') ? await rs.text() : await rs.blob();
            const r = { status: rs.status, data };
            if (typeof fn === 'function') fn(r);
            else return r;
        } catch (err) {
            const r = { status: 0, data: err.message };
            if (typeof fn === 'function') fn(r);
            else return r;
        }
    }
    //!===== needs checking ============== [?? 23/9/23]
    /* ajax(f = null, ex = null, err = null) {
        var type = Object.keys(this.el)[0];
        let cb;
        if (typeof f == 'function')
            cb = (xhr) => {
                if (xhr.readyState == 4 && xhr.status == 200) { f(xhr); }
                else if (xhr.status != 200 && typeof err == 'function') { err(xhr); }
            };
        __o.ajax({
            type,
            url: this.el[type],
            async: this.el["async"],
            head: f?.head ?? ex?.head,
            body: f?.body ?? ex?.body,
            cb
        });
        //xhr.open(type, this.el[type], this.el["async"]);
        //var ff = (t) => { Object.keys(t.head).forEach(v => { xhr.setRequestHeader(v, t.head[v]); }); },
        // b = "";
        // if (typeof f == 'function' && ex != null) { ff(ex); b = ex.body; }
        // else if (f != null && typeof f == 'object') { ff(f); b = f.body; }
        //xhr.send(b);
    } */
    //!===== needs checking ============== [?? 23/9/23]
    json(t = null, o = null, l = 0) {
        var i, q, e = 's', p = "p", z = this.el,
            f = (s, x, k) => {
                if (s === e) return JSON.stringify(x, null, k);
                else if (s === p) {
                    try { i = JSON.parse(x); } catch (e) { return false; }
                    return i;
                }
            },
            x = (k, l) => (typeof k == l),
            y = k => (x(k, 'object')),
            w = k => (x(k, 'string'));
        q = (y(t)) ? f(e, t, o) :
            (w(t)) ? ((t == p || t == e) ? f(t, o ?? z, l ?? o) : f(p, t, o)) :
                (t == null) ? ((y(z)) ? f(e, z) : (w(z)) ? f(p, z) : null) : null;
        return (q == null) ? this : q;
    }
    /*debug_start*/
    //! does not work without wa[0.1.0].js
    //* ↑ working on wa.js as a external file-plugin 
    /* webaudio(a) {
        if (a ?? this.el == "n")
            return this.wac = new _WA();
        if ((a ?? this.el == "c") && typeof _WA == 'object')
            return new _WA();
        //this.mkMe = (b) => (this.wac.mkMe(this.gt, b));
        //this.mkGn = () => (this.wac.mkGn());
        //this.mkAn = () => (this.wac.mkAn());
        //this.mkPan = () => (this.wac.mkPan(a));
        //this.mkDe = (b) => (this.wac.mkDe(b));
        //this.mkComp = () => (this.wac.mkComp());
        //this.mkRev = () => (this.wac.mkRev());
        //this.mkBiF = () => (this.wac.mkBiF());
        //this.mkOsc = () => (this.wac.mkOsc());
        //this.mkWvSh = () => (this.wac.mkWvSh());
        return this;
    } */
    /*debug_end*/
    /*lite_start*/
    //! does not work without ws[0.1.0].js
    //* ↑ working on ws.js as a external file-plugin
    ws(p, ex) {
        var li = this.el,
            ws = (p == '' || !p) ? { li } : { p, li };
        if (ex != '' || !ex) ws.ex = ex;
        return new _ws(ws);
    }
    static worker(w) {
        w = w ?? {};
        if ((Worker)) {
            if (w.id) {
                if (w.type == "work") w.id = new Worker(w.run);
                else if (w.type == "share") work.id = new SharedWorker(w.run);
                return w.id;
            } else {
                w.id?.terminate();
                w.id = null;
            }
        } else return "Browser not supported. Web Worker required";
        return this;
    }
    static storage(s) {
        var k = Object.keys(s)[1];
        if (typeof (Storage) !== "undefined") {
            var l = s.t === "l" ? localStorage :
                s.t === "s" ? sessionStorage : null;
            if (l) {
                if (k === "set") l.setItem(s.set);
                else if (k === "get") return l.getItem(s.get);
                else if (k === "del") l.removeItem(s.get);
            }
        } else return "Browser not supported. Web Storage required";
        return this;
    }
    fulScr() {
        var a = this.gt, i = (j, o) => (a[j + (!o ? 'equestFullscreen' : 'xitFullscreen')]), k = 'webkit';
        if (a.elf && a.elf == false) {
            if (i('r')) i('r')();
            else if (i(k + 'R')) i(k + 'R')();
        } else {
            if (i('e', 1)) i('e', 1)();
            else if (i(k + 'E', 1)) i(k + 'E', 1)();
        }
        this.elf = a;
        var ty = [parent.document, window.frameElement, window];
        var w = this.elf == ty[0] ? ty[0] : this.elf == ty[1] ? ty[1] : ty[2];
        ['ff', 'n'].forEach(v => _c(w)[v]("fullscreenchange", this.isfulScr.bind(this)));
        return this;
    }
    isfulScr() {
        var a = document.fullscreenElement;
        if (this.elf != null && typeof this.elf == 'object')
            this.elf.full = !a ? false : true;
        return document.fullscreen;
    }
    /*lite_end*/
    open(t = null, f = null) {
        var a = (null == t || "" != t) ? t : "_blank",
            b = (null == t && "" != f) ? f : null;
        window.open(this.el, a, b);
    }
    // @deprecated: remove secToHms, milliToMS, msToTime it has moved to __o.utils.Time
    /* secToHms() {
        var d = Number(this.el), i = 3600, j = 60, f = Math.floor,
            m = f(d % i / j),
            s = f(d % i % j);
        return ((m > 0 ? m + (m == 1 ? " : " : " : ") : "") +
            (s > 0 ? s + (s == 1 ? " " : "") : ""));
    } */
    // @deprecated
    /* milliToMS(i) {
        var s = Number(i ?? this.el ?? 0);
        var Mi = Math.floor(s / 60);
        Mi = (Mi >= 10) ? Mi : "0" + Mi;
        s = Math.floor(s % 60);
        s = (s >= 10) ? s : "0" + s;
        return Mi + ":" + s;
    } */
    // @deprecated 
    /* msToTime(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
        return hrs + ':' + mins + ':' + secs + '.' + ms;
    } */
    /*lite_start*/
    static reqAnima(i) {
        var requestAnimationFrame = window.requestAnimationFrame /* || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame */;
        return requestAnimationFrame(i);
    }
    reqAnima = __o.reqAnima;
    static delAnima(i) {
        window.cancelAnimationFrame(i);
        return this;
    }
    delAnima = __o.delAnima;
    /*lite_end*/
    /*static nav(i) {
        var a =
            (i == "venSub") ? "vendorSub" :
                (i == "prodSub") ? "productSub" :
                    (i == "ven") ? i + "dor" :
                        (i == "touchpt") ? "maxTouchPoints" :
                            (i == "hardware") ? i + "Concurrency" :
                                (i == "cookie") ? i + "Enabled" :
                                    (i == "cname") ? "appCodeName" :
                                        i == "name" ? "appName" :
                                            i == "ver" ? "appVersion" :
                                                i == "platform" ? i :
                                                    i == "prod" ? i + "uct" :
                                                        i == "user" ? i + 'Agent' :
                                                            i == "lang" ? i + 'uage' :
                                                                i == "langs" ? 'languages' :
                                                                    i == "live" ? 'onLine' :
                                                                        i == "trk" ? 'doNotTrack' :
                                                                            i == "geo" ? i + 'location' :
                                                                                i == "mediaC" ? i + 'apabilities' :
                                                                                    i == "conn" ? i + 'ection' :
                                                                                        i == "plugin" ? i + 's' :
                                                                                            i == 'mime' ? i + 'Types' :
                                                                                                i == "tempstg" ? 'webkitTemporaryStorage' :
                                                                                                    i == "persstr" ? 'webkitPersistentStorage' :
                                                                                                        i == "userAct" ? i + 'ivation' :
                                                                                                            i == "mediaS" ? i + 'ession' :
                                                                                                                i == "perm" ? i + 'issions' :
                                                                                                                    i == "mem" ? 'deviceMemory' :
                                                                                                                        i == "clip" ? 'clipboard' :
                                                                                                                            i == "cred" ? i + 'entials' :
                                                                                                                                i == "key" ? i + 'board' :
                                                                                                                                    i == "loc" ? i + 'ks' :
                                                                                                                                        i == "mediaD" ? i + 'evices' :
                                                                                                                                            i == "sW" ? 'serviceWorker' :
                                                                                                                                                i == "stg" ? 'storage' :
                                                                                                                                                    i == "present" ? i + 'ation' :
                                                                                                                                                        i == "blt" ? 'bluetooth' :
                                                                                                                                                            i == "xr" ? i :
                                                                                                                                                                i == "vib" ? i + 'erate' :
                                                                                                                                                                    i == "gmedia" ? 'getUserMedia' :
                                                                                                                                                                        i == "midi" ? 'requestMIDIAccess' :
                                                                                                                                                                            i == i ? i : 0;
        //sendBeacon = function sendBeacon()
        //getGamepads = function getGamepads()
        //javaEnabled = function javaEnabled()
        //setAppBadge = fn()
        //clearAppBadge = fn()
        //requestMediaKeySystemAccess = fn()
        //getInstalledRelatedApps = fn()
        //webkitGetUserMedia = fn()
        //registerProtocolHandler = fn() 
        //unregisterProtocolHandler = fn() 
        //canShare = fn()
        //share = fn()
        return (a!=0) ? navigator[a] : navigator;
    } */
    get gt() {
        return this.#El;
    }
    /*lite_start*/
    getStm(el = null) {
        let fps = 0, e = this.gt,
            g = j => (e[j + 'aptureStream']),
            h = o => (g(o)(fps)),
            a = 'c', b = 'mozC';
        let stm = g(a) ? h(a) : g(b) ? h(b) : null;
        if (el != null)
            el.srcObject = stm;
        else console.error('Stream capture is not supported');
        return stm;
    }
    src(st = null) {
        var g = this.gt, s = 'srcObject';
        if (st == null) return g[s];
        if (st == '') g[s] = null;
        else g[s] = st;
        return this;
    }
    //* move to one of the media modules/plugins i dont think it has use on a normal webpages.
    /* static mime(t) {
        var a = "audio/", v = "video/", c = '\;codecs=', w = v + "webm", m = v + "video/mp4";
        var typ = [
            w, a + "webm",
            w + "\;av01.0.15M.10",
            w + "\;av01.2.15M.10.0.100.09.16.09.0",
            w + c + "vp9",
            w + c + "vp8",
            w + c + "daala",
            w + c + "h264",
            a + "webm" + c + "opus",
            v + "mpeg",
            v + c + "h264",
            v + c + "h265",
            m,
            m + +c + 'avc1.42E01E',
            m + c + "vp9",
            m + c + "avc1.4d002a",
            m + "\;av01.0.15M.10",
            m + c + "av01.0.00M.08",
            m + "\;av01.2.15M.10.0.100.09.16.09.0",
            m + c + "av01.0.05M.08,opus",
            m + c + "avc3",
            v + "H264",
            v + "quicktime",
            a + "eac3",
            a + "ac3",
            a + "wav",
            a + "flac",
            a + "aac",
            a + "opus",
            a + "ogg" + c + "vorbis"
        ], su = [];
        for (var i in typ) {
            var r = (t == 'r') ? MediaRecorder : MediaSource;
            if (r.isTypeSupported(typ[i])) {
                su.push(typ[i]);
            }
        }
        return su;
    } */
    // @deprecating: move to static
    //mime = __o.mime;
    stop(el) {
        var a = typeof el == 'object' ? el : _c(el).src();
        a.getTracks().forEach(trk => trk.stop());
        if (typeof el == 'string') _c(el).src('');
    }
    static mkObs(el, cb, opt = null) {
        const { utils: { type: t } } = __o;
        let options = { root: null, rootMargin: "0px", threshold: [0] };
        if (t(opt, 'obj'))
            this.each(opt, 'e', (k, v) => (options[k] = t(v, 'func') ? v() : v));
        let obs = new IntersectionObserver(cb, options);
        obs.observe(el);
        return obs;
    }
    /*lite_end*/
    // @deprecating: move to static
    //createObserver = __o.mkObs;
    //-------
    static mkEl = (type, props, ...c) => ({ type, props: props || {}, children: c || [] });
    //static createElement = __o.mkEl;
    // @deprecating move to static
    //createElement = __o.mkEl;
    //-------
    static mknode(obj, dg) {
        const { utils: { type: u }, log } = __o;
        const tt = (a, b) => (a.map(v => b + v));
        const g = ['svg', 'path', "circle", "clipPath", "defs", "desc", "ellipse", "g", "image", "use", 'symbol', 'text', 'tspan', 'foreignObject', 'line', 'marker', 'mask', 'metadata', 'pattern', 'polygon', 'polyline', 'rect'/* , 'stop', 'view' */]
            .concat(
                tt(["", "path"], 'hatch'),
                tt(["", "Motion", "Transform"], "animate"),
                tt([
                    "Blend", "ColorMatrix", "ComponentTransfer", "Composite", "ConvolveMatrix", "DiffuseLighting",
                    "DisplacementMap", "DistantLight", "DropShadow", "Flood", "GaussianBlur",
                    "Image", , "Morphology", "Offset", "PointLight"]
                    .concat(
                        tt(["A", "B", "G", "R"], 'Func'),
                        tt(["", "Node"], "Merge")
                    ),
                    'fe')
            );
        const r = 'Element';
        const dd = (p = '', ...k) => document[`create${p}`](...k);

        if (dg)
            log('__o.mknode', g);
        function mk(nn) {
            if (u(nn, 'unu')) return null;
            if (u(nn, 'str') || u(nn, 'num')) return dd('TextNode', nn);
            if (dg) log('__o.mknode_svg', nn.type, g.indexOf(nn.type));
            const { t, c, i } = parse(nn.type);
            if (dg) log('__o.mknode_p: ', 'el:', t, 'c:', c, 'i:', i);
            const e = g.indexOf(t) > -1 ?
                dd(r + 'NS', "http://www.w3.org/2000/svg", t) :
                dd(r, t),
                z = _c(e);
            if (t === 'textarea') {
                z.val(nn.props.value);
                nn.props.value = null;
            }
            if (i) nn.props.id = i;
            if (c) nn.props.class = c;
            [setProps, on].forEach(v => v(nn.props, z));
            if (nn.children)
                nn.children.map(mk).forEach(v => v ? e.appendChild(v) : 0);
            return e;
        }
        let parse = __o._pEl;
        let on = (props, z) => {
            if (!z.gt.__listen) z.gt.__listen = {};
            __o.each(props, "k", n => {
                if (isEvt(n)) {
                    if (dg) log('__o.on', n, props[n]);
                    const a = z.gt.__listen[n] = props[n];
                    z.on(n.slice(2).toLowerCase(), ...(u(a, 'obj') ? [a.f ?? a.fn, a.o ?? a.opt] : [a]));
                }            });
        };
        let isEvt = (n) => /^on/.test(n);
        //let isCustom = (n) => (isEvt(n)/*  || n === 'forceUpdate' */);
        let setProps = (pro, y) => {
            let a = Object.fromEntries(Object.entries(pro).filter(([k]) => !isEvt(k)));
            y.attr(a);
        };
        return mk(obj);
    }
    static _pEl(str) {
        // Match the tag, id, classes, and ignore attribute selectors
        const { utils: { type }/* , log */ } = __o;
        let t, c, i, o;
        //log(str);
        const m = ((type(str, 'obj')) ? str.type : str)?.match(/([.#]?[\w-]+)(?![^\[]*\])/g);
        if (m) {
            for (const h of m) {
                (h.startsWith('#')) ? i = h.slice(1) :
                    (h.startsWith('.')) ? (c = c ? `${c} ${h.slice(1)}` : h.slice(1)) :
                        t = h;
            }
            if (type(str, 'obj') && str.props) {
                c = c && str.props.class ? `${c} ${o.class}` : c;
                c = c && str.props.className ? `${c} ${o.className}` : c;
            }
            return { t: t || 'div', c, i };
        }
    }
    // @deprecating: move to static
    //mknode = __o.mknode;
    //-------
    // @deprecating: move to __o.utils.math.per[to||from](total, avail, cur) (util.js)
    //static toPer = (total, avail, cur) => (cur / (total - avail) * 100);
    //static fromPer = (total, avail, per) => ((per / 100) * (total - avail));
    // @deprecating: move to __o.utils.math(util.js)
    //toPer = __o.toPer;
    //fromPer = __o.toPer;
    //-------
    static cssvar(attr = null, val = null) {
        if (!attr) return;
        let el = _c(':root').gt.style, p = 'etProperty', f, o = __o.utils.type(attr, 'obj');
        if (o)
            __o.each(attr, 'k', (v, i) => el[`s${p}`](`--${v}`, attr[v]));
        else
            f = el[(!val) ? `g${p}Value` : `s${p}`](`--${attr}`, val);
        return (o || val != null) ? this : f;
    }
    //cssvar = __o.cssvar;
    static log = console.log.bind(console);
    constructor(_) { if (_ != null || undefined) this._(_); };
};
//=========================== 
function _c(_) { return new __o$1(_); }utils(__o$1);
vdom(__o$1);
/*VDOM_end*/

//=======================  short form  =================================
//! DO NOT use with _o or _n    
//! init a new instance of __o using __o or _c
// ===================  =========================== 
// @deprecating 
const _o = new __o$1();
function _n(_) { return _o._(_); }
// @deprecating
_o.g = _o.get; _o.l = _o.log; _o.h = _o.hide; _o.at = _o.attr; _o.fr = _o.frame;
_o.make = _o.mk;
/* =================== the End =========================== */
/* const Style = {
    base: [
        "color: #fff",
        "background-color: #444",
        "padding: 2px 4px",
        "border-radius: 2px"
    ],
    warning: [
        "color: #eee",
        "background-color: red"
    ],
    success: [
        "background-color: green"
    ]
};
export const log = (text, extra = []) => {
    let style = Style.base.join(';') + ';';
    style += extra.join(';'); // Add any additional styles
    console.log(`%c${text}`, style);
};
export const wlog = (text, extra = [], ...a) => {
    let style = Style.base.join(';') + ';';
    style += Style.warning.join(';') + ';';
    style += extra.join(';'); // Add any additional styles
    console.log(`%c${text}`, style, '\n', ...a);
}; *///use boxShadow instead of drop-shadow
/*  transform: rotate(12deg);
    transform-style: flat;
    transform-origin: center;
    transform-box: fill-box; */
/* =================== the End =========================== */window.__o=__o$1;window._c=_c;window._n=_n;window._o=_o;return exports;})({});