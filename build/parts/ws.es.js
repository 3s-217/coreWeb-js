//* version 0.1.0
var dl = o => ((location.protocol == "http:" ? `w` : `ws`) + `s://${o}`);
var st = (...a) => (new WebSocket(...a));
class _ws {
    constructor(o = {}) {
        var t = i => /^\w+:\/\//.test(i);
        this.lk = (typeof o == 'object' && o.li) ?
            (t(o.li) ? o.li : (o.p == '' || !o.p) ? dl(o.li) : `${o.p}://${o.li}`) :
            (typeof o == 'string') ? (t(o) ? o : dl(o)) : 0;
        if (this.lk)
            this._w = st(this.lk, o?.ex);
    }
    on(t, cb) { return this.__tev(t, cb, 1); }
    off(t, cb) { return this.__tev(t, cb); }
    __tev(t, f, e) {
        var u = (r) => r.test(t),
            l = u(/op(e|)n/i) ? 'open' :
                u(/cl(ose|)/i) ? 'close' :
                    u(/m(essage|(s|)g(|s))/i) ? 'message' :
                        u(/err(or|)/i) ? 'error' : 0;
        if (l) _c(this._w)['o' + (e ? 'n' : 'ff')](l, f);
        return this;
    }
    get state() { return this._w.readyState; }
    send = (...a) => this._w.send(...a);
    close = () => this._w.close();
}export{_ws};