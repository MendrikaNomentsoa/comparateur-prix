#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scraper import EcommerceScraper
from extracteur import parse_amazon, parse_fnac, parse_cdiscount
from analyse import comparer_prix, afficher_resultat

def test_complet():
    print("=" * 60)
    print("🧪 TEST COMPLET : Extraction + Analyse")
    print("=" * 60)
    
    produit = "galaxy defenders"
    scraper = EcommerceScraper()
    resultats = []
    
    print(f"\n🔍 Recherche de '{produit}'...\n")
    
    # Amazon
    print("📦 Amazon :")
    html = scraper.fetch_amazon(produit)
    if html:
        data = parse_amazon(html, produit)
        resultats.extend(data)
        print(f"   ✅ {len(data)} produits trouvés")
    
    # Fnac
    print("\n📦 Fnac :")
    html = scraper.fetch_fnac(produit)
    if html:
        data = parse_fnac(html, produit)
        resultats.extend(data)
        print(f"   ✅ {len(data)} produits trouvés")
    
    # CDiscount
    print("\n📦 CDiscount :")
    html = scraper.fetch_cdiscount(produit)
    if html:
        data = parse_cdiscount(html, produit)
        resultats.extend(data)
        print(f"   ✅ {len(data)} produits trouvés")
    
    print(f"\n📊 {len(resultats)} résultats au total")
    
    if resultats:
        df = comparer_prix(resultats)
        afficher_resultat(df)
    else:
        print("❌ Aucun résultat")

if __name__ == "__main__":
    test_complet()