# -*- coding: utf-8 -*-
"""
Module EXTRACTION — Personne B (BeautifulSoup)
Rôle : analyser le HTML de chaque site et en extraire les infos utiles.

Format d'entrée : {"SiteA": "<html>...</html>", ...} (reçu de scraper.py)
Format de sortie attendu : liste de dictionnaires
    [
        {"site": "SiteA", "produit": "...", "prix": "...", "livraison": "...", "stock": "..."},
        ...
    ]
"""


def extraire_toutes(html_par_site):
    """
    TODO (Personne B) :
    - pour chaque site, analyser le HTML avec BeautifulSoup
    - extraire nom, prix, frais de livraison, disponibilité
    - retourner une liste de dictionnaires au format ci-dessus
    """
    pass