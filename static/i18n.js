// ========================================
// GESTION DE LA LANGUE (i18n)
// FR / EN / DE / ZH / ES
// ========================================

const I18N = {
    fr: {
        // Navbar
        nav_home: 'Accueil',
        nav_search: 'Rechercher',
        nav_features: 'Fonctionnalites',
        nav_start: 'Commencer',
        nav_back: 'Retour',
        // Hero
        hero_badge: '3 boutiques comparees',
        hero_title_a: 'Comparez les prix',
        hero_title_b: 'des jeux video',
        hero_text: 'GameFinder scanne automatiquement plusieurs boutiques pour vous trouver le meilleur prix, livraison incluse.',
        hero_cta: 'Commencer la recherche',
        hero_more: 'En savoir plus',
        hero_stat_games: 'Jeux compares',
        hero_stat_stores: 'Boutiques',
        hero_stat_rating: 'Note moyenne',
        hero_panel_search: 'Rechercher un jeu...',
        // Showcase
        badge_popular: 'Populaires',
        showcase_title: 'Jeux a la une',
        showcase_sub: 'Les jeux les plus recherches du moment',
        // Categories
        cat_action: 'Action',
        cat_adventure: 'Aventure',
        cat_plateforme: 'Plateforme',
        cat_horreur: 'Horreur',
        cat_rpg: 'RPG',
        cat_sport: 'Sport',
        // Features
        badge_features: 'Fonctionnalites',
        features_title: 'Comment ca fonctionne ?',
        features_sub: 'En 3 etapes, trouvez le meilleur prix au meilleur endroit',
        step1_title: 'Recherchez',
        step1_desc: 'Saisissez le nom du jeu que vous voulez trouver.',
        step2_title: 'Comparez',
        step2_desc: 'GameFinder scanne plusieurs boutiques automatiquement.',
        step3_title: 'Economisez',
        step3_desc: "Choisissez l'offre la plus avantageuse en un clic.",
        features_cta: 'Comparer les prix',
        // Footer
        footer_tagline: 'Le comparateur de prix intelligent',
        // Search page
        search_title: 'Comparer les prix',
        search_sub: 'Trouvez le meilleur prix en quelques secondes',
        search_placeholder: 'Ex: Grand Theft Auto, Mario...',
        search_btn: 'Rechercher',
        search_popular: 'Populaires :',
        cat_available_title: 'Jeux disponibles',
        cat_available_sub: 'Selectionnez un jeu pour comparer les prix',
        cat_search_placeholder: 'Filtrer...',
        cat_side_title: 'Jeux',
        cat_side_footer_label: 'Catalogue',
        cat_games: 'jeux',
        cat_stores: 'boutiques',
        voir_plus: 'Voir plus',
        loading: 'Recherche en cours...',
        results_for: 'Resultats pour',
        offers_found: 'offres trouvees',
        sort_price: 'Trier par prix',
        all_games: 'Tous les jeux',
        best_offer: 'Meilleure offre',
        best: 'Meilleur',
        price: 'Prix',
        delivery: 'Livraison',
        result_banner_label: 'Jeu recherche',
        no_results_title: 'Aucun jeu trouve',
        no_results_sub: 'Essayez avec un autre nom',
        search_error: 'Erreur lors de la recherche'
    },
    en: {
        nav_home: 'Home',
        nav_search: 'Search',
        nav_features: 'Features',
        nav_start: 'Get started',
        nav_back: 'Back',
        hero_badge: '3 stores compared',
        hero_title_a: 'Compare the prices',
        hero_title_b: 'of video games',
        hero_text: 'GameFinder automatically scans several stores to find you the best price, shipping included.',
        hero_cta: 'Start searching',
        hero_more: 'Learn more',
        hero_stat_games: 'Games compared',
        hero_stat_stores: 'Stores',
        hero_stat_rating: 'Average rating',
        hero_panel_search: 'Search for a game...',
        badge_popular: 'Popular',
        showcase_title: 'Featured games',
        showcase_sub: 'The most searched games right now',
        cat_action: 'Action',
        cat_adventure: 'Adventure',
        cat_plateforme: 'Platform',
        cat_horreur: 'Horror',
        cat_rpg: 'RPG',
        cat_sport: 'Sports',
        badge_features: 'Features',
        features_title: 'How does it work?',
        features_sub: 'In 3 steps, find the best price in the best place',
        step1_title: 'Search',
        step1_desc: 'Enter the name of the game you want to find.',
        step2_title: 'Compare',
        step2_desc: 'GameFinder scans several stores automatically.',
        step3_title: 'Save',
        step3_desc: 'Choose the most advantageous offer in one click.',
        features_cta: 'Compare prices',
        footer_tagline: 'The smart price comparison tool',
        search_title: 'Compare prices',
        search_sub: 'Find the best price in seconds',
        search_placeholder: 'e.g. Grand Theft Auto, Mario...',
        search_btn: 'Search',
        search_popular: 'Popular:',
        cat_available_title: 'Available games',
        cat_available_sub: 'Select a game to compare prices',
        cat_search_placeholder: 'Filter...',
        cat_side_title: 'Games',
        cat_side_footer_label: 'Catalogue',
        cat_games: 'games',
        cat_stores: 'stores',
        voir_plus: 'See more',
        loading: 'Searching...',
        results_for: 'Results for',
        offers_found: 'offers found',
        sort_price: 'Sort by price',
        all_games: 'All games',
        best_offer: 'Best offer',
        best: 'Best',
        price: 'Price',
        delivery: 'Delivery',
        result_banner_label: 'Searched game',
        no_results_title: 'No game found',
        no_results_sub: 'Try with another name',
        search_error: 'Error during search'
    },
    de: {
        nav_home: 'Startseite',
        nav_search: 'Suchen',
        nav_features: 'Funktionen',
        nav_start: 'Loslegen',
        nav_back: 'Zurueck',
        hero_badge: '3 Shops verglichen',
        hero_title_a: 'Preise vergleichen',
        hero_title_b: 'von Videospielen',
        hero_text: 'GameFinder durchsucht automatisch mehrere Shops, um Ihnen den besten Preis inklusive Versand zu finden.',
        hero_cta: 'Suche starten',
        hero_more: 'Mehr erfahren',
        hero_stat_games: 'Verglichene Spiele',
        hero_stat_stores: 'Shops',
        hero_stat_rating: 'Durchschnittsbewertung',
        hero_panel_search: 'Spiel suchen...',
        badge_popular: 'Beliebt',
        showcase_title: 'Ausgewaehlte Spiele',
        showcase_sub: 'Die am meisten gesuchten Spiele im Moment',
        cat_action: 'Action',
        cat_adventure: 'Abenteuer',
        cat_plateforme: 'Plattform',
        cat_horreur: 'Horror',
        cat_rpg: 'RPG',
        cat_sport: 'Sport',
        badge_features: 'Funktionen',
        features_title: 'Wie funktioniert es?',
        features_sub: 'In 3 Schritten den besten Preis am besten Ort finden',
        step1_title: 'Suchen',
        step1_desc: 'Geben Sie den Namen des Spiels ein, das Sie finden moechten.',
        step2_title: 'Vergleichen',
        step2_desc: 'GameFinder durchsucht automatisch mehrere Shops.',
        step3_title: 'Sparen',
        step3_desc: 'Waehlen Sie das beste Angebot mit einem Klick.',
        features_cta: 'Preise vergleichen',
        footer_tagline: 'Das intelligente Preisvergleichs-Tool',
        search_title: 'Preise vergleichen',
        search_sub: 'Finden Sie in Sekunden den besten Preis',
        search_placeholder: 'z.B. Grand Theft Auto, Mario...',
        search_btn: 'Suchen',
        search_popular: 'Beliebt:',
        cat_available_title: 'Verfuegbare Spiele',
        cat_available_sub: 'Waehlen Sie ein Spiel zum Preisvergleich',
        cat_search_placeholder: 'Filtern...',
        cat_side_title: 'Spiele',
        cat_side_footer_label: 'Katalog',
        cat_games: 'Spiele',
        cat_stores: 'Shops',
        voir_plus: 'Mehr anzeigen',
        loading: 'Suche laeuft...',
        results_for: 'Ergebnisse fuer',
        offers_found: 'Angebote gefunden',
        sort_price: 'Nach Preis sortieren',
        all_games: 'Alle Spiele',
        best_offer: 'Bestes Angebot',
        best: 'Am besten',
        price: 'Preis',
        delivery: 'Lieferung',
        result_banner_label: 'Gesuchtes Spiel',
        no_results_title: 'Kein Spiel gefunden',
        no_results_sub: 'Versuchen Sie einen anderen Namen',
        search_error: 'Fehler bei der Suche'
    },
    zh: {
        nav_home: '首页',
        nav_search: '搜索',
        nav_features: '功能',
        nav_start: '开始',
        nav_back: '返回',
        hero_badge: '比较了 3 家商店',
        hero_title_a: '比较价格',
        hero_title_b: '电子游戏',
        hero_text: 'GameFinder 自动扫描多家商店，为您找到含运费在内的最优价格。',
        hero_cta: '开始搜索',
        hero_more: '了解更多',
        hero_stat_games: '已比较游戏',
        hero_stat_stores: '商店',
        hero_stat_rating: '平均评分',
        hero_panel_search: '搜索游戏...',
        badge_popular: '热门',
        showcase_title: '精选游戏',
        showcase_sub: '当前最热门的游戏',
        cat_action: '动作',
        cat_adventure: '冒险',
        cat_plateforme: '平台',
        cat_horreur: '恐怖',
        cat_rpg: '角色扮演',
        cat_sport: '体育',
        badge_features: '功能',
        features_title: '它是如何工作的？',
        features_sub: '3 个步骤，在最佳地点找到最优价格',
        step1_title: '搜索',
        step1_desc: '输入您想查找的游戏名称。',
        step2_title: '比较',
        step2_desc: 'GameFinder 自动扫描多家商店。',
        step3_title: '省钱',
        step3_desc: '一键选择最划算的优惠。',
        features_cta: '比较价格',
        footer_tagline: '智能比价工具',
        search_title: '比较价格',
        search_sub: '几秒钟内找到最优价格',
        search_placeholder: '例如：Grand Theft Auto、Mario...',
        search_btn: '搜索',
        search_popular: '热门：',
        cat_available_title: '可用游戏',
        cat_available_sub: '选择一个游戏来比较价格',
        cat_search_placeholder: '筛选...',
        cat_side_title: '游戏',
        cat_side_footer_label: '目录',
        cat_games: '个游戏',
        cat_stores: '家商店',
        voir_plus: '查看更多',
        loading: '搜索中...',
        results_for: '结果',
        offers_found: '个优惠',
        sort_price: '按价格排序',
        all_games: '所有游戏',
        best_offer: '最佳优惠',
        best: '最佳',
        price: '价格',
        delivery: '运费',
        result_banner_label: '已搜索游戏',
        no_results_title: '未找到游戏',
        no_results_sub: '请尝试其他名称',
        search_error: '搜索时出错'
    },
    es: {
        nav_home: 'Inicio',
        nav_search: 'Buscar',
        nav_features: 'Funciones',
        nav_start: 'Empezar',
        nav_back: 'Volver',
        hero_badge: '3 tiendas comparadas',
        hero_title_a: 'Compara los precios',
        hero_title_b: 'de videojuegos',
        hero_text: 'GameFinder escanea automáticamente varias tiendas para encontrar el mejor precio, envío incluido.',
        hero_cta: 'Empezar a buscar',
        hero_more: 'Saber más',
        hero_stat_games: 'Juegos comparados',
        hero_stat_stores: 'Tiendas',
        hero_stat_rating: 'Valoración media',
        hero_panel_search: 'Buscar un juego...',
        badge_popular: 'Populares',
        showcase_title: 'Juegos destacados',
        showcase_sub: 'Los juegos más buscados del momento',
        cat_action: 'Acción',
        cat_adventure: 'Aventura',
        cat_plateforme: 'Plataforma',
        cat_horreur: 'Terror',
        cat_rpg: 'RPG',
        cat_sport: 'Deporte',
        badge_features: 'Funciones',
        features_title: '¿Cómo funciona?',
        features_sub: 'En 3 pasos, encuentra el mejor precio en el mejor sitio',
        step1_title: 'Busca',
        step1_desc: 'Introduce el nombre del juego que quieres encontrar.',
        step2_title: 'Compara',
        step2_desc: 'GameFinder escanea varias tiendas automáticamente.',
        step3_title: 'Ahorra',
        step3_desc: 'Elige la oferta más ventajosa con un clic.',
        features_cta: 'Comparar precios',
        footer_tagline: 'El comparador de precios inteligente',
        search_title: 'Comparar precios',
        search_sub: 'Encuentra el mejor precio en segundos',
        search_placeholder: 'Ej: Grand Theft Auto, Mario...',
        search_btn: 'Buscar',
        search_popular: 'Populares:',
        cat_available_title: 'Juegos disponibles',
        cat_available_sub: 'Selecciona un juego para comparar precios',
        cat_search_placeholder: 'Filtrar...',
        cat_side_title: 'Juegos',
        cat_side_footer_label: 'Catálogo',
        cat_games: 'juegos',
        cat_stores: 'tiendas',
        voir_plus: 'Ver más',
        loading: 'Buscando...',
        results_for: 'Resultados para',
        offers_found: 'ofertas encontradas',
        sort_price: 'Ordenar por precio',
        all_games: 'Todos los juegos',
        best_offer: 'Mejor oferta',
        best: 'Mejor',
        price: 'Precio',
        delivery: 'Envío',
        result_banner_label: 'Juego buscado',
        no_results_title: 'No se encontró el juego',
        no_results_sub: 'Prueba con otro nombre',
        search_error: 'Error durante la búsqueda'
    }
};

const SUPPORTED_LANGS = ['fr', 'en', 'de', 'zh', 'es'];

function getDefaultLang() {
    const saved = localStorage.getItem('gamefinder_lang');
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    const browser = (navigator.language || 'fr').toLowerCase().slice(0, 2);
    return SUPPORTED_LANGS.includes(browser) ? browser : 'fr';
}

let currentLang = getDefaultLang();

function t(key) {
    const dict = I18N[currentLang] || I18N.fr;
    return dict[key] !== undefined ? dict[key] : (I18N.fr[key] || key);
}

function langCode(lang) {
    return (lang === 'fr' ? 'FR' : lang === 'en' ? 'EN' : lang === 'de' ? 'DE' : lang === 'zh' ? 'CN' : 'ES');
}

function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem('gamefinder_lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : lang);
    applyI18n();
    refreshLangSelector();
    if (typeof window.onLangChange === 'function') window.onLangChange();
}

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerHTML = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    const titles = { fr: 'Comparateur de Prix', en: 'Price Comparison', de: 'Preisvergleich', zh: '比价', es: 'Comparador de Precios' };
    document.title = 'GameFinder - ' + (titles[currentLang] || titles.fr);
}

function refreshLangSelector() {
    const btn = document.querySelector('.lang-current');
    if (btn) btn.textContent = langCode(currentLang);
    document.querySelectorAll('.lang-menu li').forEach(li => {
        const active = li.getAttribute('data-lang') === currentLang;
        li.classList.toggle('active', active);
        if (active) li.setAttribute('aria-selected', 'true');
        else li.removeAttribute('aria-selected');
    });
}

function initLangSelector() {
    const select = document.getElementById('langSelect');
    if (!select) return;
    const btn = select.querySelector('.lang-btn');
    const menu = select.querySelector('.lang-menu');
    refreshLangSelector();
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = select.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            setLang(li.getAttribute('data-lang'));
            select.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
    document.addEventListener('click', () => {
        select.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initLangSelector();
    applyI18n();
});
