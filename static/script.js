// ===== ÉLÉMENTS DOM =====
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
const navbar = document.getElementById('navbar');

let currentResults = [];
let isSearching = false;

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== SUGGESTIONS =====
document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', function() {
        const game = this.dataset.game;
        if (game && searchInput) {
            searchInput.value = game;
            rechercher(game);
        }
    });
});

// ===== SEARCH =====
if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const produit = searchInput.value.trim();
        if (!produit || isSearching) return;
        await rechercher(produit);
    });
}

// ===== RECHERCHE =====
async function rechercher(produit) {
    isSearching = true;
    
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (noResultsContainer) noResultsContainer.style.display = 'none';
    if (errorContainer) errorContainer.style.display = 'none';
    if (loadingContainer) loadingContainer.style.display = 'block';
    if (bestDeal) bestDeal.style.display = 'none';
    
    try {
        const formData = new FormData();
        formData.append('produit', produit);
        
        const response = await fetch('/api/recherche', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erreur lors de la recherche');
        }
        
        afficherResultats(data, produit);
        
    } catch (error) {
        afficherErreur(error.message);
    } finally {
        if (loadingContainer) loadingContainer.style.display = 'none';
        isSearching = false;
    }
}

// ===== AFFICHER RÉSULTATS =====
function afficherResultats(data, produit) {
    currentResults = data.resultats;
    
    if (!data.resultats || data.resultats.length === 0) {
        if (noResultsContainer) noResultsContainer.style.display = 'block';
        return;
    }
    
    if (resultsContainer) resultsContainer.style.display = 'block';
    if (searchTerm) searchTerm.textContent = produit;
    if (resultCount) resultCount.textContent = data.total;
    
    // Best Deal
    if (bestDeal && data.meilleur) {
        const m = data.meilleur;
        bestDeal.innerHTML = `
            <div class="best-deal-content">
                <div class="best-deal-left">
                    <div class="best-deal-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                            <path d="M2 17L12 22L22 17"/>
                            <path d="M2 12L12 17L22 12"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Meilleure offre
                    </div>
                    <div class="best-deal-game">${m.jeu}</div>
                    <div class="best-deal-store">${m.site}</div>
                </div>
                <div class="best-deal-right">
                    <div class="best-deal-price">${m.prix_total} €</div>
                    <div class="best-deal-details">
                        <span>${m.prix}</span>
                        <span>${m.livraison}</span>
                        <span>${m.stock}</span>
                    </div>
                </div>
            </div>
        `;
        bestDeal.style.display = 'block';
    }
    
    // Product List
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

// ===== CRÉER CARTE PRODUIT =====
function creerCarteProduit(produit, isBest) {
    const card = document.createElement('div');
    card.className = `product-card ${isBest ? 'best' : ''}`;
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    let stockClass = 'inconnu';
    const stockLower = produit.stock.toLowerCase();
    if (stockLower.includes('rupture')) {
        stockClass = 'rupture';
    } else if (stockLower.includes('en stock') || stockLower.includes('disponible')) {
        stockClass = 'en-stock';
    }
    
    card.innerHTML = `
        ${isBest ? '<div class="best-badge">⭐ Meilleur prix</div>' : ''}
        <div class="site">${produit.site}</div>
        <div class="game">${produit.jeu}</div>
        <div class="price-row">
            <span class="label">Prix</span>
            <span class="value">${produit.prix}</span>
        </div>
        <div class="price-row">
            <span class="label">Livraison</span>
            <span class="value">${produit.livraison}</span>
        </div>
        <div class="total">${produit.prix_total} €</div>
        <div class="stock ${stockClass}">
            <span style="width:8px;height:8px;border-radius:50%;display:inline-block;background:currentColor;"></span>
            ${produit.stock}
        </div>
    `;
    
    return card;
}

// ===== TRIER PAR PRIX =====
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
        bestDeal.innerHTML = `
            <div class="best-deal-content">
                <div class="best-deal-left">
                    <div class="best-deal-badge">🏆 Meilleure offre</div>
                    <div class="best-deal-game">${m.jeu}</div>
                    <div class="best-deal-store">${m.site}</div>
                </div>
                <div class="best-deal-right">
                    <div class="best-deal-price">${m.prix_total} €</div>
                    <div class="best-deal-details">
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

// ===== AFFICHER ERREUR =====
function afficherErreur(message) {
    if (errorMessage) errorMessage.textContent = message;
    if (errorContainer) {
        errorContainer.style.display = 'flex';
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }
}

// ===== RACCOURCIS CLAVIER =====
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k' && searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
    if (e.key === 'Escape' && errorContainer) {
        errorContainer.style.display = 'none';
    }
});

// ===== FOCUS AUTO =====
document.addEventListener('DOMContentLoaded', () => {
    if (searchInput && window.location.pathname === '/recherche') {
        setTimeout(() => searchInput.focus(), 300);
    }
});

// ===== CONSOLE =====
console.log('%c🎮 GameFinder v3.0', 'font-size:24px;font-weight:bold;color:#6C63FF;');
console.log('%c✨ Design moderne avec icônes SVG', 'font-size:14px;color:#94A3B8;');
console.log('%c🔍 Appuyez sur Ctrl+K pour rechercher', 'font-size:12px;color:#64748B;');