/**
 * @namespace vdom
 */
export default async (rt) => {
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


    function compV(ovEl, nvEl, evts) {
        if (nvEl === undefined || nvEl === null) return { remove: true };
        if (typeof nvEl === 'string') return ovEl === nvEl;
        const povEl = parse(ovEl);
        const pnvEl = parse(nvEl);
        if (povEl.t !== pnvEl.t) return { tagName: true };
        let added = {};
        let removed = {};
        let changed = {};
        let listen = {};
        const t = v => (Object.keys(v).length > 0);
        const r = v => (Object.entries(v));
        //? need to add class and id tests
        for (const [key, value] of r(ovEl.props ?? {})) {
            if (key.startsWith('on')) {
                if (nvEl.props[key] && value && nvEl.props[key]?.toString() !== value?.toString())
                    listen[key] = value;
                else if (!pnvEl.props[key] && value) listen[key] = null;
                continue;
            }
            let k = nvEl.props[key];
            if ((k == undefined) && value) removed[key] = null;
            else if (k != undefined && k != value && value != undefined) changed[key] = value;
        }
        for (const [key, value] of r(pnvEl.props ?? {})) {
            if (key.startsWith('on')) {
                if ((!povEl.props[key] || povEl.props.toString() !== value?.toString()) && value)
                    listen[key] = value;
                continue;
            }
            let k = povEl.props[key];
            if (k == undefined && value != undefined) added[key] = value;
            else if (k !== value) changed[key] = value;
        }
        if (t(removed) || t(changed) || t(added) || t(listen)) {
            return { added, removed, changed, listen };
        }
        return null;
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
                        } else if (/force(U|u)padate/i.test(key)) { }
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
                    };
                }
                for (const key of y(vEl.props)) {
                    if (!key || !key.startsWith('on')) continue;
                    let v = rEl.__listen[key] = vEl.props[key], k = key.slice(2);;
                    if (__o.utils.type(v, 'obj'))
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
                            };
                        }
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
};