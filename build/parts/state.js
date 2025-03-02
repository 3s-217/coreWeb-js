(function(exports){'use strict';class __oState extends EventTarget {
    #s = null;
    updTimeout = null;
    lstnrs = new Map();
    static dc(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    static nested(obj, path, v, act) {
        const ps = path.split('.');
        const l = ps.pop();
        const tgt = ps.reduce((o, k) => o[k] = o[k] ?? {}, obj);
        if (act === 'set') tgt[l] = v;
        else if (act === 'rm' && tgt && tgt.hasOwnProperty(l))
            delete tgt[l];
        else return tgt[l];
    }
    #upK = new Set();
    #schUpd(k) {
        if (this.updTimeout) clearTimeout(this.updTimeout);
        this.#upK.add(k);
        this.updTimeout = setTimeout(() => { this.#flush(); }, 100); // Adjust the timeout value as needed
    }
    #flush() {
        // Update the state and emit events here
        for (const k of this.#upK) {
            let e = `update:${k}`;
            this.hasEvtLstnr(e) ?
                this.emit(e, this.get(k)) : 0;
            this.#upK.delete(k);
        }
        this.updTimeout = null;
    }
    get(n) {
        if (!this.#s) throw new Error('State is not loaded');
        const v = n === undefined ? this.#s : appState.nested(this.#s, n, null, 'get');
        return v ? appState.dc(v) : v;
    }
    set(n, d) {
        this.qset(n, d);
        this.#schUpd(n);
    }
    qset(n, d) {
        if (!this.#s) throw new Error('State is not loaded');
        if (__o.utils.type(n, 'str') && n.includes('.')) {
            appState.nested(this.#s, n, d, 'set');
        } else {
            this.#s[n] = Array.isArray(this.#s[n]) ? [...this.#s[n], ...d] : __o.utils.type(d, 'obj') ? { ...this.#s[n], ...d } : d;
        }
        // No event triggering here
    }
    rm(n) {
        if (!this.#s) throw new Error('State is not loaded');
        if (__o.utils.type(n, 'str') && n.includes('.')) {
            appState.nested(this.#s, n, null, 'rm');
        } else {
            delete this.#s[n];
        }
        this.emitSpecEvt(n, this.#s);
    }
    rs() {
        if (!this.#s) throw new Error('State is not loaded');
        this.#s = null;
        this.emit('rs', this.#s);
    }
    async ld(data) {
        if (__o.utils.type(data, 'str') && data !== "") {
            try {
                const res = await fetch(data);
                this.#s = await res.json();
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        } else if (__o.utils.type(data, 'obj')) this.#s = data;
        else throw new Error('Invalid data type. Expected a non-empty string or an object.');
    }
    on(evt, cb) {
        _c(this).on(evt, cb);
        this.#updLstnrCnt(evt, 1);
    }
    off(evt, cb) {
        _c(this).off(evt, cb);
        this.#updLstnrCnt(evt, -1);
    }
    emit(evt, data) {
        this.dispatchEvent(new CustomEvent(evt, { detail: data }));
    }
    hasEvtLstnr(evt) {
        return this.lstnrs.has(evt) && this.lstnrs.get(evt) > 0;
    }
    #updLstnrCnt(evtName, cnt) {
        if (!this.lstnrs.has(evtName)) {
            this.lstnrs.set(evtName, 0);
        }
        this.lstnrs.set(evtName, this.lstnrs.get(evtName) + cnt);
    }
}window.__oState=__oState;return exports;})({});