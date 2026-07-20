/* ============ TRANSLATIONS OBJECT ============ */
document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            about: "Next time you make a decision please speak with me. I am here as wells",
            footer: "© 2026 Owen Yaku Pers"
        }
    };

    /* ============ DOM ELEMENTS ============ */
    const els = {
        aboutText: document.getElementById('about-text'),
        footerText: document.getElementById('footer-text'),
        statusBadge: document.getElementById('status-badge'),
        magicBtn: document.getElementById('magic-btn'),
        loader: document.getElementById('loader')
    };

    /* ============ TRANSLATION FUNCTION ============ */
    function translatePage() {
        const t = translations.en;
        els.aboutText.textContent = t.about;
        els.footerText.textContent = t.footer;
    }

    /* ============ MAGIC BUTTON EFFECT ============ */
    function makeMagic() {
        const colors = ['#E10600', '#F7D31D', '#FFCC80'];
        for (let i = 0; i < 70; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.style.position = 'fixed';
                p.style.zIndex = '100';
                p.style.left = Math.random() * 100 + 'vw';
                p.style.bottom = '-40px';
                p.style.width = Math.random() * 8 + 5 + 'px';
                p.style.height = p.style.width;
                p.style.background = colors[Math.floor(Math.random() * colors.length)];
                p.style.borderRadius = '50%';
                p.style.boxShadow = `0 0 18px ${p.style.background}`;
                p.style.opacity = '0.85';
                document.body.appendChild(p);

                let velocity = 11 + Math.random() * 9;
                const animate = () => {
                    p.style.bottom = (parseFloat(p.style.bottom) + velocity) + 'px';
                    velocity -= 0.32;
                    if (velocity > 0) requestAnimationFrame(animate);
                    else p.remove();
                };
                animate();
            }, i * 4.5);
        }
    }

    /* ============ FETCH DISCORD STATUS ============ */
    async function fetchDiscordStatus() {
        try {
            const res = await fetch('https://api.lanyard.rest/v1/users/971809780475756584');
            const { data } = await res.json();
            let color = 'bg-gray-500', text = 'OFFLINE';
            if (data.discord_status === 'online') { color = 'bg-emerald-500'; text = 'ONLINE'; }
            else if (data.discord_status === 'idle') { color = 'bg-yellow-500'; text = 'IDLE'; }
            else if (data.discord_status === 'dnd') { color = 'bg-red-500'; text = 'DND'; }

            els.statusBadge.innerHTML = `
                <div class="w-3 h-3 ${color} rounded-full animate-pulse"></div>
                <span class="uppercase tracking-widest text-xs">${text}</span>
            `;
        } catch (e) {
            els.statusBadge.innerHTML = `<div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div><span class="uppercase tracking-widest text-xs">ONLINE</span>`;
        }
    }

    /* ============ CREATE FLOATING PARTICLES ============ */
    function createParticles() {
        const container = document.getElementById('particles');
        for (let i = 0; i < 55; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 5 + 2.5;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}vw`;
            p.style.animation = `floatParticle ${Math.random() * 26 + 17}s linear infinite`;
            p.style.animationDelay = `-${Math.random() * 28}s`;
            container.appendChild(p);
        }
    }

    /* ============ HIDE LOADER ============ */
    function hideLoader() {
        els.loader.style.opacity = '0';
        setTimeout(() => els.loader.style.display = 'none', 900);
    }

    /* ============ INITIALIZATION & EVENT LISTENERS ============ */
    translatePage();
    createParticles();
    fetchDiscordStatus();
    hideLoader();

    els.magicBtn.addEventListener('click', makeMagic);

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes floatParticle {
            0% { transform: translateY(110vh) scale(0.6); }
            100% { transform: translateY(-90px) scale(1.4); }
        }
    `;
    document.head.appendChild(style);
});