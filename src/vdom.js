/**
 * @namespace vdom
 */
export default async (rt) => {
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
        let f = k => k.slice(2).toLowerCase();
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
    };

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
            else if (/^(class(Name)?|id|text)$/g.test(k)) { }
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
}*/