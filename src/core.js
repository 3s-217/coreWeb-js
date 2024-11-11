/* ================================================ */
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
class __o {
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
            try { tEl = doc[qy](el); } catch (e) { if (d) console.error(e); };
            if (tEl)
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
        var _elem = u(type, "obj") || u(type, 'inst', HTMLElement) ?
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
            this.each(type, 'k', e => f(e) ? a[e](...t(type[e], 'arr') ? type[e] : [type[e]], ...mor) : 0);
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
                };
            });
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
}
//=========================== 
function _c(_) { return new __o(_); };
//=========================== 
import utils from './util.js';
utils(__o);
/*VDOM_start*/
//=========================== 
import vdom from './vdom.js';
vdom(__o);
/*VDOM_end*/

//=======================  short form  =================================
//! DO NOT use with _o or _n    
//! init a new instance of __o using __o or _c
// ===================  =========================== 
// @deprecating 
const _o = new __o();
function _n(_) { return _o._(_); };

// @deprecating
_o.g = _o.get; _o.l = _o.log; _o.h = _o.hide; _o.at = _o.attr; _o.fr = _o.frame;
_o.make = _o.mk;
/* ========= final =========== */
export { __o, _c, _o, _n };
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
/* =================== the End =========================== */
