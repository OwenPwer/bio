document.addEventListener('DOMContentLoaded', () => {
    
    // Элементы интерфейса
    const preloader = document.getElementById('site-preloader');
    const botOverlay = document.getElementById('bot-challenge');
    const mainContent = document.getElementById('main-content');
    const cfCheckbox = document.getElementById('cf-checkbox');
    const cfText = document.getElementById('cf-text');

    // ==========================================================================
    // СТАДИЯ 1: КАСТОМНЫЙ ПРЕЛОАДЕР НА СТАРТЕ
    // ==========================================================================
    setTimeout(() => {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                // Прелоадер ушёл, Cloudflare уже активен на экране
            }, 500);
        }
    }, 1200);

    // ==========================================================================
    // СТАДИЯ 2: АВТО-ОБРАБОТКА CLOUDFLARE КАПЧИ
    // ==========================================================================
    setTimeout(() => {
        if (cfCheckbox && cfText && botOverlay && mainContent) {
            cfCheckbox.classList.add('success');
            cfText.textContent = 'Success!';
            cfText.style.color = '#10b981';

            setTimeout(() => {
                // ИСПРАВЛЕНО: Добавляем класс скрытия, прописанный в CSS
                botOverlay.classList.add('fade-out-cf');
                mainContent.classList.remove('hidden');
            }, 600);
        }
    }, 3200); // 1200мс прелоадер + 2000мс имитация верификации Turnstile

    // ==========================================================================
    // СТАДИЯ 3: СИСТЕМА ДИНАМИЧЕСКИХ ВКЛАДОК С ПЛАВНЫМ ПЕРЕХОДОМ
    // ==========================================================================
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const currentActiveTrigger = document.querySelector('.tab-trigger.active');
            if (currentActiveTrigger === trigger) return;

            currentActiveTrigger.classList.remove('active');
            trigger.classList.add('active');

            const targetTab = trigger.getAttribute('data-tab');
            const targetPane = document.getElementById(`tab-${targetTab}`);
            const activePane = document.querySelector('.tab-pane.active');

            if (activePane) {
                activePane.style.opacity = '0';
                activePane.style.transform = 'translateY(5px)';
                
                setTimeout(() => {
                    activePane.classList.remove('active');
                    
                    if (targetPane) {
                        targetPane.classList.add('active');
                        targetPane.offsetHeight; // Reflow
                        targetPane.style.opacity = '1';
                        targetPane.style.transform = 'translateY(0)';
                    }
                }, 200);
            }
        });
    });

    // ==========================================================================
    // СТАДИЯ 4: НАПРАВЛЕННЫЙ ЗАДНИЙ ФОН СОЗВЕЗДИЙ С ПРОДВИНУТЫМ ЭФФЕКТОМ ГЛУБИНЫ
    // ==========================================================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class ConstellationParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.4;
            this.speedX = (Math.random() * 0.14 - 0.07) * (this.size * 0.8);
            this.speedY = (Math.random() * 0.14 - 0.07) * (this.size * 0.8);
            this.alpha = Math.random() * 0.25 + 0.05;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = `rgba(245, 158, 11, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initConstellations() {
        particles = [];
        if (!canvas) return;
        const count = Math.min(75, Math.floor((canvas.width * canvas.height) / 16000));
        for (let i = 0; i < count; i++) particles.push(new ConstellationParticle());
    }
    initConstellations();

    function drawLines() {
        const maxDistance = 125;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                if (particles[i].size < 0.8 || particles[j].size < 0.8) continue;

                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    const alpha = (1 - dist / maxDistance) * 0.07;
                    ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateConstellations() {
        if (!canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animateConstellations);
    }
    animateConstellations();

    // ==========================================================================
    // СТАДИЯ 5: ИНТЕРАКТИВНЫЙ КЛИК-ЭФФЕКТ С ВЫЛЕТАЮЩИМИ ИСКРАМИ
    // ==========================================================================
    window.addEventListener('click', (e) => {
        for (let i = 0; i < 5; i++) createSpark(e.clientX, e.clientY);
    });

    function createSpark(x, y) {
        const spark = document.createElement('div');
        spark.className = 'click-spark';
        document.body.appendChild(spark);

        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;

        const destX = (Math.random() - 0.5) * 75;
        const destY = (Math.random() - 0.5) * 75 + 20;

        spark.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
        ], {
            duration: Math.random() * 400 + 400,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
        }).onfinish = () => spark.remove();
    }

    const style = document.createElement('style');
    style.textContent = `.click-spark { position: fixed; width: 4px; height: 4px; background: var(--accent); box-shadow: 0 0 6px var(--accent); border-radius: 50%; pointer-events: none; z-index: 99999; }`;
    document.head.appendChild(style);

    // ==========================================================================
    // СТАДИЯ 6: ИНТЕГРАЦИЯ DISCORD СТАТУСА (ИСПРАВЛЕНО И ГОТОВО К РАБОТЕ)
    // ==========================================================================
    const statusBadge = document.getElementById('status-badge');
    const DISCORD_CONFIG = { discordUserId: '971809780475756584' };

    async function fetchDiscordStatus() {
        if (!statusBadge) return;
        const statusMap = {
            online: { color: 'online', text: 'ONLINE' },
            idle: { color: 'idle', text: 'IDLE' },
            dnd: { color: 'dnd', text: 'DND' },
            offline: { color: 'offline', text: 'OFFLINE' }
        };
        try {
            // ИСПРАВЛЕНО: Добавлен слэш, знак $ и закрыты все скобки метода fetch
            const res = await fetch(`https://lanyard.rest{DISCORD_CONFIG.discordUserId}`);
            if (!res.ok) throw new Error();
            const { data } = await res.json();
            const current = statusMap[data.discord_status] || statusMap.offline;
            statusBadge.innerHTML = `<span class="status-dot ${current.color}"></span><span class="status-text">${current.text}</span>`;
        } catch (e) {
            statusBadge.innerHTML = `<span class="status-dot offline"></span><span class="status-text">OFFLINE</span>`;
        }
    }
    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, 30000);
});