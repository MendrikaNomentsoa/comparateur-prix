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

    html_par_site = fetch_all_sites(produit)      # Personne A
    donnees = extraire_toutes(html_par_site)      # Personne B
    resultat = comparer_prix(donnees)             # Personne C
    afficher_resultat(resultat)                   # Personne C


if __name__ == "__main__":
    main()