#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test rapide du scraping
"""

import sys
import os

# Ajouter le dossier parent au chemin Python
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scraper import EcommerceScraper

def quick_test():
    """Test ultra-rapide"""
    print("=" * 60)
    print("🚀 TEST RAPIDE DU SCRAPING")
    print("=" * 60)
    
    scraper = EcommerceScraper()
    produit = "galaxy defenders"
    
    print(f"\n🔍 Recherche de '{produit}' sur Amazon...\n")
    
    try:
        page = scraper.fetch_amazon(produit)
        print(f"\n✅ Page récupérée avec succès")
        
        # Scrapling utilise .html ou .text selon la version
        # Essayons les deux méthodes
        try:
            # Méthode 1 : .html (si disponible)
            html_content = page.html
        except AttributeError:
            try:
                # Méthode 2 : .text (alternative)
                html_content = page.text
            except AttributeError:
                # Méthode 3 : convertir en string
                html_content = str(page)
        
        print(f"   Taille : {len(html_content)} caractères")
        
        # Test d'extraction basique - essayer plusieurs sélecteurs
        print("\n🔍 Extraction des titres...")
        
        # Sélecteurs Amazon possibles
        selecteurs = [
            '.s-title',
            '.a-size-medium',
            '.a-size-base-plus',
            'h2 a span',
            '[data-asin] h2'
        ]
        
        titres_trouves = []
        for selecteur in selecteurs:
            try:
                titres = page.css(f'{selecteur}::text').getall()
                if titres:
                    titres_trouves = titres
                    print(f"   ✅ Sélecteur trouvé : '{selecteur}'")
                    break
            except:
                continue
        
        if titres_trouves:
            print(f"\n📦 Premiers titres trouvés :")
            for i, titre in enumerate(titres_trouves[:3], 1):
                if titre and titre.strip():
                    print(f"   {i}. {titre.strip()[:80]}...")
        else:
            print("\n⚠️ Aucun titre trouvé avec les sélecteurs testés")
            print("   Affichage du début de la page pour déboguer :")
            print("   " + html_content[:500] + "...")
        
        return page
        
    except Exception as e:
        print(f"\n❌ Erreur : {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    quick_test()