import pandas as pd

def nettoyer_prix(texte):
    if not texte:
        return None
    texte = texte.replace("€", "").replace(",", ".").strip()
    try:
        return float(texte)
    except ValueError:
        return None


def comparer_prix(liste_resultats):
    if not liste_resultats:
        return pd.DataFrame()

    df = pd.DataFrame(liste_resultats)
    df["prix_num"] = df["prix"].apply(nettoyer_prix)
    df["livraison_num"] = df["livraison"].apply(nettoyer_prix).fillna(0.0)
    df = df.dropna(subset=["prix_num"])
    df["prix_total"] = df["prix_num"] + df["livraison_num"]
    df = df.sort_values(by=["jeu", "prix_total"]).reset_index(drop=True)
    return df


def afficher_resultat(df):
    if df.empty:
        print("Aucun résultat exploitable.")
        return

    for jeu, groupe in df.groupby("jeu"):
        print(f"\n=== {jeu} ===")
        print(groupe[["site", "prix", "livraison", "prix_total", "stock"]].to_string(index=False))
        meilleur = groupe.iloc[0]
        print(f">>> Meilleur choix : {meilleur['site']} — {meilleur['prix_total']:.2f} € au total")