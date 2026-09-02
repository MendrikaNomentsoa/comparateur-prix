import requests

# Modifier pour pointer vers vos fichiers HTML
SITES = {
    "GameHub": "http://localhost:8000/boutique_gamehub.html",
    "PixelStore": "http://localhost:8000/boutique_pixelstore.html",
}

HEADERS = {"User-Agent": "Mozilla/5.0"}


def fetch_page(url, timeout=5):
    try:
        r = requests.get(url, headers=HEADERS, timeout=timeout)
        r.raise_for_status()
        r.encoding = "utf-8"
        return r.text
    except requests.exceptions.RequestException as e:
        print(f"Erreur : {e}")
        return None


def fetch_all_sites(produit=None):
    # Le produit est passé mais pas utilisé pour l'instant
    return {nom: fetch_page(url) for nom, url in SITES.items()}


if __name__ == "__main__":
    for nom, html in fetch_all_sites().items():
        print(nom, ":", "OK" if html else "ÉCHEC")