// State & Variables
let currentMode = 'mp4'; // 'mp4' atau 'mp3'
let isPremium = false;
const PREMIUM_CODE = "Glass5522";
const BUG_WA_NUMBER = "6288801883795";

// Sound Effect (Web Audio API)
function playClickSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
}

// Add Click Sound to all interactive buttons
document.querySelectorAll('button, a').forEach(elem => {
    elem.addEventListener('click', playClickSound);
});

// Realtime Clock & Date
function updateClock() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    document.getElementById('widget-day').innerText = days[now.getDay()];
    document.getElementById('widget-date').innerText = now.toLocaleDateString('id-ID');
    document.getElementById('widget-time').innerText = now.toLocaleTimeString('id-ID');
}
setInterval(updateClock, 1000);
updateClock();

// Tab Switcher (MP4 Geser Kiri / MP3 Geser Kanan)
const tabContainer = document.querySelector('.tab-container');
const tabMp4 = document.getElementById('tab-mp4');
const tabMp3 = document.getElementById('tab-mp3');

tabMp4.addEventListener('click', () => {
    currentMode = 'mp4';
    tabContainer.classList.remove('mp3-active');
    tabMp4.classList.add('active');
    tabMp3.classList.remove('active');
});

tabMp3.addEventListener('click', () => {
    currentMode = 'mp3';
    tabContainer.classList.add('mp3-active');
    tabMp3.classList.add('active');
    tabMp4.classList.remove('active');
});

// API Fetching (tikwm.com)
document.getElementById('btn-fetch').addEventListener('click', async () => {
    const url = document.getElementById('video-url').value.trim();
    if (!url) return alert('Masukkan URL TikTok terlebih dahulu!');

    const btnFetch = document.getElementById('btn-fetch');
    btnFetch.innerText = 'Memproses...';

    try {
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const result = await response.json();

        if (result.code === 0) {
            const data = result.data;
            document.getElementById('result-container').classList.remove('hidden');
            document.getElementById('res-avatar').src = data.author.avatar;
            document.getElementById('res-author').innerText = data.author.nickname;
            document.getElementById('res-nickname').innerText = `@${data.author.unique_id}`;
            document.getElementById('res-title').innerText = data.title || "Original Sound / TikTok Video";

            const downloadBtn = document.getElementById('download-link');
            if (currentMode === 'mp4') {
                downloadBtn.href = data.play; // MP4 No Watermark
                downloadBtn.innerHTML = `<i class="fa-solid fa-download"></i> Unduh Video (MP4)`;
            } else {
                downloadBtn.href = data.music; // MP3 Audio
                downloadBtn.innerHTML = `<i class="fa-solid fa-music"></i> Unduh Audio (MP3)`;
            }
        } else {
            alert('Gagal mengambil data. Pastikan link TikTok valid!');
        }
    } catch (error) {
        alert('Terjadi kesalahan koneksi ke API.');
    } finally {
        btnFetch.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Cari`;
    }
});

// Modal Settings Toggle
const modal = document.getElementById('settings-modal');
document.getElementById('open-settings').addEventListener('click', () => modal.classList.remove('hidden'));
document.getElementById('close-settings').addEventListener('click', () => modal.classList.add('hidden'));

// Profile & Name Update
document.getElementById('save-username').addEventListener('click', () => {
    const name = document.getElementById('user-name-input').value;
    alert(`Nama berhasil diubah menjadi: ${name}`);
});

// Redeem Premium Code
document.getElementById('btn-redeem').addEventListener('click', () => {
    const code = document.getElementById('premium-code-input').value.trim();
    if (code === PREMIUM_CODE) {
        isPremium = true;
        const statusElem = document.getElementById('premium-status-text');
        statusElem.innerText = 'PREMIUM UNLOCKED';
        statusElem.className = 'status-premium';
        alert('Selamat! Kode Premium Valid. Semua Fitur & FPS Terbuka!');
    } else {
        alert('Kode Premium Salah!');
    }
});

// Light/Dark Theme Switcher
document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

// Change Theme Color & Backgrounds
document.getElementById('color-picker').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--primary-color', e.target.value);
});

document.getElementById('bg-color-picker').addEventListener('input', (e) => {
    document.body.style.backgroundImage = 'none';
    document.documentElement.style.setProperty('--bg-color', e.target.value);
});

document.getElementById('bg-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            document.body.style.backgroundImage = `url('${evt.target.result}')`;
        }
        reader.readAsDataURL(file);
    }
});

// Google Search Box
document.getElementById('btn-google-search').addEventListener('click', () => {
    const query = document.getElementById('google-search-input').value;
    if (query) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
});

// WhatsApp Bug Report
document.getElementById('btn-report-bug').addEventListener('click', () => {
    const msg = encodeURIComponent("Halo Admin Scarlet.Xylena, saya ingin melaporkan kendala/bug pada website.");
    window.open(`https://wa.me/${BUG_WA_NUMBER}?text=${msg}`, '_blank');
});

// Restart Application
document.getElementById('btn-restart').addEventListener('click', () => {
    location.reload();
});

// Magnetic Buttons Effect
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});
