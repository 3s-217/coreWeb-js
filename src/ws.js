var dl = o => ((location.protocol == "http:" ? `w` : `ws`) + `s://${o}`);
var st = (...a) => (new WebSocket(...a));
/**
 * @exports {class} _ws
 * @version 0.1.0
 * @requires core.js (0.9.0)
 * @description Websocket wrapper.
 * @license MIT
 */
/**
 * @class _ws
 * @description Websocket wrapper.
 * @constructor
 * @param {object|string} o - url or object{li, p, ex}.
 * @param {object} o.li - The link.
 * @param {object} o.p - The protocol.
 * @param {object} o.ex - The extra options.
 * @example 
 * _ws("example.com"|"ws://example.com")
 * @example 
 * _ws({li: "example.com"|"ws://example.com"})
 * @example 
 * _ws({li: "example.com", p: "ws",ex: {}})
 */

export class _ws {
    constructor(o = {} || "") {
        var t = i => /^\w+:\/\//.test(i);
        this.lk = (typeof o == 'object' && o.li) ?
            (t(o.li) ? o.li : (o.p == '' || !o.p) ? dl(o.li) : `${o.p}://${o.li}`) :
            (typeof o == 'string') ? (t(o) ? o : dl(o)) : 0;
        if (this.lk)
            this._w = st(this.lk, o?.ex);
    }
    /**
     * @method on
     * @memberof _ws
     * @instance
     * @description Method to register an event listener.
     * @param {string} t - The event type.
     * @param {function} cb - The callback function.
     * @return {this}
     */
    on(t, cb) { return this.#tev(t, cb, 1); }
    /**
     * @method off
     * @memberof _ws
     * @instance
     * @description Method to unregister an event listener.
     * @param {string} t - The event type.
     * @param {function} cb - The callback function.
     * @return {this}
     */
    off(t, cb) { return this.#tev(t, cb); }
    #tev(t, f, e) {
        var u = (r) => r.test(t),
            l = u(/op(e|)n/i) ? 'open' :
                u(/cl(ose|)/i) ? 'close' :
                    u(/m(essage|(s|)g(|s))/i) ? 'message' :
                        u(/err(or|)/i) ? 'error' : 0;
        if (l) _c(this._w)['o' + (e ? 'n' : 'ff')](l, f);
        return this;
    }
    /**
     * @method state
     * @memberof _ws
     * @instance
     * @description Method to get the current state of the WebSocket connection.
     * @return {number} The state code.
     */
    get state() { return this._w.readyState; }
    /**
     * @method send
     * @memberof _ws
     * @instance
     * @description Method to send data to the WebSocket server.
     * @param {string} d - The data to send.
     * @return {undefined}
     */
    send(d) { return this._w.send(d); }
    /**
     * @method close
     * @memberof _ws
     * @instance
     * @description Method to close the WebSocket connection.
     * @return {undefined}
     */
    close() { return this._w.close(); }
}
//❔✔️❌⏳🔍🖊️🎥📷📹✏️⚙️🔐⏰🌏