/**
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
export default async (rt) => {
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
                        j(i) ? h(v, i) :
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
};