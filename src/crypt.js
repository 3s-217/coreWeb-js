//* crypt 0.1.0 
class crypt {
    cs = window.crypto.subtle;
    algo = "AES-GCM";
    constructor() { }
    async import(k) {
        this.cs.importKey(
            "raw", k, this.algo, true, ["encrypt", "decrypt"]
        ).then(k => this.k = k);
    }
    async export(cb) {
        this.cs.exportKey("raw", key).then(e => {
            const st = String.fromCharCode.apply(null, new Uint8Array(e));
            const b64 = btoa(st);
            cb(b64);
        });
    }
    async encrypt(mgs, cb, i, k) {
        let enc = new TextEncoder().encode(mgs);
        let iv = new TextEncoder().encode(i);
        ctxt = await this.cs.encrypt({ name: this.algo, iv }, k, enc);
        const ui = new Uint8Array(ctxt);
        const st = String.fromCharCode.apply(null, ui);
        const b64 = btoa(st);
        cb(b64);
    }
    async decrypt(mgs, cb, i, k) {
        const str = atob(mgs);
        const ui = new Uint8Array([...str].map((char) => char.charCodeAt(0)));
        let de = await this.cs.decrypt({ name: this.algo, iv }, this.k, ui);
        let dec = new TextDecoder().decode(de);
        cb(dec);
    }
    async mk() {
        this.cs.generateKey({ name: this.algo, length: 256 }, true, ["encrypt", "decrypt"])
            .then(k => this.k = k);
    }
}
__o.prototype.crypt = crypt;
/* (() => {

    function getMessageEncoding() {
        const messageBox = `{"u":"${_c("#user").val()}","p":"${_c("#pwd").val().trim()}"}`;
        let message = messageBox;
        let enc = new TextEncoder().encode(message);
        return enc.encode(message);
    }

    async function exportCryptoKey(key) {
        const exported = await window.crypto.subtle.exportKey("raw", key);
        const exportedKeyBuffer = new Uint8Array(exported);
        _o.l(`[${exportedKeyBuffer}]`);
    }
})(); */