/**
 * Utilities
 * @namespace utils
 * @static
 * @alias __o.utils
 * @type {object}
 * @description Core utilities
 * @license MIT
 * @author 3s217
 * @version 0.13.3
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
                                    j('null') || j('nl') ? v === l :
                                        j('ud') ? v === d :
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
    const { mknode, log, _pEl: parse, utils, each } = rt;
    const len = (v) => (v?.length ?? v?.size);
    const Okl = (v) => len(Object.keys(v)) == 0;
    const tcss = (i, m) => i.split(';').forEach(c => {
        const [x, y] = c.split(':').map((s, i) => (!i ? s.replace(/-([a-z])/g, (m, l) => l.toUpperCase()) : s).trim());
        if (x && y) m.set(x, y);
    });
    //** start new 
    const _e = k => k.slice(2).toLowerCase();
    const rlt = rEl => (rEl?.__listen && !Okl(rEl?.__listen ?? {})) ? new rt(rEl).off(Object.fromEntries(Object.entries(rEl.__listen).map(([k, v]) => [_e(k), v]))) : 0;
    function __vd2(rEl, vEl, ovEl, opt = {}) {
        const { type: ty } = utils;
        const { dbg } = opt;
        let res;
        //====================================
        if (dbg && ty(vEl, "obj") && vEl.type)
            log('__vd_p', rEl, vEl.type, 'parse', parse(vEl));
        if (!rEl && ty(vEl, 'obj')) return mknode(vEl, dbg);
        if (!rEl && (ty(vEl, 'str') || ty(vEl, 'num'))) return new Text(vEl);
        //====================================
        try { res = comp2(rEl, vEl, ovEl, opt); }
        catch (e) { log(e, rEl, vEl, ovEl, opt); return null; }
        if (ty(res, "obj")) {
            if (dbg)
                log('__vd-res', res);
            /* 
            ? shortname all res keys 
            *- rm,tag,text
            *- listener only
            */
            if (res.rm || res.tag) {
                if (rEl) {
                    rlt(rEl);
                    let n;
                    res.tag ? (rEl.parentNode.replaceChild(n = mknode(vEl, dbg), rEl), rEl = n) : rEl.remove();
                }
                return null;
            }
            //! problem with text handling ?
            //if (res.txt) return rEl ? (rEl.textContent = vEl, 0) : 0;
        }
        //====================================
        //* children logic
        //====================================
        if (vEl.props?.html) return null;
        const rch = Array.from(rEl.childNodes ?? []);
        const vch = vEl.children;
        const och = ovEl ? ovEl?.children : [];
        const clen = Math.max(len(rch), len(vch));
        for (let i = 0; i < clen; i++) {
            //log('__vd_ch_' + i, rch[i], vch[i]);
            const nEl = __vd2(rch[i] ?? null, vch[i] ?? null, och[i] ?? null, opt);
            //log(nEl, rch[i], nEl === rch[i]);
            if (nEl) {
                if (!rch[i]) { rEl.append(nEl); }
                else if (!rch[i].isEqualNode(nEl)) {
                    //log('new-el-replace', rEl, nEl, i, rch[i], vch[i], och[i]);
                    rlt(rch[i]);
                    rch[i].parentNode.replaceChild(nEl, rch[i]);
                }
            }
        }
        return rEl;
    }
    function comp2(rEl, vEl, ovEl, opt = {}) {
        const { type: ty } = utils;
        const { root, force, dbg } = opt;
        if (ty(vEl, 'unu')) return { rm: !!1 };
        const rl = ty(rEl, 'inst', HTMLElement) ? 1 : ty(rEl, 'inst', Text) ? 2 : 0;
        //=================================================================================
        if ((ty(vEl, 'str') || ty(vEl, 'num'))) return (rl == 2 ? rEl.textContent !== vEl : ovEl !== vEl) ? rEl.textContent = vEl : 0;
        // todo: auto switch real and virtual element ?
        const [pvel, ovel] = [vEl, ovEl].map(v => ty(v, 'obj') ? parse(v) : 0);
        if (dbg)
            log('comp', rEl, vEl, ovEl, pvel, ovel);
        //=================================================================================
        if (ty(vEl, 'obj') && (rEl && rEl?.tagName?.toLowerCase() !== pvel.t)) return { tag: !!1 };
        //! todo:  need better debugging
        //=================================================================================
        /*
        ? shortname all res keys
        * force update 
        - attributes <-> props
        - listeners  <-> props
        ? or
        * non force update
        - vdom <-> vdom
        */
        //? list of res keys
        //* res={ txt, rm, tag};
        const r = new rt(rEl);
        if (!rEl.__listen) rEl.__listen = {};
        const ltn = rEl.__listen;
        const attr = rEl.attributes;

        //data-|aria-|
        const pt = /^([a-z]+(?:[A-Z][a-z]+)+|value|checked|disabled|readonly|style)$/;
        //===================================
        const [fevts, fattr, fprop, fcss, ecss] = Array(5).fill().map(v=>new Map());
        tcss(rEl.style.cssText, ecss);
        //====================================
        each(vEl.props, 'e', ([k, v]) => {
            if (k === 'style') v ? ((ty(v, 'str')) ? tcss(v, fcss) : each(v, 'e', x => fcss.set(...x))) : 0;
            else if (/^(class(Name)?|id|text)$/g.test(k)) ;
            else if (/^html$/g.test(k)) (v != rEl.innerHtml) ? r.nattr('html', v) : 0;
            else
                (k.startsWith('on') ? fevts : /viewBox/.test(k) ? fattr : pt.test(k) ? fprop : fattr).set(k, v);
        });
        if (pvel.i) fattr.set('id', pvel.i);
        //==
        if (dbg)
            log('comp_p', pvel, ovel),
                log('fevts', fevts, 'fprop', fprop, 'fattr', fattr, 'fcss', fcss, 'ecss', ecss),
                log('comp_el', r.gt.outerHTML);
        //===============================
        //* attr
        // 
        if (len(fattr) || len(attr)) {
            let [add, rm] = [{}, []];
            for (let [k, v] of fattr)
                if (attr[k]?.value !== v)
                    add[k] = v;
            for (let atn of attr)
                if (!/^class$/.test(atn.name) && !pt.test(atn.name) && !fattr.has(atn.name))
                    rm.push(atn.name);
            !Okl(add) ? r.nattr(add) : 0;
            len(rm) > 0 ? r.nattr(rm, 0, 'r') : 0;
        }
        //===============================
        //* class
        const rcls = new Set(r.class());
        const ncls = new Set(pvel.c ? pvel.c.split(/\s+/) : []);
        if (len(rcls) || len(ncls)) {
            let add = {};
            //log('comp_cls', r.gt.outerHTML, r.class().toString(), rcls, ncls);
            let cl = (n, i, j) => [n, [...i].filter(c => !j.has(c))];
            [['add', ncls, rcls], ['remove', rcls, ncls]].map(v => cl(...v))
                .forEach(([k, v]) => v.length ? (add[k] = v) : 0);
            if (!Okl(add))
                r.class(add);
            // log('comp_cls:end', add, r.gt.outerHTML);
        }
        //===============================
        //* style
        if (len(fcss) || len(ecss)) {
            let [add, rm] = [{}, []];
            for (let [k, v] of fcss)
                if (!ecss.has(k) || (ecss.has(k) && ecss.get(k) !== v))
                    add[k] = v;
            for (let [k, v] of ecss) if (!fcss.has(k)) rm.push(k);
            if (len(rm)) r.css(rm, 0, 'r');
            if (!Okl(add)) r.css(add);
        }
        //===============================
        //* html js api
        for (let [k, v] of fprop) rEl[k] !== v ? rEl[k] = v : 0;
        //===============================
        //* event listeners
        if (len(fevts) || !Okl(ltn)) {
            let [add, rm, chg] = Array(3).fill(Set);
            for (let [k, v] of fevts)
                if (!ltn[k]) add.add(k);
                else if (ltn[k] && ltn[k]?.toString() !== v?.toString()) chg.add(k);
            for (let k of Object.keys(ltn)) !fevts.has(k) ? rm.add(k) : 0;
            let f = _e;
            if (dbg)
                log('ltn', rEl, { add, rm, chg });
            if (len(add)) {
                let ev = {};
                each(add, k => ev[f(k)] = (rEl.__listen[k] = vEl.props[k]));
                r.on(ev);
            }
            if (len(rm)) {
                let rv = {};
                each(rm, k => rv[f(k)] = ltn[k]);
                r.off(rv);
                each(rm, k => delete rEl.__listen[k]);
            }
            if (len(chg)) {
                let rv = {}, ev = {};
                each(chg, k => (rv[f(k)] = ltn[k]));
                r.off(rv);
                each(chg, k => ev[f(k)] = (rEl.__listen[k] = vEl.props[k]));
                r.on(ev);
            }
            //fnl.ltn = { add, rm, chg };
        }
        //* end ------------>
    }
    //** end new 
    const Q = [];
    let isRendering = false;

    function qUpdate(rtEl, vEl, opt = {}) {
        Q.push({ rtEl, vEl, opt });
        if (!isRendering) {
            isRendering = true;
            rt.reqAnima(processQ);
        }
    }

    function processQ() {
        while (Q.length > 0) {
            const { rtEl, vEl, opt } = Q.shift();
            renderVDOM(rtEl, vEl, opt);
        }
        isRendering = false;
    }
    // User-facing render function
    function render(rtEl, vEl, opt = {}) {
        (opt.force ? renderVDOM : qUpdate)(rtEl, vEl, opt);
    }
    /**
     * Renders the given virtual element into the specified root element.
     * @method vdom
     * @memberof vdom
     * @param {HTMLElement|CustomElement} rtEl - The root element to render into.
     * @param {Array|Object} vEl - The virtual element to render. 
     * @param {Object} [opt={}] - Optional parameters.
     * @param {boolean} [opt.shadow] - Whether to render into the shadow root.
     * @param {boolean} [opt.debug] - Whether to include debug information in the output.
     * @param {boolean} [opt.force] - Render the vdom immediately.
     * @param {boolean} [opt.el] - Whether to return the rendered element.
     * @return {Object} - The rendered element and additional information.
     * @argument vEl need to be created using __o.mkEl
     */
    function renderVDOM(rtEl, vEl, opt = {}) {
        let el;
        let { type } = rt.utils;
        let { shadow: s, debug: dg } = opt;
        //batchUpdate(i => {
        let a = type(rtEl, 'inst', rt) ? rtEl.gt : (type(rtEl, 'inst', HTMLElement) ? rtEl : new rt(rtEl).gt), f;
        //! needs fixing for shadow handleing
        let r = type(vEl, 'arr');
        //? reworks/cleanup this for vdom handleing
        f = s ? a?.shadowRoot : r ? a : a?.firstChild;
        if (r) {
            let ch = a?.children;
            let mx = Math.max(ch?.length ?? 0, vEl?.length ?? 0);
            el = [];
            for (let i = 0; i < mx; i++) {
                const n = __vd2(ch[i] ?? null, vEl[i] ?? null, type(a._chd, 'arr') ? a._chd[i] : null, opt);
                if (n !== null && n != false) {
                    if (!type(ch[i], 'obj')) f.appendChild(n);
                    else if (!n.isEqualNode(ch[i])) f.replaceChild(n, ch[i]);
                    el.push(n);
                }
            }
            a._chd = [].concat(vEl);
        }
        else {
            el = __vd2(f, vEl, a._chd, opt);
            a._chd = {};
            Object.assign(a._chd, vEl);
            f == null && el != null ? (s ? s : a).append(el) : 0;
        }
        //});
        if (dg)
            return { el, __ovt: vEl };
        if (opt.el)
            return { el };
    }
    rt.vdom = render;
    return rt;
};

/* function evts(act, el, vl) {
    let lt = el.__listen;
    if (act == 'add') {

    }
    else if (act == 'chg') {

    }
    else if (act == 'rm') {

    } 
}*//* ================================================ */
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
        this.fdoc = !!0;
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
        let el = i ?? this.el;
        let { type: t } = __o.utils;
        if (t(el, "inst", HTMLElement) || t(el, "inst", Window) || t(el, "inst", Document)) return this.#El = el;
        else if (t(el, "obj")) { return this.#El = el; }
        else if (t(el, "str")) {
            if (el.search(/^\w+:\/\//g) > -1 && el.search(/\w+\[*\]/g) == -1)
                return;
            let doc = !this.fdoc ? document : this.fdoc, qy = 'querySelector', tEl;
            try { tEl = doc[qy](el); } catch (e) { if (e) console.error(e); }            if (tEl)
                return this.#El = tEl;
        }
    }
    /**,
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
    qyp(s, e = document) {
        let el = this.gt?.parentNode;
        const rs = () => {
            if (typeof el?.matches !== "function") return null;
            let m = el?.matches(s);
            return (!el || (el === e && !m)) ? null :
                m ? el :
                    (el = el.parentNode, rs());
        };
        const f = rs();
        this.#El = f ?? null;
        return this;
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
        !e ? this.gt.remove() : this.gt.parentNode.removeChild(e);
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
    gat = (t) => (this.gt.attributes[t]?.value);
    nattr(type, val, ex) {
        let el = this.gt, ct = el?.isConnected, a = el?.attributes, fn = el[`${/^r$/.test(ex) ? 'remove' : 'set'}Attribute`].bind(el), ty = __o.utils.type,
            prop = k => el.hasOwnProperty(k) || /^\w+[A-Z]\w+$/.test(k);
        if (ty(type, 'unu')) return a;
        let h = v => `inner${v == "html" ? 'HTML' : 'Text'}`, s = k => /^(html|text)$/.test(k);
        if (ty(type, "str")) {
            if (ex == 'r') type = [type];
            else { const f = type; type = {}, type[f] = val; }        }
        if (ty(type, "obj")) {
            __o.each(type, "e", ([k, v]) => {
                (ct && prop(k)) ? el[k] = v :
                    s(k) ? el[h(k)] = v :
                        k == "class" && ty(v, 'obj') ? this.class(v) :
                            k == "style" && ty(v, 'obj') ? this.css(v) :
                                fn(k, v);
            });
        }
        if (ty(type, "arr")) {
            if (ex == 'r') type.forEach(v => fn(v));
            else {
                let fl = {};
                return type.forEach(v =>
                    fl[v] = ct && prop(v) ? el[v] :
                        s(v) ? el[h(v)] :
                            (a[v]?.value ?? null)
                ), fl;
            }
        }
        return this;
    }
    static each(a, f, z) {
        const { utils: { type: t } } = __o, al = (t(a, "arr") || t(a, "set") || t(a, "wSet") || t(a, 'map') || t(a, 'wMap') || t(a, 'obj')),
            fu = (j) => {
                var c = (t(f, "str")) ? z : f;
                //__o.log(a, f, z, j);
                if (t(c, "fn") && al)
                    j.forEach((v, i) => c(v, i));
            };
        if (t(f, "fn")) fu(al && !a.item ? a : Array.prototype.slice.call(a));
        else if (t(f, "str"))
            fu(Object[f + (f == 'k' ? 'eys' : f == 'v' ? 'alues' : f == 'e' ? 'ntries' : 1)](a));
        return this;
    }
    each = __o.each;
    class(type, val, ...mor) {
        const { utils: { type: z } } = __o, t = type,
            f = i => /^(add|remove|toggle)$/.test(i);
        const a = this.gt.classList;
        if (z(t, 'str') && f(t)) a[t](val, ...mor);
        else if (z(t, 'obj'))
            __o.each(t, 'e', ([k, v]) => (f(k) ? a[k](...(z(v, 'arr') ? v : [v])) : 0));
        else { return a; }
        return this;
    }
    css(type = 0, val = null, ex) {
        var e = this.gt.style, t = type, i = val, ty = __o.utils.type;
        if (t == 0 && i == null)
            return e;
        else if (ty(t, "obj")) __o.each(t, "e", v => e.setProperty(...v));
        else if (ty(t, "str") && /:/g.test(t)) {
            let o = t.split(';');
            for (let d of o) {
                let b = d.indexOf(':'), a = d.substring(0, b).trim().replace(/-([a-z])/g, (m, l) => l.toUpperCase());
                e[a] = d.substring(b + 1).trim();
            }
        }
        else if (ex === "r") {
            if (ty(t, "str")) t = [t];
            if (ty(t, "arr"))
                t.forEach(v => e.removeProperty(v.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()));
        }
        else if (i === null) return e[t];
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
            j(this.gat(o) == 'false' || undefined || null ? 1 : 0);
        else {
            if (i == "b") j(1);
            else if (i == "n") j(0);
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
    on(e, f, o) { return this.#evt(1, e, f, o); }
    off(e, f, o) { return this.#evt(0, e, f, o); }
    #evt(d, e, f, o) {
        const a = `${d == 1 ? 'add' : 'remove'}EventListener`, { type: t } = __o.utils, el = this.gt;
        if (t(e, "obj"))// can be a problem but for now i have not hit it
            __o.each(e, 'e', ([k, v]) => el[a](k, ...(t(v, "obj") ? [v.f ?? v.fn, v.o ?? v.opt] : [v, f])));
        else
            el[a](e, f, o);
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
        let i, q;
        const e = 's', p = "p", z = this.el,
            f = (s, x, k) => {
                if (s === e) return JSON.stringify(x, null, k);
                else if (s === p) {
                    try { i = JSON.parse(x); } catch (e) { return null; }
                    return i;
                }
            },
            x = (k, l) => (typeof k == l),
            y = k => (x(k, 'obj')),
            w = k => (x(k, 'str'));
        q = y(t) ? f(e, t, o) :
            w(t) ? ((t == p || t == e) ? f(t, o ?? z, l ?? o) : f(p, t, o)) :
                (t == null) ? ((y(z)) ? f(e, z) : (w(z)) ? f(p, z) : null) : null;
        return (q == null) ? this : q;
    }

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
    //* move to one of the media modules/plugins i dont think it has use on a normal webpages.
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
    //* move to one of the media modules/plugins i dont think it has use on a normal webpages.
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
    //* move to one of the media modules/plugins i dont think it has use on a normal webpages.
    stop(el) {
        var a = typeof el == 'object' ? el : _c(el).src();
        a.getTracks().forEach(trk => trk.stop());
        if (typeof el == 'string') _c(el).src('');
    }
    static mkObs(el, cb, opt = null) {
        const { utils: { type: t } } = __o;
        let options = { root: null, rootMargin: "0px", threshold: [0] };
        if (t(opt, 'obj'))
            this.each(opt, 'e', ([k, v]) => (options[k] = t(v, 'func') ? v() : v));
        let obs = new IntersectionObserver(cb, options);
        t(el, 'inst', HTMLElement) ? obs.observe(el) : 0;
        return obs;
    }
    /*lite_end*/
    //-------
    static mkEl = (type, props, ...c) => ({ type, props: props || {}, children: c || [] });
    //-------
    static mknode(obj, dg) {
        const { utils: { type: u }, log, _pEl } = __o;
        const tt = (a, b) => a.map(v => b + v);
        const g = ['svg', 'path', "circle", "clipPath", "defs", "desc", "ellipse", "g",
            "image", "use", 'symbol', 'text', 'tspan', 'foreignObject', 'line', 'marker',
            'mask', 'metadata', 'pattern', 'polygon', 'polyline', 'rect',/* , 'stop', 'view' */
            ...tt(['', "path"], 'hatch'),
            ...tt(['', "Motion", "Transform"], "animate"),
            ...tt(
                [
                    "Blend", "ColorMatrix", "ComponentTransfer", "Composite", "ConvolveMatrix", "DiffuseLighting",
                    "DisplacementMap", "DistantLight", "DropShadow", "Flood", "GaussianBlur", "Image", "Morphology", "Offset", "PointLight",
                    ...tt(["A", "B", "G", "R"], 'Func'), ...tt(['', "Node"], "Merge")
                ], 'fe')
        ];
        const r = 'Element';
        const dd = (p = '', ...k) => document[`create${p}`](...k);
        function mk(nn) {
            if (u(nn, 'unu')) return null;
            if (u(nn, 'str') || u(nn, 'num')) return dd('TextNode', nn);
            if (dg) log('__o.mknode_svg', nn.type, g.indexOf(nn.type));
            const tg = _pEl(nn), { t, c, i } = tg;
            if (dg)
                log('__o.mknode_p: ', 'el:', t, 'c:', c, 'i:', i);
            const e = dd(...g.indexOf(t) > -1 ? [r + 'NS', "http://www.w3.org/2000/svg"] : [r], tg.t);
            setProps(nn.props, e, tg);
            if (nn.children)
                e.append(...nn.children.map(mk).filter(v => !!v));
            return e;
        }
        const skip = (n) => (/^(forceUpdate|children|id|class(Name|))$/.test(n));
        function setProps(props, e, tg) {
            let attr = {}, sp = {}, evts = {}, c = _c(e);
            if (!e.__listen) e.__listen = {};
            ['id', 'class'].forEach(v => tg[v[0]] ? sp[v] = tg[v[0]] : 0);
            for (const [k, v] of Object.entries(props)) {
                if (/^on/.test(k))
                    evts[k.slice(2).toLowerCase()] = e.__listen[k] = v;
                else if (tg.t == 'textarea' && k == 'value')
                    c.val(v);
                else if (skip(k)) continue;
                else attr[k] = v;
            }
            c.nattr(sp).nattr(attr).on(evts);
            return e;
        }
        return mk(obj);
    }
    static _pEl(str) {
        // Match the tag, id, classes, and ignore attribute selectors
        const { utils: { type }, log } = __o;
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
                o = str.props.class ? str.props.class : o;
                o = str.props.className ? `${o ? o + ' ' : ''}${str.props.className}` : o;
                c = c ? `${c}${o ? ' ' + o : ''}` : o;
                i = i ?? str.props.id;
            }
            return { t: t || 'div', c, i };
        }
    }
    //-------
    static cssvar(attr = null, val = null, els = ":root") {
        if (!attr) return;
        const { utils: { type: u } } = __o;
        const el = (els?.gt ?? _c(els).gt).style, p = 'etProperty', o = u(attr, 'obj'), a = u(attr, 'arr');
        let f;
        if (o)
            __o.each(attr, 'k', (v, i) => el[`s${p}`](`--${v}`, attr[v]));
        else if (a)
            f = {},
                __o.each(attr, (v, i) => f[v] = el[`g${p}Value`](`--${v}`));
        else
            f = el[(!val) ? `g${p}Value` : `s${p}`](`--${attr}`, val);
        return f ?? this;
    }
    cssvar(attr = null, val = null) {
        const f = __o.cssvar(attr, val, this);
        return (f == __o) ? this : f;
    };
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
/* =================== the End =========================== */export{__o$1 as __o,_c,_n,_o};