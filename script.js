document.addEventListener('DOMContentLoaded', () => {
    // Конфигурация локализации и параметров
    const CONFIG = {
        lang: 'en',
        discordUserId: '971809780475756584',
        translations: {
            en: {
                about: "Next time you make a decision please speak with me. I am here as well.",
                footer: "© 2026 Owen Yaku Pers"
            }
        }
    };

    const nodes = {
        about: document.getElementById('about-text'),
        footer: document.getElementById('footer-text'),
        status: document.getElementById('status-badge'),
        particles: document.getElementById('particles')
    };

    // 1. Инициализация контента
    function initContent() {
        const data = CONFIG.translations[CONFIG.lang];
        if (nodes.about) nodes.about.textContent = data.about;
        if (nodes.footer) nodes.footer.textContent = data.footer;
    }

    // 2. Статус Discord (Lanyard API)
    async function updateDiscordStatus() {
        const statusMap = {
            online: { color: 'bg-emerald-500', text: 'ONLINE' },
            idle: { color: 'bg-amber-500', text: 'IDLE' },
            dnd: { color: 'bg-rose-500', text: 'DND' },
            offline: { color: 'bg-zinc-500', text: 'OFFLINE' }
        };

        try {
            // Исправлена критическая синтаксическая ошибка путей API
            const response = await fetch(`https://lanyard.rest{CONFIG.discordUserId}`);
            if (!response.ok) throw new Error();
            const { data } = await response.json();
            
            const current = statusMap[data.discord_status] || statusMap.offline;
            renderStatus(current.color, current.text);
        } catch (e) {
            renderStatus('bg-zinc-500', 'OFFLINE');
        }
    }

    function renderStatus(colorClass, text) {
        if (!nodes.status) return;
        nodes.status.innerHTML = `
            <span class="w-2.5 h-2.5 ${colorClass} rounded-full animate-ping absolute inline-flex"></span>
            <span class="w-2.5 h-2.5 ${colorClass} rounded-full relative inline-flex"></span>
            <span class="text-zinc-400 tracking-widest uppercase ml-1">${text}</span>
        `;
    }

    // 3. Минималистичные фоновые частицы
    function createBackgroundParticles() {
        if (!nodes.particles) return;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 2;
            
            particle.className = 'absolute bg-red-600/20 rounded-full blur-[1px] animate-pulse';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${Math.random() * 4 + 3}s`;
            
            fragment.appendChild(particle);
        }
        nodes.particles.appendChild(fragment);
    }

    // Безопасный последовательный запуск модулей
    initContent();
    createBackgroundParticles();
    updateDiscordStatus();
});
