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

#PARSEUR POUR GAMESTORE
def parse_gamestore(html, produit=None):
    soup = BeautifulSoup(html, "html.parser")
    resultats = []
    
    for carte in soup.select(".game-card"):
        # Titre
        titre_elem = carte.select_one(".game-title")
        titre_texte = titre_elem.text.strip() if titre_elem else None
        
        if produit and produit.lower() not in (titre_texte or "").lower():
            continue
        
        # Prix (peut contenir un ancien prix)
        prix_elem = carte.select_one(".game-price")
        prix_texte = prix_elem.text.strip() if prix_elem else None
        if prix_texte and "€" in prix_texte:
            prix_texte = prix_texte.split("€")[0].strip() + " €"
        
        # Livraison
        shipping_elem = carte.select_one(".shipping-info")
        shipping_texte = "0,00 €"
        if shipping_elem:
            shipping_text = shipping_elem.text.strip()
            if "GRATUITE" in shipping_text:
                shipping_texte = "0,00 €"
            else:
                import re
                match = re.search(r'(\d+[,.]\d{2})\s*€', shipping_text)
                if match:
                    shipping_texte = match.group(1).replace(".", ",") + " €"
        
        # Stock
        stock_elem = carte.select_one(".stock-status")
        stock_texte = "inconnu"
        if stock_elem:
            stock_text = stock_elem.text.strip()
            if "En stock" in stock_text:
                stock_texte = "En stock"
            elif "Dernières pièces" in stock_text:
                stock_texte = "Dernières pièces"
            elif "Rupture" in stock_text:
                stock_texte = "Rupture de stock"
        
        resultats.append({
            "site": "GameStore",
            "jeu": titre_texte,
            "prix": prix_texte,
            "livraison": shipping_texte,
            "stock": stock_texte,
        })
    
    return resultats

PARSERS = {
    "GameHub": parse_gamehub,
    "PixelStore": parse_pixelstore,
    "GameStore": parse_gamestore,  
}

def extraire_toutes(html_par_site, produit=None):
    resultats = []
    for site, html in html_par_site.items():
        if html and site in PARSERS:
            resultats.extend(PARSERS[site](html, produit))
    return resultats