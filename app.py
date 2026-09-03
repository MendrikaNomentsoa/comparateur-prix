# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify
from scraper import fetch_all_sites
from extracteur import extraire_toutes
from analyse import comparer_prix
from image_fetcher import fetch_image, get_cached_image

app = Flask(__name__)

CATALOGUE = [
    {"jeu": "Grand Theft Auto VI", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Cyberpunk 2077", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Super Mario Odyssey 2", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Resident Evil 9", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Call of Duty: Black Ops V", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Red Dead Redemption III", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "The Witcher 4", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Assassin's Creed Mirage", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Far Cry 7", "boutiques": ["GameHub", "PixelStore"]},
    {"jeu": "Starfield", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "FIFA 24", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "NBA 2K24", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "F1 23", "boutiques": ["GameHub", "PixelStore"]},
    {"jeu": "Civilization VII", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Age of Empires IV", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Sonic Frontiers 2", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Silent Hill 2 Remake", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Hollow Knight: Silksong", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Stardew Valley 2", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Celeste 2", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Fortnite Chapter 5", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
    {"jeu": "Apex Legends 2", "boutiques": ["GameHub", "GameStore", "PixelStore"]},
]

@app.route('/')
def index():
    """Page d'accueil"""
    return render_template('index.html')

@app.route('/recherche')
def recherche_page():
    """Page de recherche"""
    return render_template('recherche.html')

@app.route('/api/catalogue')
def api_catalogue():
    """Catalogue des jeux avec images (depuis le cache)"""
    resultats = []
    for c in CATALOGUE:
        jeu = c["jeu"]
        img_url = get_cached_image(jeu)
        resultats.append({
            "jeu": jeu,
            "boutiques": c["boutiques"],
            "image": img_url if img_url else None
        })
    return jsonify({"jeux": resultats})

@app.route('/api/image/<game_name>')
def api_image(game_name):
    """Recuperer l'image d'un jeu"""
    img_url = fetch_image(game_name)
    if img_url:
        return jsonify({"jeu": game_name, "image": img_url})
    return jsonify({"jeu": game_name, "image": None})

@app.route('/api/recherche', methods=['POST'])
def recherche_api():
    """API de recherche"""
    produit = request.form.get('produit', '').strip()
    
    if not produit:
        return jsonify({'error': 'Veuillez entrer un produit'}), 400
    
    try:
        html_par_site = fetch_all_sites(produit)
        donnees = extraire_toutes(html_par_site, produit)
        resultat = comparer_prix(donnees)
        
        if resultat.empty:
            return jsonify({'error': f'Aucun r\303\251sultat pour "{produit}"'}), 404
        
        img_url = fetch_image(produit)
        
        resultats = []
        for _, row in resultat.iterrows():
            resultats.append({
                'site': _nettoyer_val(row['site']),
                'jeu': _nettoyer_val(row['jeu']),
                'prix': _nettoyer_val(row['prix']),
                'livraison': _nettoyer_val(row['livraison']),
                'prix_total': round(float(row['prix_total']), 2),
                'stock': _nettoyer_val(row.get('stock', "")),
                'image': img_url
            })
        
        meilleur = min(resultats, key=lambda x: x['prix_total']) if resultats else None
        
        return jsonify({
            'resultats': resultats,
            'meilleur': meilleur,
            'total': len(resultats)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def _nettoyer_val(v):
    if v is None or (isinstance(v, float) and v != v):
        return ""
    return v

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)