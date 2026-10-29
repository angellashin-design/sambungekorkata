// Database Kamus Kata Bahasa Indonesia Singkat & Populer
const DICTIONARY = new Set([
    "air", "angin", "api", "awan", "anak", "ayam", "anjing", "apel", "alas", "atap", "almari", "amplop", "pintu", "pisang", "padi", "pasar", "pohon", "piring", "payung", "pensil", "pagar", "perahu", "pedang",
    "buku", "batu", "bunga", "bintang", "burung", "bebek", "baju", "bola", "botol", "bantal", "bangku", "beras", "bawang",
    "cacing", "cermin", "cangkir", "celana", "cincin", "cokelat", "cumi", "candi", "catat", "cinta", "cahaya",
    "daun", "domba", "dinding", "dapur", "dadu", "daging", "danau", "darah", "dolar", "dokter", "dasi", "duri",
    "elang", "ember", "emas", "es", "ekor", "engsel", "empang", "edukasi",
    "foto", "fajar", "film", "fisika", "fakta",
    "gajah", "garpu", "gelas", "gitar", "gunung", "gula", "gigi", "gurita", "gandum", "gudang", "gantung",
    "hutan", "harimau", "hujan", "handuk", "helm", "hadiah", "hakim", "halaman", "hp", "hiu",
    "ikan", "itik", "isapan", "istana", "ijazah", "ibu", "intan", "ikat",
    "jeruk", "jagung", "jendela", "jarum", "jam", "jembatan", "jalan", "jaket", "jerapah", "jaring",
    "kucing", "kursi", "meja", "kuda", "kertas", "kasur", "kelinci", "kapal", "kereta", "kambing", "kunci", "komputer", "kain", "kamus",
    "lampu", "lemari", "layang", "laut", "lemon", "landak", "lilin", "lobster", "lalat", "langit", "lumpur",
    "mangga", "makan", "minum", "mata", "matahari", "malam", "mobil", "motor", "monyet", "melati", "musang", "mawar",
    "nasi", "nanas", "nyamuk", "naga", "nomer", "nota", "nelayan", "nuri",
    "orang", "otak", "ompos", "obat", "ombak", "obor", "olahraga",
    "payung", "piring", "pena", "pensil", "pintu", "pohon", "padi", "pisang", "pesawat", "pedang", "pantai",
    "ratu", "rumput", "rumah", "rusa", "roti", "roda", "roket", "rantai", "radio", "raja", "rambutan",
    "sapi", "sendok", "sepatu", "sepeda", "sungai", "semut", "singa", "sabun", "serigala", "seruling", "sendal", "semangka",
    "tas", "topi", "tomat", "tangan", "telinga", "tangga", "tikus", "tali", "telur", "tanah", "toko",
    "udang", "ular", "uang", "unta", "ubi", "ular", "uap", "ukiran",
    "vas", "voli", "vokal", "virus",
    "wajan", "wortel", "wayang", "wajah", "waktu", "warung", "wisata",
    "yoyo", "yaitu", "yuran", "yoghurt",
    "zebra", "zaman", "zaitun", "ziarah"
]);

// State Aplikasi
let gameMode = 'ai'; // 'ai' atau 'pvp'
let turn = 1; // 1 = Pemain 1, 2 = Pemain 2/AI
let scoreP1 = 0;
let scoreP2 = 0;
let usedWords = new Set();
let currentPrefix = "";
let timer = null;
let timeLeft = 15;
let isGameOver = false;

// Element DOM
const inputEl = document.getElementById('word-input');
const chainEl = document.getElementById('chain-container');
const errorEl = document.getElementById('error-msg');
const timerText = document.getElementById('timer-text');
const timerBox = document.getElementById('timer-box');
const prefixText = document.getElementById('required-prefix');
const prefixHint = document.getElementById('prefix-hint');
const hintText = document.getElementById('hint-text');
const scoreP1El = document.getElementById('score-p1');
const scoreP2El = document.getElementById('score-p2');
const cardP1 = document.getElementById('card-p1');
const cardP2 = document.getElementById('card-p2');
const labelP2 = document.getElementById('label-p2');

// Mode Game Switcher
function switchMode(mode) {
    gameMode = mode;
    document.getElementById('btn-mode-ai').className = mode === 'ai' 
        ? "px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white transition-all shadow-md hover:bg-indigo-500"
        : "px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 text-slate-300 transition-all hover:bg-slate-600";
    
    document.getElementById('btn-mode-pvp').className = mode === 'pvp' 
        ? "px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white transition-all shadow-md hover:bg-indigo-500"
        : "px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 text-slate-300 transition-all hover:bg-slate-600";

    labelP2.textContent = mode === 'ai' ? "AI Bot" : "Pemain 2";
    resetGame();
}

// Jalankan Timer
function startTimer() {
    clearInterval(timer);
    timeLeft = 15;
    updateTimerDisplay();

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeOut();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerText.textContent = timeLeft;
    if (timeLeft <= 5) {
        timerBox.className = "w-14 h-14 rounded-full bg-rose-950 border-4 border-rose-500 flex items-center justify-center font-extrabold text-xl mb-1 urgent-timer text-rose-400";
    } else {
        timerBox.className = "w-14 h-14 rounded-full bg-slate-900 border-4 border-indigo-500 flex items-center justify-center font-extrabold text-xl mb-1 text-white";
    }
}

// Penanganan Waktu Habis
function handleTimeOut() {
    const loser = turn === 1 ? "Pemain 1" : (gameMode === 'ai' ? "AI Bot" : "Pemain 2");
    const winner = turn === 1 ? (gameMode === 'ai' ? "AI Bot" : "Pemain 2") : "Pemain 1";
    showGameOver(`${loser} Kehabisan Waktu! ${winner} Menang! 🎉`);
}

// Submit Kata Baru
function handleWordSubmit(e) {
    e.preventDefault();
    if (isGameOver) return;

    const rawInput = inputEl.value.trim().toLowerCase();
    showError("");

    // Validasi Input Kosong
    if (!rawInput) {
        showError("Masukkan kata terlebih dahulu!");
        return;
    }

    // Validasi Alfabet
    if (!/^[a-z]+$/i.test(rawInput)) {
        showError("Hanya boleh menggunakan huruf!");
        return;
    }

    // Validasi Awalan Huruf
    if (currentPrefix && !rawInput.startsWith(currentPrefix)) {
        showError(`Kata harus diawali dengan huruf '${currentPrefix.toUpperCase()}'!`);
        return;
    }

    // Validasi Pengulangan Kata
    if (usedWords.has(rawInput)) {
        showError(`Kata '${rawInput}' sudah pernah digunakan!`);
        return;
    }

    // Eksekusi Kata Valid
    acceptWord(rawInput, turn);
    inputEl.value = "";

    if (isGameOver) return;

    // Pindah Giliran
    switchTurn();
}

function acceptWord(word, playerTurn) {
    // Hilangkan pesan selamat datang jika kata pertama
    const welcomeMsg = document.getElementById('welcome-msg');
    if (welcomeMsg) welcomeMsg.remove();

    usedWords.add(word);
    
    // Hitung Skor (Panjang Kata * 10)
    const points = word.length * 10;
    if (playerTurn === 1) scoreP1 += points;
    else scoreP2 += points;

    scoreP1El.textContent = scoreP1;
    scoreP2El.textContent = scoreP2;

    // Dapatkan awalan huruf selanjutnya (Huruf Terakhir Kata Ini)
    currentPrefix = word.slice(-1);
    prefixText.textContent = currentPrefix.toUpperCase();
    hintText.textContent = currentPrefix.toUpperCase();
    prefixHint.classList.remove('hidden');

    // Tampilkan bubble obrolan kata
    renderWordBubble(word, playerTurn);

    // Reset Timer
    startTimer();
}

function renderWordBubble(word, playerTurn) {
    const isP1 = playerTurn === 1;
    const alignClass = isP1 ? "justify-start" : "justify-end";
    const bgClass = isP1 
        ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-100 rounded-br-2xl" 
        : "bg-rose-600/30 border-rose-500/50 text-rose-100 rounded-bl-2xl";
    const pName = isP1 ? "Pemain 1" : (gameMode === 'ai' ? "AI Bot" : "Pemain 2");

    const bubbleHtml = `
        <div class="flex ${alignClass}">
            <div class="max-w-[80%] p-3.5 rounded-2xl border ${bgClass} backdrop-blur-md shadow-md">
                <div class="flex justify-between items-center gap-4 mb-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider opacity-75">${pName}</span>
                    <span class="text-[10px] bg-slate-900/60 px-1.5 py-0.5 rounded font-mono">+${word.length * 10} pt</span>
                </div>
                <p class="text-lg font-extrabold capitalize tracking-wide">
                    ${word.slice(0, -1)}<span class="text-amber-400 font-black border-b-2 border-amber-400">${word.slice(-1)}</span>
                </p>
            </div>
        </div>
    `;
    
    chainEl.insertAdjacentHTML('beforeend', bubbleHtml);
    chainEl.scrollTop = chainEl.scrollHeight;
}

function switchTurn() {
    turn = turn === 1 ? 2 : 1;

    // Highlight kartu giliran aktif
    if (turn === 1) {
        cardP1.className = "p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/80 transition-all shadow-lg shadow-indigo-500/10";
        cardP2.className = "p-3 rounded-2xl bg-slate-900/40 border border-slate-800 transition-all opacity-60";
        inputEl.disabled = false;
        inputEl.focus();
    } else {
        cardP2.className = "p-3 rounded-2xl bg-rose-950/60 border border-rose-500/80 transition-all shadow-lg shadow-rose-500/10";
        cardP1.className = "p-3 rounded-2xl bg-slate-900/40 border border-slate-800 transition-all opacity-60";

        // Jika mode AI dan giliran AI
        if (gameMode === 'ai') {
            inputEl.disabled = true;
            setTimeout(playAITurn, 1200); // Simulasi delay AI berpikir
        } else {
            inputEl.disabled = false;
            inputEl.focus();
        }
    }
}

// Logika Kecerdasan AI (Diacak)
function playAITurn() {
    if (isGameOver) return;

    // Cari opsi kata dari kamus yang sesuai awalan dan belum dipakai
    const availableWords = Array.from(DICTIONARY).filter(word => 
        word.startsWith(currentPrefix) && !usedWords.has(word)
    );

    if (availableWords.length > 0) {
        // Mengacak urutan array agar pilihan bot benar-benar bervariasi dan tidak monoton
        for (let i = availableWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableWords[i], availableWords[j]] = [availableWords[j], availableWords[i]];
        }

        // Ambil kata acak pertama dari hasil pengocokan
        const randomChoice = availableWords[0];
        acceptWord(randomChoice, 2);
        if (!isGameOver) switchTurn();
    } else {
        // AI Menyerah / Tidak Menemukan Kata
        clearInterval(timer);
        showGameOver("AI Kehabisan Kata! Kamu Menang! 🎉");
    }
}


function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.opacity = msg ? "1" : "0";
}

function showGameOver(message) {
    isGameOver = true;
    clearInterval(timer);
    inputEl.disabled = true;

    document.getElementById('winner-text').textContent = message;
    document.getElementById('modal-score-p1').textContent = scoreP1;
    document.getElementById('modal-score-p2').textContent = scoreP2;
    document.getElementById('gameover-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('gameover-modal').classList.add('hidden');
}

function resetGame() {
    clearInterval(timer);
    turn = 1;
    scoreP1 = 0;
    scoreP2 = 0;
    usedWords.clear();
    currentPrefix = "";
    isGameOver = false;

    scoreP1El.textContent = "0";
    scoreP2El.textContent = "0";
    prefixText.textContent = "-";
    prefixHint.classList.add('hidden');
    timerText.textContent = "15";
    inputEl.disabled = false;
    inputEl.value = "";
    showError("");

    cardP1.className = "p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/80 transition-all";
    cardP2.className = "p-3 rounded-2xl bg-slate-900/40 border border-slate-800 transition-all opacity-60";

    chainEl.innerHTML = `
        <div id="welcome-msg" class="text-center my-auto py-8">
            <div class="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                💡
            </div>
            <h3 class="font-bold text-slate-300 mb-1">Mulai Permainan!</h3>
            <p class="text-xs text-slate-500 max-w-xs mx-auto">Ketik kata dasar Bahasa Indonesia apa saja untuk membuka permainan.</p>
        </div>
    `;

    startTimer();
}

// Inisialisasi Pertama
startTimer();
