'use strict';//* webAudio 0.1.0 
// ! alot of unneeded code ⤋⟱
class _WA {
    wa = new (window.AudioContext || window.webkitAudioContext)();
    get dest() { return this.wa.destination; };
    mkMe(el, id = _c().ider(), s2) {
        var x = this.wa.createMediaElementSource(el);
        !s2 ? x : x.connect(s2);
        //? what the hell!!!           [?? 8/11/22]
        //? logic mmakes no sense       [?? 8/11/22]
        this.#nodes[this.#chkO('meEl')][id] = x;
        return x;
    }
    #nodes = {};
    get stat() { return this.#nodes; }
    mkSt = (id = _c().ider(), st) => (this.#nodes[this.#chkO('mStrm')][id] = this.wa.createMediaStreamSource(st));
    mkStD = () => (this.mStrmD = this.wa.createMediaStreamDestination());
    mkGn = (id = _c().ider()) => (this.#nodes[this.#chkO('gain')][id] = this.wa.createGain());
    mkAn = (id = _c().ider()) => (this.#nodes[this.#chkO('aysr')][id] = this.wa.createAnalyser());
    mkPan = (id = _c().ider()) => (this.#nodes[this.#chkO('stPan')][id] = this.wa['createStereoPanner']());
    mkDe = (b, id = _c().ider()) => (this.#nodes[this.#chkO('delay')][id] = this.wa.createDelay(b));
    mkComp = (id = _c().ider()) => (this.#nodes[this.#chkO('comp')][id] = this.wa.createDynamicsCompressor());
    mkRev = (id = _c().ider()) => (this.#nodes[this.#chkO('reverb')][id] = this.wa.createConvolver());
    mkBiF = (id = _c().ider()) => (this.#nodes[this.#chkO('eq')][id] = this.wa.createBiquadFilter());
    mkOsc = (id = _c().ider()) => (this.#nodes[this.#chkO('osc')][id] = this.wa.createOscillator());
    mkWvSh = (id = _c().ider()) => (this.#nodes[this.#chkO('wave')][id] = this.wa.createWaveShaper());
    mkChSpl = (c, id = _c().ider()) => (this.#nodes[this.#chkO('split')][id] = this.wa.createChannelSplitter(c));
    mkChMgr = (c, id = _c().ider()) => (this.#nodes[this.#chkO('merge')][id] = this.wa.createChannelMerger(c));
    cD = (a) => a.connect(this.dest);
    dcD = (a) => a.disconnect(this.dest);
    resume = () => this.wa.resume();
    #chkO(o) { if (!this.#nodes[o]) this.#nodes[o] = {}; return o; }
    /* ========================================================================== */
    analyser = this.wa.createAnalyser();
    spector = {
        size: (n) => (n ? this.analyser.fftSize = n : this.analyser.fftSize),
        data: new Uint8Array(this.analyser.fftSize),
        fdata: new Float32Array(this.analyser.fftSize),
        freq: (o) => (this.analyser.getByteFrequencyData(o ? o : this.spector.data)),
        time: (o) => (this.analyser.getByteTimeDomainData(o ? o : this.spector.data)),
        timef: (o) => (this.analyser.getFloatTimeDomainData(o ? o : this.spector.fdata))
    };
    //! logic flawed     [?? 8/11/22]
    /* ========================================================================== */
    mk3dPan(oo = {}) {
        var o = {
            nm: _c().ider(), model: 'HRTF', disModel: "inverse",
            refDis: 1, maxDis: 10000, rolloff: 5, coneInA: 360,
            conOA: 0, coneOG: 0, orX: 1, orY: 0, orZ: 0,
        };
        Object.keys(oo).forEach(v => o[v] = oo[v]);
        if (!this.h || !this.w) {
            this.h = () => (Math.floor(__o.hw().h / 2));
            this.w = () => (Math.floor(__o.hw().w / 2));
        }
        if (!this.pans) this.pans = {};
        const pans = this.wa.createPanner();
        pans.panningModel = o.model;
        pans.distanceModel = o.disModel;
        pans.refDistance = o.refDis;
        pans.maxDistance = o.maxDis;
        pans.rolloffFactor = o.rolloff;
        pans.coneInnerAngle = o.coneInA;
        pans.coneOuterAngle = o.conOA;
        pans.coneOuterGain = o.coneOG;
        if (pans.orientationX) {
            pans.orientationX.value = o.orX;
            pans.orientationY.value = o.orY;
            pans.orientationZ.value = o.orZ;
        }
        else pans.setOrientation(o.orX, o.orY, o.orZ);
        if (pans.positionX) {
            pans.positionX.value = this.w();
            pans.positionY.value = this.h();
            pans.positionZ.value = 300;
        }
        else pans.setPosition(this.w(), this.h(), 300);
        return this.pans[o.nm] = pans;
    };
    mkltr(wa = this.wa) {
        if (!this.h || !this.w) {
            this.h = () => (Math.floor(_o.wh().h / 2));
            this.w = () => (Math.floor(_o.wh().w / 2));
        }
        var w = this.w(), h = this.h();
        const listen = wa.listener;
        if (listen.forwardX) {
            listen.forwardX.value = 0;
            listen.forwardY.value = 0;
            listen.forwardZ.value = -1;
            listen.upX.value = 0;
            listen.upY.value = 1;
            listen.upZ.value = 0;
        }
        else listen.setOrientation(0, 0, -1, 0, 1, 0);
        if (listen.positionX) {
            listen.positionX.value = w;
            listen.positionY.value = h;
            listen.positionZ.value = 300;
        }
        else listen.setPosition(w, h, 300);
        return (wa == this.wa) ? (this.listen = listen) : listen;
    };
    pan3d(id, x = 0, y = 0, z = 0) {
        var fl, a;
        if (typeof id == "string") {
            fl = this.pans[id];
            a = (typeof x == "object") ? x : { x: +(this.w() + x), y: +(this.h() + y), z: +(this.listen.positionZ.value + z), };
            if (fl.positionX) {
                fl.positionX.value = a.x;
                fl.positionY.value = a.y;
                fl.positionZ.value = a.z;
            }
            else fl.setPosition(a.x, a.y, a.z);
            // return a;
        }
    }
}(() => { try { if (typeof __o != "undefined") __o.prototype._WA = _WA; } catch (e) { } })();exports._WA=_WA;