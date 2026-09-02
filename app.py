# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify
from scraper import fetch_all_sites
from extracteur import extraire_toutes
from analyse import comparer_prix

app = Flask(__name__)

@app.route('/')
def index():
    """Page d'accueil"""
    return render_template('index.html')

@app.route('/recherche', methods=['POST'])
def recherche():
    """Endpoint de recherche"""
    produit = request.form.get('produit', '').strip()
    
    if not produit:
        return jsonify({'error': 'Veuillez entrer un produit'}), 400
    
    try:
        # Récupération des données
        html_par_site = fetch_all_sites(produit)
        donnees = extraire_toutes(html_par_site, produit)
        resultat = comparer_prix(donnees)
        
        if resultat.empty:
            return jsonify({'error': f'Aucun résultat trouvé pour "{produit}"'}), 404
        
        # Formatage des résultats pour le frontend
        resultats = []
        for _, row in resultat.iterrows():
            resultats.append({
                'site': row['site'],
                'jeu': row['jeu'],
                'prix': row['prix'],
                'livraison': row['livraison'],
                'prix_total': round(row['prix_total'], 2),
                'stock': row['stock']
            })
        
        # Trouver le meilleur prix
        meilleur = min(resultats, key=lambda x: x['prix_total']) if resultats else None
        
        return jsonify({
            'resultats': resultats,
            'meilleur': meilleur,
            'total': len(resultats)
        })
        
    except Exception as e:
        return jsonify({'error': f'Erreur technique: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)