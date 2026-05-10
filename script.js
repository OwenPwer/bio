// =============================================
// Tab Navigation + Language Switch + Smooth Random Bio
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // ---------- TRANSLATIONS ----------
    const translations = {
        en: {
            pageTitle: "Owen Yaku Pers | Portfolio",
            metaDescription: "Information about Owen Yaku Pers",
            name: "Owen Yaku Pers",
            infoTab: "Facts",
            factsTab: "Info",
            socialTab: "Social",
            facts: [
                "<strong>General:</strong> 15 y.o, male, straight",
                "<strong>Typology:</strong> ESFJ, 3w2 sx/sp 379",
                "<strong>Birthday:</strong> 31st of May, but loves Winter"
            ],
            socialLabels: {
                twitter: "Twitter",
                discord: "Discord",
                steam: "Steam",
                telegram: "Telegram"
            },
            footer: "© 2026 Owen Yaku Pers. All Rights Reserved.",
            bioVariants: [
                "A passionate teenager who wants to become a successful entrepreneur in the future, someone who can achieve success. Or, well, get behind the wheel of a Formula 1 car.",
                "An ordinary 15-year-old boy",
                "Sometimes I like unpredictability, but for the most part I prefer clear boundaries",
                "I think that believing in astrology and zodiac compatibility and incompatibility is nonsense",
                "Most of the projects I’ve ever started, I quickly gave up on if they didn’t bring me any joy, but if someone asked me to, I wouldn’t give up until the very end"
            ]
        },
        ru: {
            pageTitle: "Owen Yaku Pers | Portfolio",
            metaDescription: "Информация об Оуэне Яку Персе",
            name: "Owen Yaku Pers",
            infoTab: "Факты",
            factsTab: "Инфо",
            socialTab: "Соцсети",
            facts: [
                "<strong>Общее:</strong> 15 лет, мальчик, натурал",
                "<strong>Типология:</strong> ESFJ, 3w2 sx/sp 379",
                "<strong>День рождения:</strong> 31 мая, но люблю больше зиму"
            ],
            socialLabels: {
                twitter: "X",
                discord: "Discord",
                steam: "Steam",
                telegram: "Telegram"
            },
            footer: "© 2026 Owen Yaku Pers. Все права защищены.",
            bioVariants: [
                "Увлеченный подросток, который хочет стать успешным предпринимателем в будущем, тем, кто сможет добиться успеха. Или, ну, сесть за руль болида Формулы-1.",
                "Обычный 15-летний парень",
                "Иногда мне нравится непредсказуемость, но по большей части я предпочитаю четкие границы",
                "Я считаю, что верить в астрологию и совместимость знаков зодиака — это фигня",
                "Большинство проектов, которые я начинал, я быстро бросал, если они не приносили мне радости, но если бы кто-то попросил меня, я бы не сдавался до самого конца"
            ]
        }
    };

    // ---------- GLOBALS ----------
    let currentLang = localStorage.getItem('lang') || 'en';
    let bioVariants = translations[currentLang].bioVariants;
    
    const tabs = document.querySelectorAll('.card__tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const DEFAULT_TAB = 'facts';
    const bioElement = document.querySelector('#info .card__text');
    const langToggle = document.getElementById('lang-toggle');

    // ---------- BIO FUNCTIONS ----------
    function changeBioWithAnimation(newText) {
        if (!bioElement) return;

        bioElement.style.transition = 'opacity 0.25s ease';
        bioElement.style.opacity = '0';

        setTimeout(() => {
            bioElement.textContent = newText;
            bioElement.style.transition = 'opacity 0.45s ease';
            bioElement.style.opacity = '1';
        }, 250);
    }

    function getRandomBio() {
        const randomIndex = Math.floor(Math.random() * bioVariants.length);
        return bioVariants[randomIndex];
    }

    // ---------- TAB LOGIC ----------
    function activateTab(tabId) {
        tabs.forEach(tab => tab.classList.remove('active'));

        const activeTab = document.querySelector(`.card__tab[data-tab="${tabId}"]`);
        if (activeTab) activeTab.classList.add('active');

        tabContents.forEach(content => content.classList.remove('active'));

        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            if (tabId === 'info' && bioElement) {
                changeBioWithAnimation(getRandomBio());
            }

            setTimeout(() => {
                targetContent.classList.add('active');
            }, 10);
        }
    }

    function initActiveTab() {
        const savedTab = localStorage.getItem('activeTab') || DEFAULT_TAB;
        activateTab(savedTab);
    }

    function setupTabListeners() {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                if (tabId) {
                    activateTab(tabId);
                    localStorage.setItem('activeTab', tabId);
                }
            });
        });
    }

    // ---------- LANGUAGE TRANSLATION ----------
    function translatePage(lang) {
        document.documentElement.lang = lang;
        const t = translations[lang];

        // page meta
        document.title = t.pageTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', t.metaDescription);

        // main texts
        const nameEl = document.querySelector('[data-i18n="name"]');
        if (nameEl) nameEl.textContent = t.name;

        const infoTabEl = document.querySelector('[data-i18n="infoTab"]');
        if (infoTabEl) infoTabEl.textContent = t.infoTab;

        const factsTabEl = document.querySelector('[data-i18n="factsTab"]');
        if (factsTabEl) factsTabEl.textContent = t.factsTab;

        const socialTabEl = document.querySelector('[data-i18n="socialTab"]');
        if (socialTabEl) socialTabEl.textContent = t.socialTab;

        // facts list
        const factsList = document.getElementById('facts-list');
        if (factsList) {
            factsList.innerHTML = t.facts.map(fact => `<li>${fact}</li>`).join('');
        }

        // social labels
        document.querySelectorAll('[data-i18n^="social."]').forEach(el => {
            const key = el.getAttribute('data-i18n'); // e.g., "social.twitter"
            const socialKey = key.split('.')[1];
            if (t.socialLabels[socialKey]) {
                el.textContent = t.socialLabels[socialKey];
            }
        });

        // footer
        const footerEl = document.querySelector('[data-i18n="footer"]');
        if (footerEl) footerEl.textContent = t.footer;

        // bio variants array
        bioVariants = t.bioVariants;

        // lang toggle button text
        if (langToggle) {
            langToggle.textContent = lang === 'en' ? 'RU' : 'EN';
            langToggle.setAttribute('aria-label', `Switch to ${lang === 'en' ? 'Russian' : 'English'}`);
        }
    }

    // ---------- LANGUAGE TOGGLE HANDLER ----------
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'ru' : 'en';
            localStorage.setItem('lang', currentLang);
            translatePage(currentLang);

            // re‑randomize bio if info tab is active
            const infoTab = document.getElementById('info');
            if (infoTab && infoTab.classList.contains('active') && bioElement) {
                changeBioWithAnimation(getRandomBio());
            }
        });
    }

    // ---------- INIT ----------
    function init() {
        // 1. Apply the stored / default language
        translatePage(currentLang);

        // 2. Restore last active tab (this will also show a random bio if Info is active)
        initActiveTab();

        // 3. Attach tab click listeners
        setupTabListeners();
    }

    init();
});