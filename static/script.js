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

let currentResults = [];
let isSearching = false;

// ===== SUGGESTIONS RAPIDES =====
document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', function() {
        const game = this.dataset.game;
        if (game) {
            searchInput.value = game;
            rechercher(game);
        }
    });
});

// ===== RECHERCHE =====
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const produit = searchInput.value.trim();
    if (!produit || isSearching) return;
    await rechercher(produit);
});

// ===== FONCTION DE RECHERCHE =====
async function rechercher(produit) {
    isSearching = true;
    
    // Reset des affichages
    resultsContainer.style.display = 'none';
    noResultsContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    loadingContainer.style.display = 'block';
    bestDeal.style.display = 'none';
    
    // Animation du loading
    const progressBar = document.querySelector('.progress-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 8;
        if (progress > 85) progress = 85;
        progressBar.style.width = progress + '%';
    }, 100);
    
    try {
        const formData = new FormData();
        formData.append('produit', produit);
        
        const response = await fetch('/recherche', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        clearInterval(interval);
        progressBar.style.width = '100%';
        
        setTimeout(() => {
            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la recherche');
            }
            afficherResultats(data, produit);
            loadingContainer.style.display = 'none';
            isSearching = false;
        }, 400);
        
    } catch (error) {
        clearInterval(interval);
        loadingContainer.style.display = 'none';
        afficherErreur(error.message);
        isSearching = false;
    }
}

// ===== AFFICHER RÉSULTATS =====
function afficherResultats(data, produit) {
    currentResults = data.resultats;
    
    if (!data.resultats || data.resultats.length === 0) {
        noResultsContainer.style.display = 'block';
        return;
    }
    
    // Afficher les résultats
    resultsContainer.style.display = 'block';
    searchTerm.textContent = produit;
    resultCount.textContent = data.total;
    
    // ===== MEILLEURE OFFRE =====
    if (data.meilleur) {
        const m = data.meilleur;
        bestDeal.innerHTML = `
            <div class="best-deal-content">
                <div class="best-deal-left">
                    <div class="best-deal-badge">
                        <i class="fas fa-crown"></i> Meilleure offre
                    </div>
                    <div class="best-deal-game">${m.jeu}</div>
                    <div class="best-deal-store">
                        <i class="fas fa-store"></i> ${m.site}
                    </div>
                </div>
                <div class="best-deal-right">
                    <div class="best-deal-price">${m.prix_total} €</div>
                    <div class="best-deal-details">
                        <span><i class="fas fa-tag"></i> ${m.prix}</span>
                        <span><i class="fas fa-truck"></i> ${m.livraison}</span>
                        <span><i class="fas fa-box"></i> ${m.stock}</span>
                    </div>
                </div>
            </div>
        `;
        bestDeal.style.display = 'block';
    }
    
    // ===== LISTE DES PRODUITS =====
    productList.innerHTML = '';
    data.resultats.forEach((produit, index) => {
        const card = creerCarteProduit(produit, index === 0);
        productList.appendChild(card);
        
        // Animation progressive
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50 + index * 50);
    });
}

// ===== CRÉER UNE CARTE PRODUIT =====
function creerCarteProduit(produit, isBest) {
    const card = document.createElement('div');
    card.className = `product-card ${isBest ? 'best' : ''}`;
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    
    let stockClass = 'inconnu';
    let stockIcon = 'fa-question-circle';
    const stockLower = produit.stock.toLowerCase();
    if (stockLower.includes('rupture')) {
        stockClass = 'rupture';
        stockIcon = 'fa-times-circle';
    } else if (stockLower.includes('en stock') || stockLower.includes('disponible')) {
        stockClass = 'en-stock';
        stockIcon = 'fa-check-circle';
    }
    
    card.innerHTML = `
        ${isBest ? '<div class="best-badge">⭐ Meilleur prix</div>' : ''}
        <div class="site"><i class="fas fa-store"></i> ${produit.site}</div>
        <div class="game">${produit.jeu}</div>
        <div class="price-row">
            <span class="label"><i class="fas fa-tag"></i> Prix</span>
            <span class="value">${produit.prix}</span>
        </div>
        <div class="price-row">
            <span class="label"><i class="fas fa-truck"></i> Livraison</span>
            <span class="value">${produit.livraison}</span>
        </div>
        <div class="total">${produit.prix_total} €</div>
        <div class="stock ${stockClass}">
            <i class="fas ${stockIcon}"></i>
            ${produit.stock}
        </div>
    `;
    
    return card;
}

// ===== TRIER PAR PRIX =====
function trierPrix() {
    if (!currentResults || currentResults.length === 0) return;
    
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
    
    // Mettre à jour le meilleur deal
    if (trie.length > 0) {
        const meilleur = trie[0];
        bestDeal.innerHTML = `
            <div class="best-deal-content">
                <div class="best-deal-left">
                    <div class="best-deal-badge">
                        <i class="fas fa-crown"></i> Meilleure offre
                    </div>
                    <div class="best-deal-game">${meilleur.jeu}</div>
                    <div class="best-deal-store">
                        <i class="fas fa-store"></i> ${meilleur.site}
                    </div>
                </div>
                <div class="best-deal-right">
                    <div class="best-deal-price">${meilleur.prix_total} €</div>
                    <div class="best-deal-details">
                        <span><i class="fas fa-tag"></i> ${meilleur.prix}</span>
                        <span><i class="fas fa-truck"></i> ${meilleur.livraison}</span>
                        <span><i class="fas fa-box"></i> ${meilleur.stock}</span>
                    </div>
                </div>
            </div>
        `;
        bestDeal.style.display = 'block';
    }
}

// ===== AFFICHER ERREUR =====
function afficherErreur(message) {
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
    
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
}

// ===== RACCOURCIS CLAVIER =====
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    if (e.key === 'Escape') {
        errorContainer.style.display = 'none';
    }
});

// ===== FOCUS AUTO =====
document.addEventListener('DOMContentLoaded', () => {
    searchInput.focus();
});

// ===== CONSOLE =====
console.log('🎮 GameFinder v3.0 - Interface ultra-fluide');
console.log('🔍 Appuyez sur Ctrl+K pour rechercher');
console.log('📦 ' + document.querySelectorAll('.suggestion-chip').length + ' suggestions disponibles');