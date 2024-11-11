/* Record Stream 0.1.0
    ! work inprogress [not test in a while]
    * Important:
    __________
    use _o.mime() before starting default webm/vp9
    use _rMe only after knowing mime is usable
*/
class _rMe {
    recorded = [];
    opt = { mimeType: "video/webm;codecs=vp9" };
    opt1 = {audioBitsPerSecond: 128000, videoBitsPerSecond: 2500000, mimeType: 'video/mpeg'}; 
    constructor(stm, opt) {
        this.rec = new MediaRecorder(stm, this.opt);
        this.rec.ondataavailable = e => {
            if (e.data.size > 0) {
                this.recorded.push(e.data);
                this.download;
            }
            else _o.l("no data");
        }
    }
    get download() {
        var blob = new Blob(this.recorded, { type: "video/webm" });
        this.url = URL.createObjectURL(blob);
    }
    delUrl = () => window.URL.revokeObjectURL(this.url);
    start = () => this.rec.start();
    resume = () => this.rec.resume();
    stop = () => this.rec.stop();
}
window._rMe = _rMe;