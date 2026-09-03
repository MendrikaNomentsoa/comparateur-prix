// ========================================
// SVG ICONS
// ========================================
const ICONS = {
    star: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    trophy: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    gamepad: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="13" r="1" fill="currentColor"/><circle cx="18" cy="11" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><circle cx="12" cy="13" r="1" fill="currentColor"/><rect x="2" y="6" width="20" height="12" rx="6" stroke="currentColor" fill="none"/></svg>',
    fallbackGame: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="6"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="16" cy="10" r="0.8" fill="currentColor"/><circle cx="18" cy="12" r="0.8" fill="currentColor"/><circle cx="16" cy="14" r="0.8" fill="currentColor"/><circle cx="14" cy="12" r="0.8" fill="currentColor"/></svg>'
};

// ========================================
// GESTION DU THEME
// ========================================
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

function updateThemeIcon(theme) {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    const sun = btn.querySelector('.icon-sun');
    const moon = btn.querySelector('.icon-moon');
    if (sun && moon) {
        sun.style.display = theme === 'dark' ? 'block' : 'none';
        moon.style.display = theme === 'dark' ? 'none' : 'block';
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

updateThemeIcon(savedTheme);

document.querySelector('.theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// ========================================
// DICTIONNAIRE DES JEUX (NOMS SEULEMENTS)
// ========================================
const GAMES_DB = {
    'gta': { name: 'Grand Theft Auto', category: 'Action' },
    'mario': { name: 'Super Mario', category: 'Plateforme' },
    'resident evil': { name: 'Resident Evil', category: 'Horreur' },
    'resident evil 4': { name: 'Resident Evil 4', category: 'Horreur' },
    'residentevil1': { name: 'Resident Evil', category: 'Horreur' },
    'residentevil': { name: 'Resident Evil', category: 'Horreur' },
    'galaxy defenders': { name: 'Galaxy Defenders', category: 'Action' },
    'zelda': { name: 'Legend of Zelda', category: 'Aventure' },
    'cyberpunk': { name: 'Cyberpunk 2077', category: 'RPG' },
    'fifa': { name: 'FIFA', category: 'Sport' }
};

// ========================================
// CACHE D'IMAGES (CHARGE DEPUIS L'API)
// ========================================
const IMAGE_CACHE = {};

function refreshVisibleImages() {
    if (window.location.pathname === '/recherche') {
        renderCataloguePartielle();
        if (resultsContainer && resultsContainer.style.display === 'block' && lastData) {
            afficherResultats(lastData, lastProduit);
        }
    }
}

async function fetchImages() {
    try {
        const r = await fetch('/api/catalogue');
        if (!r.ok) return;
        const data = await r.json();
        const jeux = data.jeux || [];
        let added = false;
        for (const item of jeux) {
            if (item.image) {
                IMAGE_CACHE[item.jeu.toLowerCase()] = item.image;
                added = true;
            }
        }
        if (added) refreshVisibleImages();
        // Charger les images manquantes en arriere-plan, par lots
        const missing = jeux.filter(item => !IMAGE_CACHE[item.jeu.toLowerCase()]);
        const BATCH = 4;
        for (let i = 0; i < missing.length; i += BATCH) {
            const batch = missing.slice(i, i + BATCH);
            await Promise.all(batch.map(async (item) => {
                try {
                    const ir = await fetch('/api/image/' + encodeURIComponent(item.jeu));
                    if (ir.ok) {
                        const idata = await ir.json();
                        if (idata.image) {
                            IMAGE_CACHE[item.jeu.toLowerCase()] = idata.image;
                        }
                    }
                } catch (e) {}
            }));
            refreshVisibleImages();
        }
    } catch (e) {
        console.warn('Impossible de charger les images:', e);
    }
}

function resolveIcon(jeu, apiImage) {
    if (apiImage) {
        IMAGE_CACHE[jeu.toLowerCase()] = apiImage;
        return { type: 'image', content: apiImage };
    }
    return getGameImage(jeu);
}

const GAME_GRADIENTS = {
    'galaxy defenders': 'linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #2d1b69 100%)',
    'zelda': 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 50%, #52b788 100%)',
    'cyberpunk': 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #f72585 100%)',
    'fifa': 'linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 50%, #40916c 100%)',
    'grand theft auto': 'linear-gradient(135deg, #0b0b0f 0%, #1a1a24 50%, #c9a227 100%)',
    'call of duty': 'linear-gradient(135deg, #141414 0%, #2b2b2b 50%, #8a8a8a 100%)',
    'red dead': 'linear-gradient(135deg, #3a1505 0%, #6b2d0b 50%, #b45309 100%)',
    'witcher': 'linear-gradient(135deg, #1a1030 0%, #3b2570 50%, #6d28d9 100%)',
    'assassin': 'linear-gradient(135deg, #4a1d1d 0%, #7f1d1d 50%, #dc2626 100%)',
    'far cry': 'linear-gradient(135deg, #166534 0%, #15803d 50%, #4ade80 100%)',
    'starfield': 'linear-gradient(135deg, #0c1030 0%, #1e2a5a 50%, #64748b 100%)',
    'nba': 'linear-gradient(135deg, #1a1a2e 0%, #7c2d12 50%, #ea580c 100%)',
    'f1': 'linear-gradient(135deg, #111 0%, #7f1d1d 50%, #ef4444 100%)',
    'civilization': 'linear-gradient(135deg, #14532d 0%, #166534 50%, #facc15 100%)',
    'age of empires': 'linear-gradient(135deg, #3b2006 0%, #7c3a0c 50%, #d97706 100%)',
    'super mario': 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)',
    'sonic': 'linear-gradient(135deg, #172554 0%, #1e40af 50%, #38bdf8 100%)',
    'resident evil': 'linear-gradient(135deg, #1c0505 0%, #450a0a 50%, #991b1b 100%)',
    'silent hill': 'linear-gradient(135deg, #101010 0%, #2a2a2a 50%, #6b7280 100%)',
    'hollow knight': 'linear-gradient(135deg, #0c0c14 0%, #2a1651 50%, #7c3aed 100%)',
    'stardew': 'linear-gradient(135deg, #14532d 0%, #4d7c0f 50%, #a3e635 100%)',
    'celeste': 'linear-gradient(135deg, #3b0764 0%, #7e22ce 50%, #e879f9 100%)',
    'fortnite': 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #a855f7 100%)',
    'apex': 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f97316 100%)'
};

function getCatalogueCover(jeu) {
    const lower = jeu.toLowerCase();
    if (IMAGE_CACHE[lower]) {
        return { type: 'image', content: IMAGE_CACHE[lower] };
    }
    for (const [key, grad] of Object.entries(GAME_GRADIENTS)) {
        if (lower.includes(key)) {
            return { type: 'gradient', content: grad };
        }
    }
    return { type: 'gradient', content: 'linear-gradient(135deg, #1a1a2e 0%, #3b3b52 50%, #6c5ce7 100%)' };
}

// ========================================
// FONCTION POUR OBTENIR L'IMAGE D'UN JEU
// ========================================
function getGameImage(gameName) {
    if (!gameName) return { type: 'gradient', content: null };
    const lower = gameName.toLowerCase();
    if (IMAGE_CACHE[lower]) {
        return { type: 'image', content: IMAGE_CACHE[lower] };
    }
    for (const [key] of Object.entries(GAMES_DB)) {
        if (lower.includes(key)) {
            const cached = IMAGE_CACHE[key];
            if (cached) return { type: 'image', content: cached };
        }
    }
    return { type: 'gradient', content: getGameGradient(gameName) };
}

function getGameGradient(gameName) {
    if (!gameName) return null;
    const lower = gameName.toLowerCase();
    for (const [key, gradient] of Object.entries(GAME_GRADIENTS)) {
        if (lower.includes(key)) return gradient;
    }
    return null;
}

function getGameDisplayName(gameName) {
    if (!gameName) return gameName;
    const lower = gameName.toLowerCase();
    if (GAMES_DB[lower]) return GAMES_DB[lower].name;
    for (const [key, data] of Object.entries(GAMES_DB)) {
        if (lower.includes(key)) return data.name;
    }
    return gameName;
}

function renderGameIcon(iconData, jeu, extraStyle) {
    if (iconData.type === 'image') {
        return '<img src="' + iconData.content + '" alt="' + jeu + '" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;' + (extraStyle || '') + '">';
    }
    const gradient = iconData.type === 'gradient' ? iconData.content : getGameGradient(jeu);
    const bgStyle = gradient ? 'background:linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.25)),' + gradient + ';' : 'background:var(--bg-input);';
    return '<div style="width:100%;height:120px;display:flex;align-items:center;justify-content:center;border-radius:8px;margin-bottom:8px;' + bgStyle + '"><svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h.01M9 12h.01"/><circle cx="15" cy="11" r="0.4"/><circle cx="17" cy="13" r="0.4"/><circle cx="15.5" cy="14.5" r="0.4"/></svg></div>';
}

function renderGameIconSmall(iconData, jeu) {
    if (iconData.type === 'image') {
        return '<img src="' + iconData.content + '" alt="' + jeu + '" style="width:50px;height:50px;border-radius:10px;object-fit:cover;">';
    }
    return '<div class="game-icon-small"></div>';
}

// ========================================
// CATALOGUE DES JEUX DISPONIBLES
// ========================================
const CATALOGUE = [
    { jeu: 'Grand Theft Auto VI', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Cyberpunk 2077', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Super Mario Odyssey 2', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Resident Evil 9', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Call of Duty: Black Ops V', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Red Dead Redemption III', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'The Witcher 4', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: "Assassin's Creed Mirage", boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Far Cry 7', boutiques: ['GameHub', 'PixelStore'] },
    { jeu: 'Starfield', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'FIFA 24', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'NBA 2K24', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'F1 23', boutiques: ['GameHub', 'PixelStore'] },
    { jeu: 'Civilization VII', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Age of Empires IV', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Sonic Frontiers 2', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Silent Hill 2 Remake', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Hollow Knight: Silksong', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Stardew Valley 2', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Celeste 2', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Fortnite Chapter 5', boutiques: ['GameHub', 'GameStore', 'PixelStore'] },
    { jeu: 'Apex Legends 2', boutiques: ['GameHub', 'GameStore', 'PixelStore'] }
];

const VISIBLE_DEFAUT = 8;
let catalogueVisible = VISIBLE_DEFAUT;

const STORE_BASE = 'http://localhost:8000/boutique_';

function slugify(str) {
    if (!str) return '';
    return str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function storeUrl(site, jeu) {
    const siteKey = String(site || '').toLowerCase();
    const found = CATALOGUE.find(c => String(jeu).toLowerCase().includes(c.jeu.toLowerCase()))
        || CATALOGUE.find(c => c.jeu.toLowerCase().includes(String(jeu).toLowerCase()));
    const name = found ? found.jeu : jeu;
    return STORE_BASE + siteKey + '.html#' + slugify(name);
}

function ouvrirBoutique(url) {
    window.open(url, '_blank', 'noopener');
}

function creerCarteCatalogue(item) {
    const card = document.createElement('button');
    card.className = 'catalogue-card';
    card.dataset.game = item.jeu;
    const cover = getCatalogueCover(item.jeu);

    let coverHtml;
    if (cover.type === 'image') {
        coverHtml = `<img src="${cover.content}" alt="${item.jeu}" loading="lazy">`;
    } else {
        coverHtml = `<div style="background:linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.25)),${cover.content};display:flex;align-items:center;justify-content:center;width:100%;height:100%;"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h.01M9 12h.01"/><circle cx="15" cy="11" r="0.4"/><circle cx="17" cy="13" r="0.4"/><circle cx="15.5" cy="14.5" r="0.4"/></svg></div>`;
    }

    card.innerHTML = `
        <div class="catalogue-cover">${coverHtml}</div>
        <div class="catalogue-card-body">
            <div class="catalogue-title">${item.jeu}</div>
            <div class="catalogue-shops">
                ${item.boutiques.map(b => `<span class="shop-tag">${b}</span>`).join('')}
            </div>
        </div>
    `;
    card.addEventListener('click', () => {
        if (searchInput) searchInput.value = item.jeu;
        rechercher(item.jeu);
    });
    return card;
}

function creerLigneCatalogue(item) {
    const row = document.createElement('button');
    row.className = 'catalogue-side-row';
    row.dataset.game = item.jeu;
    const cover = getCatalogueCover(item.jeu);
    let thumbHtml;
    if (cover.type === 'image') {
        thumbHtml = `<img src="${cover.content}" alt="">`;
    } else {
        thumbHtml = `<div style="background:linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.25)),${cover.content};"></div>`;
    }
    row.innerHTML = `
        <span class="side-thumb">${thumbHtml}</span>
        <span class="side-name">${item.jeu}</span>
        <svg class="side-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    `;
    row.addEventListener('click', () => {
        if (searchInput) searchInput.value = item.jeu;
        rechercher(item.jeu);
    });
    return row;
}

function creerBoutonVoirPlus() {
    const btn = document.createElement('button');
    btn.id = 'voirPlus';
    btn.className = 'catalogue-side-row voir-plus-row';
    btn.innerHTML = `<span class="voir-plus">${t('voir_plus')}</span>`;
    btn.addEventListener('click', () => {
        catalogueVisible = CATALOGUE.length;
        renderCataloguePartielle();
    });
    return btn;
}

function creerBoutonVoirPlusItem() {
    const btn = document.createElement('button');
    btn.className = 'catalogue-card voir-more-card';
    btn.innerHTML = `<span class="voir-more-inner">${t('voir_plus')}</span>`;
    btn.addEventListener('click', () => {
        catalogueVisible = CATALOGUE.length;
        renderCataloguePartielle();
    });
    return btn;
}

function renderCataloguePartielle() {
    const list = document.getElementById('catalogueList');
    const sideList = document.getElementById('catalogueSideList');
    if (!list) return;

    list.innerHTML = '';
    CATALOGUE.slice(0, catalogueVisible).forEach(item => {
        list.appendChild(creerCarteCatalogue(item));
    });
    if (catalogueVisible < CATALOGUE.length) {
        list.appendChild(creerBoutonVoirPlusItem());
    }

    if (sideList) {
        sideList.innerHTML = '';
        CATALOGUE.slice(0, catalogueVisible).forEach(item => {
            sideList.appendChild(creerLigneCatalogue(item));
        });
        if (catalogueVisible < CATALOGUE.length) {
            sideList.appendChild(creerBoutonVoirPlus());
        }
    }
}

function initCatalogue() {
    const searchCat = document.getElementById('catalogueSearch');
    if (searchCat) {
        searchCat.addEventListener('input', () => {
            const term = searchCat.value.trim().toLowerCase();
            const list = document.getElementById('catalogueList');
            const sideList = document.getElementById('catalogueSideList');
            if (!list) return;
            const filtered = CATALOGUE.filter(item => item.jeu.toLowerCase().includes(term));
            list.innerHTML = '';
            filtered.forEach(item => {
                list.appendChild(creerCarteCatalogue(item));
            });
            if (sideList) {
                sideList.innerHTML = '';
                filtered.forEach(item => {
                    sideList.appendChild(creerLigneCatalogue(item));
                });
            }
        });
    }
}

function revenirCatalogue() {
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (noResultsContainer) noResultsContainer.style.display = 'none';
    if (loadingContainer) loadingContainer.style.display = 'none';
    if (errorContainer) errorContainer.style.display = 'none';
    if (bestDeal) bestDeal.style.display = 'none';
    const catalogue = document.querySelector('.catalogue');
    if (catalogue) catalogue.style.display = 'block';
    const suggestions = document.querySelector('.suggestions');
    if (suggestions) suggestions.style.display = 'flex';
    const searchCat = document.getElementById('catalogueSearch');
    if (searchCat) searchCat.value = '';
    renderCataloguePartielle();
    if (searchInput) setTimeout(() => searchInput.focus(), 100);
}

// ========================================
// ELEMENTS DOM
// ========================================
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('produit');
const resultsContainer = document.getElementById('results');
const loadingContainer = document.getElementById('loading');
const noResultsContainer = document.getElementById('noResults');
const errorContainer = document.getElementById('error');
const productList = document.getElementById('productList');
const bestDeal = document.getElementById('bestDeal');
const searchTerm = document.getElementById('searchTerm');
const resultCount = document.getElementById('resultCount');
const errorMessage = document.getElementById('errorMessage');

let currentResults = [];
let lastData = null;
let lastProduit = '';
let isSearching = false;
let currentBestUrl = '';

if (bestDeal) {
    bestDeal.addEventListener('click', () => {
        if (currentBestUrl) ouvrirBoutique(currentBestUrl);
    });
}

// ========================================
// SUGGESTIONS
// ========================================
document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', function() {
        const game = this.dataset.game;
        if (game && searchInput) {
            searchInput.value = game;
            rechercher(game);
        }
    });
});

// ========================================
// RECHERCHE
// ========================================
if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const produit = searchInput.value.trim();
        if (!produit || isSearching) return;
        await rechercher(produit);
    });
}

async function rechercher(produit) {
    isSearching = true;

    if (resultsContainer) resultsContainer.style.display = 'none';
    if (noResultsContainer) noResultsContainer.style.display = 'none';
    if (errorContainer) errorContainer.style.display = 'none';
    if (loadingContainer) loadingContainer.style.display = 'block';
    if (bestDeal) bestDeal.style.display = 'none';

    const catalogue = document.querySelector('.catalogue');
    if (catalogue) catalogue.style.display = 'none';
    const suggestions = document.querySelector('.suggestions');
    if (suggestions) suggestions.style.display = 'none';

    try {
        const formData = new FormData();
        formData.append('produit', produit);

        const response = await fetch('/api/recherche', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || t('search_error'));
        }

        afficherResultats(data, produit);

    } catch (error) {
        afficherErreur(error.message);
    } finally {
        if (loadingContainer) loadingContainer.style.display = 'none';
        isSearching = false;
    }
}

// ========================================
// AFFICHER RESULTATS
// ========================================
function afficherResultats(data, produit) {
    currentResults = data.resultats;
    lastData = data;
    lastProduit = produit;

    if (!data.resultats || data.resultats.length === 0) {
        if (noResultsContainer) noResultsContainer.style.display = 'block';
        const catalogue = document.querySelector('.catalogue');
        if (catalogue) catalogue.style.display = 'block';
        return;
    }

    if (resultsContainer) resultsContainer.style.display = 'block';
    if (searchTerm) searchTerm.textContent = produit;
    if (resultCount) resultCount.textContent = data.total;

    const apiBannerImg = (data.resultats && data.resultats[0] && data.resultats[0].image) || null;
    const coverData = apiBannerImg ? { type: 'image', content: apiBannerImg } : getCatalogueCover(produit);
    if (apiBannerImg) IMAGE_CACHE[produit.toLowerCase()] = apiBannerImg;
    const bannerCover = document.getElementById('resultBannerCover');
    const bannerTitle = document.getElementById('resultBannerTitle');
    if (bannerCover) {
        if (coverData.type === 'image') {
            bannerCover.innerHTML = `<img src="${coverData.content}" alt="${produit}">`;
        } else {
            bannerCover.style.background = coverData.content;
            bannerCover.innerHTML = '';
        }
    }
    if (bannerTitle) bannerTitle.textContent = getGameDisplayName(produit);

    if (bestDeal && data.meilleur) {
        const m = data.meilleur;
        currentBestUrl = storeUrl(m.site, m.jeu);
        const iconData = resolveIcon(m.jeu, m.image);
        const displayName = getGameDisplayName(m.jeu);

        bestDeal.innerHTML = `
            <div class="best-deal-content">
                <div class="best-deal-left">
                    ${renderGameIconSmall(iconData, m.jeu)}
                    <div class="info">
                        <span class="badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                            ${t('best_offer')}
                        </span>
                        <div class="game-name">${displayName}</div>
                        <div class="store">${m.site}</div>
                    </div>
                </div>
                <div class="best-deal-right">
                    <div class="price">${m.prix_total} &euro;</div>
                    <div class="details">
                        <span>${m.prix}</span>
                        <span>${m.livraison}</span>
                        <span>${m.stock}</span>
                    </div>
                </div>
            </div>
        `;
        bestDeal.style.display = 'block';
    }

    if (productList) {
        productList.innerHTML = '';
        data.resultats.forEach((produit, index) => {
            const card = creerCarteProduit(produit, index === 0);
            productList.appendChild(card);
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50 + index * 50);
        });
    }
}

// ========================================
// CREER CARTE PRODUIT
// ========================================
function creerCarteProduit(produit, isBest) {
    const card = document.createElement('div');
    card.className = `product-card ${isBest ? 'best' : ''}`;
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

    const iconData = resolveIcon(produit.jeu, produit.image);
    const displayName = getGameDisplayName(produit.jeu);

    let stockClass = 'inconnu';
    const stockLower = produit.stock.toLowerCase();
    if (stockLower.includes('rupture')) {
        stockClass = 'rupture';
    } else if (stockLower.includes('en stock') || stockLower.includes('disponible')) {
        stockClass = 'en-stock';
    }

    card.innerHTML = `
        ${isBest ? '<div class="best-badge"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ' + t('best') + '</div>' : ''}
        ${renderGameIcon(iconData, produit.jeu)}
        <div class="site">${produit.site}</div>
        <div class="game-name">${displayName}</div>
        <div class="price-row">
            <span class="label">${t('price')}</span>
            <span class="value">${produit.prix}</span>
        </div>
        <div class="price-row">
            <span class="label">${t('delivery')}</span>
            <span class="value">${produit.livraison}</span>
        </div>
        <div class="total">${produit.prix_total} &euro;</div>
        <div class="stock ${stockClass}">
            <span class="stock-dot"></span> ${produit.stock}
        </div>
        <div class="card-open">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Voir sur le site
        </div>
    `;

    card.dataset.url = storeUrl(produit.site, produit.jeu);
    card.addEventListener('click', () => {
        if (card.dataset.url) ouvrirBoutique(card.dataset.url);
    });

    return card;
}

// ========================================
// TRIER PAR PRIX
// ========================================
function trierPrix() {
    if (!currentResults || currentResults.length === 0 || !productList) return;

    const trie = [...currentResults].sort((a, b) => a.prix_total - b.prix_total);
    productList.innerHTML = '';

    trie.forEach((produit, index) => {
        const card = creerCarteProduit(produit, index === 0);
        productList.appendChild(card);
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50 + index * 50);
    });

    if (bestDeal && trie.length > 0) {
        const m = trie[0];
        currentBestUrl = storeUrl(m.site, m.jeu);
        const iconData = resolveIcon(m.jeu, m.image);
        const displayName = getGameDisplayName(m.jeu);

        bestDeal.innerHTML = `
            <div class="best-deal-content">
                <div class="best-deal-left">
                    ${renderGameIconSmall(iconData, m.jeu)}
                    <div class="info">
                        <span class="badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                            ${t('best_offer')}
                        </span>
                        <div class="game-name">${displayName}</div>
                        <div class="store">${m.site}</div>
                    </div>
                </div>
                <div class="best-deal-right">
                    <div class="price">${m.prix_total} &euro;</div>
                    <div class="details">
                        <span>${m.prix}</span>
                        <span>${m.livraison}</span>
                        <span>${m.stock}</span>
                    </div>
                </div>
            </div>
        `;
        bestDeal.style.display = 'block';
    }
}

// ========================================
// AFFICHER ERREUR
// ========================================
function afficherErreur(message) {
    if (errorMessage) errorMessage.textContent = message;
    if (errorContainer) {
        errorContainer.style.display = 'flex';
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }
}

// ========================================
// RACCOURCIS CLAVIER
// ========================================
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k' && searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
    if (e.key === 'Escape' && errorContainer) {
        errorContainer.style.display = 'none';
    }
});

// ========================================
// FOCUS AUTO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    fetchImages();
    if (window.location.pathname === '/recherche') {
        initCatalogue();
        renderCataloguePartielle();
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 400);
        }
    }
    const current = document.documentElement.getAttribute('data-theme');
    updateThemeIcon(current);
});

// ========================================
// RENDERS APRES CHANGEMENT DE LANGUE
// ========================================
window.onLangChange = function() {
    if (window.location.pathname !== '/recherche') return;
    renderCataloguePartielle();
    if (resultsContainer && resultsContainer.style.display === 'block' && lastData) {
        afficherResultats(lastData, lastProduit);
    }
};
