#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test détaillé du scraping
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scraper import EcommerceScraper

def test_amazon_detailed():
    """Test détaillé d'Amazon"""
    print("=" * 60)
    print("🛒 TEST DÉTAILLÉ - AMAZON")
    print("=" * 60)
    
    scraper = EcommerceScraper()
    produit = "galaxy defenders"
    
    print(f"\n🔍 Recherche de '{produit}'...\n")
    
    try:
        page = scraper.fetch_amazon(produit)
        
        # Récupérer le HTML
        html_content = str(page)
        print(f"✅ Page chargée ({len(html_content)} caractères)")
        
        # Analyser la structure
        print("\n🔍 Analyse de la structure de la page...")
        
        # 1. Rechercher les éléments avec data-asin (identifiant Amazon)
        produits = page.css('[data-asin]')
        print(f"   - Éléments avec data-asin : {len(produits)}")
        
        # 2. Rechercher les éléments de titre
        titres = page.css('h2 a span::text').getall()
        print(f"   - Titres h2 : {len(titres)}")
        
        # 3. Rechercher les prix
        prix = page.css('.a-price .a-offscreen::text').getall()
        print(f"   - Prix trouvés : {len(prix)}")
        
        # 4. Rechercher les images
        images = page.css('img[src*="images"]')
        print(f"   - Images : {len(images)}")
        
        # Afficher les premiers résultats
        if titres:
            print("\n📦 Premiers produits trouvés :")
            for i, (titre, prix_item) in enumerate(zip(titres[:5], prix[:5]), 1):
                if titre and titre.strip():
                    print(f"\n   {i}. {titre.strip()[:60]}")
                    print(f"      Prix : {prix_item if prix_item else 'Non trouvé'}")
        
        # Sauvegarder le HTML pour analyse
        with open('amazon_debug.html', 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"\n💾 HTML sauvegardé dans 'amazon_debug.html'")
        print("   Ouvrez ce fichier dans un navigateur pour analyser la structure")
        
        return page
        
    except Exception as e:
        print(f"❌ Erreur : {e}")
        import traceback
        traceback.print_exc()
        return None

def test_fnac():
    """Test Fnac"""
    print("\n" + "=" * 60)
    print("🛒 TEST - FNAC")
    print("=" * 60)
    
    scraper = EcommerceScraper()
    produit = "galaxy defenders"
    
    print(f"\n🔍 Recherche de '{produit}'...\n")
    
    try:
        page = scraper.fetch_fnac(produit)
        html_content = str(page)
        print(f"✅ Page chargée ({len(html_content)} caractères)")
        
        # Analyser la structure
        print("\n🔍 Analyse de la structure de la page...")
        
        # Sélecteurs Fnac possibles
        produits = page.css('.product-item')
        print(f"   - Éléments .product-item : {len(produits)}")
        
        titres = page.css('.product-name a::text').getall()
        print(f"   - Titres : {len(titres)}")
        
        prix = page.css('.price .value::text').getall()
        print(f"   - Prix : {len(prix)}")
        
        if titres:
            print("\n📦 Premiers produits trouvés :")
            for i, titre in enumerate(titres[:3], 1):
                if titre and titre.strip():
                    print(f"   {i}. {titre.strip()[:60]}")
        
        return page
        
    except Exception as e:
        print(f"❌ Erreur Fnac : {e}")
        return None

def test_cdiscount():
    """Test CDiscount"""
    print("\n" + "=" * 60)
    print("🛒 TEST - CDISCOUNT")
    print("=" * 60)
    
    scraper = EcommerceScraper()
    produit = "galaxy defenders"
    
    print(f"\n🔍 Recherche de '{produit}'...\n")
    
    try:
        page = scraper.fetch_cdiscount(produit)
        html_content = str(page)
        print(f"✅ Page chargée ({len(html_content)} caractères)")
        
        # Analyser la structure
        print("\n🔍 Analyse de la structure de la page...")
        
        produits = page.css('.prdt')
        print(f"   - Éléments .prdt : {len(produits)}")
        
        titres = page.css('.prdtBTit a::text').getall()
        print(f"   - Titres : {len(titres)}")
        
        prix = page.css('.prdtPrice .price::text').getall()
        print(f"   - Prix : {len(prix)}")
        
        if titres:
            print("\n📦 Premiers produits trouvés :")
            for i, titre in enumerate(titres[:3], 1):
                if titre and titre.strip():
                    print(f"   {i}. {titre.strip()[:60]}")
        
        return page
        
    except Exception as e:
        print(f"❌ Erreur CDiscount : {e}")
        return None

def main():
    """Menu principal"""
    print("\n" + "=" * 60)
    print("🎮 TESTS DE SCRAPING")
    print("=" * 60)
    
    tests = [
        ("1", "Amazon", test_amazon_detailed),
        ("2", "Fnac", test_fnac),
        ("3", "CDiscount", test_cdiscount),
        ("4", "Tous les tests", lambda: [test_amazon_detailed(), test_fnac(), test_cdiscount()])
    ]
    
    print("\nChoisissez un site à tester :")
    for num, name, _ in tests:
        print(f"   {num}. {name}")
    print("   q. Quitter")
    
    choix = input("\n👉 Votre choix : ").strip()
    
    if choix.lower() == 'q':
        print("👋 Au revoir !")
        return
    
    for num, name, func in tests:
        if choix == num:
            print(f"\n🚀 Lancement du test : {name}\n")
            func()
            return
    
    print("❌ Choix invalide")

if __name__ == "__main__":
    main()