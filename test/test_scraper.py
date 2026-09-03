# test/test_scraper.py
# -*- coding: utf-8 -*-

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scraper import EcommerceScraper
from extracteur import parse_amazon, parse_cdiscount
from analyse import comparer_prix, afficher_resultat

def test():
    print("=" * 60)
    print("🧪 TEST DE SCRAPING - PRODUITS GÉNÉRIQUES")
    print("=" * 60)
    
    produit = input("\n🔍 Produit à chercher : ")
    if not produit:
        produit = "galaxy defenders"
    
    resultats = []
    
    with EcommerceScraper() as scraper:
        print(f"\n📦 Amazon - '{produit}' :")
        html = scraper.fetch_amazon(produit)
        if html:
            data = parse_amazon(html, produit)
            resultats.extend(data)
            print(f"   ✅ {len(data)} produits extraits")
        
        print(f"\n📦 CDiscount - '{produit}' :")
        html = scraper.fetch_cdiscount(produit)
        if html:
            data = parse_cdiscount(html, produit)
            resultats.extend(data)
            print(f"   ✅ {len(data)} produits extraits")
    
    if resultats:
        df = comparer_prix(resultats)
        afficher_resultat(df)
    else:
        print("❌ Aucun résultat")

if __name__ == "__main__":
    test()