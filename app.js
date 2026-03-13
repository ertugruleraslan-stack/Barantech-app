// --- State & Constants ---
let currentInput = "0";
let historyText = "";
let memoryValue = 0;
let rates = { USD: null, EUR: null, GBP: null };

// --- Tab System ---
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// --- Calculator Logic ---
const display = document.getElementById('display');
const historyEl = document.getElementById('history');

function updateDisplay() {
    display.innerText = currentInput;
    historyEl.innerText = historyText;
}

function append(val) {
    if (currentInput === "0" && !isNaN(val)) {
        currentInput = val;
    } else if (currentInput === "Hata") {
        currentInput = val;
    } else {
        currentInput += val;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = "0";
    updateDisplay();
}

function allClear() {
    currentInput = "0";
    historyText = "";
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = "0";
    }
    updateDisplay();
}

// Memory Functions
function memoryClear() { memoryValue = 0; }
function memoryRecall() { currentInput = memoryValue.toString(); updateDisplay(); }
function memoryPlus() { memoryValue += parseFloat(currentInput) || 0; }
function memoryMinus() { memoryValue -= parseFloat(currentInput) || 0; }

function calculate() {
    try {
        let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        if (expression.includes('!')) {
            expression = expression.replace(/(\d+)!/g, (match, n) => {
                let f = 1; for (let i = 2; i <= n; i++) f *= i; return f;
            });
        }
        let result = eval(expression);
        historyText = currentInput + " =";
        currentInput = Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, "");
        updateDisplay();
    } catch (e) {
        currentInput = "Hata";
        updateDisplay();
    }
}

function factorial() {
    if (!currentInput.endsWith('!')) append('!');
}

// --- HVAC Logic ---
function convertFlow(type) {
    const val = parseFloat(document.getElementById('hvac_val').value);
    const res = document.getElementById('hvac_res');
    if (isNaN(val)) return;
    if (type === 'm3h_to_cfm') res.innerText = `${(val * 0.588578).toFixed(2)} CFM`;
    else res.innerText = `${(val / 0.588578).toFixed(2)} m³/h`;
}

function convertCool(type) {
    const val = parseFloat(document.getElementById('cool_val').value);
    const res = document.getElementById('cool_res');
    if (isNaN(val)) return;
    if (type === 'kw_to_btu') res.innerText = `${(val * 3412.14).toLocaleString()} BTU/h`;
    else res.innerText = `${(val / 3412.14).toFixed(3)} kW`;
}

function convertPress(type) {
    const val = parseFloat(document.getElementById('press_val').value);
    const res = document.getElementById('press_res');
    if (isNaN(val)) return;
    if (type === 'pa') res.innerText = `${val} Pa = ${(val / 100).toFixed(4)} mbar = ${(val / 6894.76).toFixed(6)} psi`;
    if (type === 'mbar') res.innerText = `${val} mbar = ${val * 100} Pa = ${(val / 68.9476).toFixed(6)} psi`;
    if (type === 'psi') res.innerText = `${val} psi = ${(val * 68.9476).toFixed(4)} mbar = ${(val * 6894.76).toFixed(1)} Pa`;
}

function calcPUE() {
    const t = parseFloat(document.getElementById('pue_total').value);
    const it = parseFloat(document.getElementById('pue_it').value);
    const res = document.getElementById('pue_res');
    if (it > 0) res.innerText = `PUE: ${(t / it).toFixed(3)}`;
}

function calcEff(type) {
    const val = parseFloat(document.getElementById('eff_val').value);
    const res = document.getElementById('eff_res');
    if (isNaN(val)) return;
    if (type === 'cop_to_eer') res.innerText = `EER: ${(val * 3.412).toFixed(2)}`;
    else res.innerText = `COP: ${(val / 3.412).toFixed(3)}`;
}

function calcSH() {
    const f = parseFloat(document.getElementById('sh_flow').value);
    const t = parseFloat(document.getElementById('sh_dt').value);
    const res = document.getElementById('sh_res_final');
    const q = (f * t * 1.21) / 3600;
    res.innerText = `Duyulur Isı: ${q.toFixed(3)} kW`;
}

function calcSHR() {
    const s = parseFloat(document.getElementById('shr_sens').value);
    const t = parseFloat(document.getElementById('shr_total').value);
    const res = document.getElementById('sh_res_final');
    if (t > 0) res.innerText = `SHR: ${(s / t).toFixed(3)} (%${((s / t) * 100).toFixed(1)})`;
}

// --- Electric Logic ---
function calcDC(type) {
    const v = parseFloat(document.getElementById('dc_v').value);
    const i = parseFloat(document.getElementById('dc_i').value);
    const p = parseFloat(document.getElementById('dc_p').value);
    const res = document.getElementById('dc_res');
    if (type === 'p') res.innerText = `P = ${(v * i).toFixed(2)} W`;
    else if (type === 'i') res.innerText = `I = ${(p / v).toFixed(3)} A`;
    else if (type === 'v') res.innerText = `V = ${(p / i).toFixed(2)} V`;
}

function calcAC(type) {
    const v = parseFloat(document.getElementById('ac_v').value);
    const i = parseFloat(document.getElementById('ac_i').value);
    const pf = parseFloat(document.getElementById('ac_pf').value) || 0.85;
    const kw = parseFloat(document.getElementById('ac_kw').value);
    const res = document.getElementById('ac_res');

    if (type === 'p1') res.innerText = `P = ${(v * i * pf / 1000).toFixed(3)} kW`;
    else if (type === 'p3') res.innerText = `P = ${(Math.sqrt(3) * v * i * pf / 1000).toFixed(3)} kW`;
    else if (type === 'i1') res.innerText = `I = ${(kw * 1000 / (v * pf)).toFixed(2)} A`;
    else if (type === 'i3') res.innerText = `I = ${(kw * 1000 / (Math.sqrt(3) * v * pf)).toFixed(2)} A`;
}

function calcLED() {
    const vin = parseFloat(document.getElementById('led_vin').value);
    const vf = parseFloat(document.getElementById('led_vf').value);
    const ma = parseFloat(document.getElementById('led_ma').value);
    const res = document.getElementById('led_res');

    if (isNaN(vin) || isNaN(vf) || isNaN(ma) || ma <= 0) {
        res.innerText = "Hatalı giriş";
        return;
    }
    const r = (vin - vf) / (ma / 1000);
    const p = (vin - vf) * (ma / 1000);
    res.innerText = `R = ${r.toFixed(1)} Ω | Güç: ${p.toFixed(3)} W`;
}

function calcRC() {
    const r = parseFloat(document.getElementById('rc_r').value);
    const c = parseFloat(document.getElementById('rc_c').value);
    const res = document.getElementById('rc_res');

    if (isNaN(r) || isNaN(c) || r <= 0 || c <= 0) {
        res.innerText = "Hatalı giriş";
        return;
    }
    const tau = r * (c / 1000000);
    const fc = 1 / (2 * Math.PI * tau);
    res.innerText = `τ = ${(tau * 1000).toFixed(3)} ms | fc = ${fc.toFixed(2)} Hz`;
}

function calcPCB() {
    const i = parseFloat(document.getElementById('pcb_i').value);
    const dt = parseFloat(document.getElementById('pcb_dt').value);
    const oz = parseFloat(document.getElementById('pcb_oz').value);
    const loc = document.getElementById('pcb_loc').value;
    const res = document.getElementById('pcb_res');

    if (isNaN(i) || isNaN(dt) || i <= 0 || dt <= 0) {
        res.innerText = "Hatalı giriş";
        return;
    }

    let k, b, c_ipc;
    if (loc === 'ext') {
        k = 0.048; b = 0.44; c_ipc = 0.725;
    } else {
        k = 0.024; b = 0.44; c_ipc = 0.725;
    }

    const area = Math.pow(i / (k * Math.pow(dt, b)), 1 / c_ipc);
    const thickness = oz * 1.378;
    const widthMils = area / thickness;
    const widthMm = widthMils * 0.0254;

    res.innerText = `Genişlik: ${widthMm.toFixed(3)} mm (${oz}oz, Δ${dt}°C)`;
}

// --- Finance Logic ---
async function fetchRates() {
    const stEl = document.getElementById('cur_update');
    stEl.innerText = "Kurlar güncelleniyor...";
    try {
        const response = await fetch('https://api.frankfurter.app/latest?from=TRY&to=USD,EUR,GBP');
        const data = await response.json();
        rates = data.rates;
        stEl.innerText = "✅ Kurlar güncel: " + new Date().toLocaleTimeString();
        updateCurrencyFromTRY();
    } catch (e) {
        stEl.innerText = "⚠ Güncelleme başarısız.";
    }
}

function updateCurrencyFromTRY() {
    const val = parseFloat(document.getElementById('try_val').value);
    if (isNaN(val) || !rates.USD) return;
    document.getElementById('res_usd').innerText = `$ ${(val * rates.USD).toFixed(4)}`;
    document.getElementById('res_eur').innerText = `€ ${(val * rates.EUR).toFixed(4)}`;
    document.getElementById('res_gbp').innerText = `£ ${(val * rates.GBP).toFixed(4)}`;
}

function updateCurrencyToTRY(type) {
    if (!rates.USD) return;

    const usdVal = parseFloat(document.getElementById('usd_val').value) || 0;
    const eurVal = parseFloat(document.getElementById('eur_val').value) || 0;
    const gbpVal = parseFloat(document.getElementById('gbp_val').value) || 0;

    // Update individual results for all three currencies simultaneously
    document.getElementById('to_try_usd').innerText = `₺ ${(usdVal / rates.USD).toFixed(2)}`;
    document.getElementById('to_try_eur').innerText = `₺ ${(eurVal / rates.EUR).toFixed(2)}`;
    document.getElementById('to_try_gbp').innerText = `₺ ${(gbpVal / rates.GBP).toFixed(2)}`;
}

// --- World Clock Logic ---
function updateWorldClocks() {
    const cities = [
        { id: 'nj', zone: 'America/New_York' },
        { id: 'london', zone: 'Europe/London' },
        { id: 'baku', zone: 'Asia/Baku' },
        { id: 'almaty', zone: 'Asia/Almaty' },
        { id: 'sydney', zone: 'Australia/Sydney' }
    ];

    const now = new Date();

    cities.forEach(city => {
        try {
            const timeStr = now.toLocaleTimeString('tr-TR', { 
                timeZone: city.zone, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: false 
            });
            const dateStr = now.toLocaleDateString('tr-TR', { 
                timeZone: city.zone,
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                weekday: 'long'
            });

            const timeEl = document.getElementById(`clock_${city.id}`);
            const dateEl = document.getElementById(`date_${city.id}`);
            
            if (timeEl) timeEl.innerText = timeStr;
            if (dateEl) dateEl.innerText = dateStr;
        } catch (e) {
            console.error(`Error updating clock for ${city.id}:`, e);
        }
    });
}

// --- Startup ---
const audio = document.getElementById('bismillahAudio');
window.onload = () => {
    fetchRates();
    updateWorldClocks();
    setInterval(updateWorldClocks, 1000); // Update every second
    
    audio.volume = 0.25;
    document.body.addEventListener('click', () => {
        if (audio.paused) audio.play();
    }, { once: true });

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js?v=5')
            .then(reg => console.log('SW Registered', reg))
            .catch(err => console.log('SW Error', err));
    }
};
