/* eslint-env browser */
/* eslint-disable */ //TODO: only here because missing invokeApplixirVideoUnit(options); import
import { Observable, Event } from "../utils/Observable.js";
import Modal from "../view/utilViews/Modal.js";

var self;

class AdController extends Observable {

    constructor(buttonClass) {
        super();
        this.adBlur = document.querySelector(".ad-background-blur");
        self = this;
        this.enabled = true;

        function adStatusCallback(status) { // Status Callback Method
            let ev;
            console.log(status);
            if (status === "ad-started" || status === "fb-started") {
                self.adBlur.classList.remove("hidden");
            } else {
                self.adBlur.classList.add("hidden");
            }
            if (status === "ad-rewarded" || status === "ad-watched" || status === "fb-watched" || status ===
                "network-error") { //|| status === "ads-unavailable"
                ev = new Event("ad-status", "ad-successfull");
            } else if (status === "ad-interrupted" || status === "ad-blocker") {
                let modal = new Modal("Ad reward error",
                        "Please watch the whole ad and deactivate your ad-blocker", "", ""),
                    appearanceTime = 4500;
                modal.hideActionBtn();
                setTimeout(() => {
                    modal.remove();
                    self.notifyAll(new Event("ad-error-modal-hidden", status));
                }, appearanceTime);
                ev = new Event("ad-status", "ad-error");
            }
            if (ev) {
                self.notifyAll(ev);
            }
        }

        const options = { // Video Ad Options
            zoneId: 5077, // Required field for RMS
            accountId: 6773, // Required field for RMS                                                                               
            gameId: 7249, // Required field for RMS
            adStatusCb: adStatusCallback,
            endMsg: 1,
            btnDelay: 31,
            fallback: 1,
        };

        let playBtn = document.querySelector(buttonClass);
        playBtn.onclick = function() {
            if (self.enabled) {
                invokeApplixirVideoUnit(options); // Invoke Video ad
            }
        };

    }

    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }
}

export default AdController;