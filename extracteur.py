from bs4 import BeautifulSoup


def parse_gamehub(html, produit=None):
    soup = BeautifulSoup(html, "html.parser")
    resultats = []
    for carte in soup.select(".jeu"):
        titre = carte.select_one(".titre-jeu")
        prix = carte.select_one(".prix")
        livraison = carte.select_one(".frais-port")
        dispo = carte.select_one(".dispo")
        
        titre_texte = titre.text.strip() if titre else None
        
        # Filtrer par produit si spécifié
        if produit and produit.lower() not in (titre_texte or "").lower():
            continue
            
        resultats.append({
            "site": "GameHub",
            "jeu": titre_texte,
            "prix": prix.text.strip() if prix else None,
            "livraison": livraison.text.replace("Livraison :", "").strip() if livraison else "0,00 €",
            "stock": dispo.text.strip() if dispo else "inconnu",
        })
    return resultats


def parse_pixelstore(html, produit=None):
    soup = BeautifulSoup(html, "html.parser")
    resultats = []
    for carte in soup.select(".game-card"):
        nom = carte.select_one(".game-name")
        prix = carte.select_one(".game-price")
        livraison = carte.select_one(".shipping")
        statut = carte.select_one(".status")
        
        nom_texte = nom.text.strip() if nom else None
        
        # Filtrer par produit si spécifié
        if produit and produit.lower() not in (nom_texte or "").lower():
            continue
            
        resultats.append({
            "site": "PixelStore",
            "jeu": nom_texte,
            "prix": prix.text.strip() if prix else None,
            "livraison": livraison.text.replace("Frais de port :", "").strip() if livraison else "0,00 €",
            "stock": statut.text.strip() if statut else "inconnu",
        })
    return resultats


PARSERS = {"GameHub": parse_gamehub, "PixelStore": parse_pixelstore}


def extraire_toutes(html_par_site, produit=None):
    resultats = []
    for site, html in html_par_site.items():
        if html and site in PARSERS:
            resultats.extend(PARSERS[site](html, produit))
    return resultats