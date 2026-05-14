document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            name: "Owen Yaku Pers",
            subtitle: "15 y.o • ESFJ • Future Entrepreneur?",
            infoTab: "Info",
            socialTab: "Social",
            footer: "© 2026 Owen Yaku Pers. All Rights Reserved.",
            aboutText: "I’m 15. I can easily get along with almost anyone; I’m pretty warm and kind (or so everyone else tells me). But at the same time, I’m very hard on myself, I crave others’ approval, and sometimes I even put my own needs aside to help others."
        },
        ru: {
            name: "Owen Yaku Pers",
            subtitle: "15 y.o • ESFJ • Будущий бизнесмен?",
            infoTab: "Инфо",
            socialTab: "Соцсети",
            footer: "© 2026 Owen Yaku Pers. Все права защищены.",
            aboutText: "Мне 15. Я легко могу найти общий язык почти с кем угодно, я довольно открыт и добр (как мне говорят другие). Но при этом я сильно себя критикую, нуждаюсь в одобрении других, иногда даже игнорирую свои потребности ради помощи другим."
        }
    };

    let currentLang = localStorage.getItem('lang') || 'en';

    const tabs = document.querySelectorAll('.card__tab');
    const contentContainer = document.getElementById('content');
    const langToggle = document.getElementById('lang-toggle');

    function activateTab(tabId) {
        const currentHeight = contentContainer.offsetHeight;
        contentContainer.style.height = `${currentHeight}px`;

        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const target = document.getElementById(tabId);
        target.classList.add('active');

        requestAnimationFrame(() => {
            const newHeight = target.scrollHeight + 60;
            contentContainer.style.height = `${newHeight}px`;
        });

        setTimeout(() => contentContainer.style.height = 'auto', 700);
    }

    function translatePage(lang) {
        const t = translations[lang];
        document.documentElement.lang = lang;

        // Плавная смена текста в about
        const aboutTextEl = document.getElementById('about-text');
        if (aboutTextEl) {
            aboutTextEl.style.opacity = '0';
            setTimeout(() => {
                aboutTextEl.textContent = t.aboutText;
                aboutTextEl.style.opacity = '1';
            }, 220);
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.textContent = t[key];
        });

        langToggle.textContent = lang === 'en' ? 'RU' : 'EN';
    }

    function createParticles() {
        const container = document.getElementById('particles');
        for (let i = 0; i < 38; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            const size = Math.random() * 4.5 + 2.8;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}vw`;
            p.style.animationDuration = `${Math.random() * 22 + 15}s`;
            p.style.animationDelay = `-${Math.random() * 25}s`;
            container.appendChild(p);
        }
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ru' : 'en';
        localStorage.setItem('lang', currentLang);
        translatePage(currentLang);
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            activateTab(tabId);
            localStorage.setItem('activeTab', tabId);
        });
    });

    function init() {
        translatePage(currentLang);
        const savedTab = localStorage.getItem('activeTab') || 'info';
        activateTab(savedTab);
        createParticles();
    }

    init();
});