#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Debug Amazon - Affiche la structure de la page
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scraper import EcommerceScraper

def debug_amazon():
    """Affiche la structure de la page Amazon pour trouver les bons sélecteurs"""
    print("=" * 60)
    print("🔍 DEBUG AMAZON - Analyse de la structure")
    print("=" * 60)
    
    scraper = EcommerceScraper()
    produit = "galaxy defenders"
    
    try:
        page = scraper.fetch_amazon(produit)
        html = str(page)
        
        print(f"\n📄 Taille HTML : {len(html)} caractères")
        
        # Chercher des motifs dans le HTML
        print("\n🔍 Recherche de motifs :")
        
        # 1. data-asin
        import re
        data_asin = re.findall(r'data-asin="([^"]+)"', html)
        print(f"   - data-asin trouvés : {len(data_asin)}")
        
        # 2. Prix
        prix = re.findall(r'€\s*(\d+[,.]\d{2})', html)
        print(f"   - Prix trouvés : {len(prix)}")
        
        # 3. Titres
        titres = re.findall(r'<h2[^>]*>(.*?)</h2>', html, re.DOTALL)
        print(f"   - Titres h2 : {len(titres)}")
        
        # 4. Afficher les premiers titres
        if titres:
            print("\n📦 Premiers titres :")
            for i, t in enumerate(titres[:3]):
                # Nettoyer le HTML
                clean = re.sub(r'<[^>]+>', '', t).strip()
                if clean:
                    print(f"   {i+1}. {clean[:80]}")
        
        # 5. Afficher les premières occurrences de prix
        if prix:
            print("\n💰 Premiers prix :")
            for i, p in enumerate(prix[:3]):
                print(f"   {i+1}. {p} €")
        
        # Sauvegarder le HTML pour analyse
        with open('amazon_debug.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("\n💾 HTML sauvegardé dans 'amazon_debug.html'")
        print("   Ouvrez ce fichier pour voir la structure complète")
        
    except Exception as e:
        print(f"❌ Erreur : {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_amazon()