# -*- coding: utf-8 -*-
"""
Module SCRAPING — Personne A (Requests)
Rôle : envoyer une requête à chaque site et récupérer le HTML brut.

Format de sortie attendu :
    {"SiteA": "<html>...</html>", "SiteB": "<html>...</html>", ...}

IMPORTANT : ce module scrape les fausses boutiques locales (dossier boutiques/)
servies par un petit serveur HTTP local. Avant de lancer le programme, ouvrez
un terminal séparé et tapez :

    cd boutiques
    python3 -m http.server 8000

Laissez ce terminal ouvert, puis lancez main.py dans un autre terminal.

Pour utiliser de vrais sites plus tard, il suffira de remplacer les URLs
dans SITES par les vraies URLs de recherche.
"""

import requests

# Sites cibles : nom -> URL. Pour l'instant, nos fausses boutiques locales.
SITES = {
    "SiteA": "http://localhost:8000/boutique_a.html",
    "SiteB": "http://localhost:8000/boutique_b.html",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}


def fetch_page(site_nom, url, timeout=5):
    """
    Envoie une requête HTTP à un site et retourne le HTML brut.
    Retourne None en cas d'erreur (site indisponible, timeout, etc.)
    """
    try:
        reponse = requests.get(url, headers=HEADERS, timeout=timeout)
        reponse.raise_for_status()
        return reponse.text
    except requests.exceptions.RequestException as erreur:
        print(f"[Scraper] Erreur sur {site_nom} : {erreur}")
        return None


def fetch_all_sites(produit):
    """
    Interroge tous les sites de SITES.
    NB : pour l'instant nos boutiques factices contiennent toujours le même
    produit ("Casque audio X200"), donc 'produit' n'est pas encore utilisé
    pour construire l'URL. Ce sera le cas quand on passera à de vrais sites
    avec une vraie recherche.
    """
    resultats = {}
    for site_nom, url in SITES.items():
        html = fetch_page(site_nom, url)
        resultats[site_nom] = html
    return resultats


if __name__ == "__main__":
    # Test rapide du module seul (le serveur local doit déjà tourner)
    resultats = fetch_all_sites("casque audio")
    for site, html in resultats.items():
        statut = "OK" if html else "ÉCHEC"
        print(f"{site} : {statut}")
        if html:
            print(html[:200], "...\n")