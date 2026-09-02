# -*- coding: utf-8 -*-
"""
PROGRAMME PRINCIPAL — assemble les 3 modules en une seule application.
Usage : python main.py
"""

from scraper import fetch_all_sites
from extracteur import extraire_toutes
from analyse import comparer_prix, afficher_resultat


def main():
    produit = input("Quel produit cherchez-vous ? ")

    html_par_site = fetch_all_sites(produit)      
    donnees = extraire_toutes(html_par_site)      
    resultat = comparer_prix(donnees, produit)    # Passage du produit
    afficher_resultat(resultat)                   


if __name__ == "__main__":
    main()