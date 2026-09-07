(function () {
    "use strict";

    const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

    // Only pages that did not already have EasyTools' original 5-second ad flow.
    const actionSelectors = {
        "image-cropper.html": ["#cropBtn"],
        "jpg-to-pdf.html": ["#generateBtn"],
        "gst-calculator.html": ["#calculateBtn"],
        "invoice-generator.html": ["#printBtn"],
        "word-counter.html": ["#countBtn"],
        "case-converter.html": ["#upperBtn", "#lowerBtn", "#titleBtn", "#sentenceBtn", "#capitalizeBtn", "#toggleBtn"],
        "percentage-calculator.html": ["#percentOfBtn", "#whatPercentBtn", "#changeBtn"],
        "age-calculator.html": ["#calculateBtn"],
        "emi-calculator.html": ["#calculateBtn"],
        "password-generator.html": ["#generateBtn"],
        "unit-converter.html": ["#convertBtn"]
    };

    const selectors = actionSelectors[page];
    if (!selectors || !selectors.length) return;

    const style = document.createElement("style");
    style.textContent = `
        .et-ad-modal{display:none;position:fixed;inset:0;background:rgba(15,23,42,.72);z-index:99999;align-items:center;justify-content:center;padding:20px}
        .et-ad-box{width:100%;max-width:520px;background:#fff;border-radius:18px;padding:25px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.22)}
        .et-ad-label{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:12px}
        .et-ad-placeholder{min-height:180px;border:1px dashed #cbd5e1;border-radius:12px;background:#f8fafc;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-weight:700;margin-bottom:16px;padding:18px}
        .et-ad-countdown{font-size:14px;color:#475569;line-height:1.6}
        .et-ad-countdown strong{color:#2563eb;font-size:18px}
    `;
    document.head.appendChild(style);

    const modal = document.createElement("div");
    modal.className = "et-ad-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Advertisement wait screen");
    modal.innerHTML = `
        <div class="et-ad-box">
            <div class="et-ad-label">Advertisement</div>
            <div class="et-ad-placeholder">ADVERTISEMENT</div>
            <div class="et-ad-countdown">Your tool will continue in <strong id="etAdCountdown">5</strong> seconds...</div>
        </div>`;
    document.body.appendChild(modal);

    const countdown = modal.querySelector("#etAdCountdown");
    const replayOnce = new WeakSet();
    let running = false;

    function continueAction(button) {
        replayOnce.add(button);
        button.click();
    }

    function showWaitThenContinue(button) {
        if (running) return;
        running = true;
        modal.style.display = "flex";
        let seconds = 5;
        countdown.textContent = seconds;

        const timer = setInterval(function () {
            seconds -= 1;
            countdown.textContent = Math.max(seconds, 0);
            if (seconds <= 0) {
                clearInterval(timer);
                modal.style.display = "none";
                running = false;
                continueAction(button);
            }
        }, 1000);
    }

    selectors.forEach(function (selector) {
        const button = document.querySelector(selector);
        if (!button) return;

        button.addEventListener("click", function (event) {
            if (replayOnce.has(button)) {
                replayOnce.delete(button);
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();
            showWaitThenContinue(button);
        }, true);
    });
})();
