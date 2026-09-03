# Démarrer le projet GameFinder sous Windows

Ce guide explique étape par étape comment installer et lancer le comparateur de prix GameFinder sur **Windows**.

---

## 1. Prérequis

Installer dans cet ordre :

1. **Python 3.10 ou plus récent**
   - Télécharge : <https://www.python.org/downloads/>
   - ⚠️ **Important lors de l'installation** : cocher la case
     **« Add Python to PATH »** en bas de la fenêtre d'installation.
   - Vérifier ensuite dans l'invite de commandes (`cmd`) :
     ```bat
     python --version
     ```

2. **Git** (optionnel, pour télécharger le projet)
   - Télécharge : <https://git-scm.com/download/win>

---

## 2. Récupérer le projet

Ouvre une **invite de commandes** (`cmd`) ou **PowerShell**, puis :

```bat
cd C:\Users\TonNom\Documents
git clone <URL_DU_DEPOT>
cd comparateur_prix
```

> Sans Git : tu peux aussi télécharger/extraire le projet en ZIP dans ce dossier.

---

## 3. Créer l'environnement virtuel (venv)

Toujours dans le dossier du projet :

```bat
python -m venv venv
```

Puis activer l'environnement :

```bat
venv\Scripts\activate
```

L'invite doit maintenant afficher `(venv)` au début de la ligne.

> Pour le désactiver plus tard : `deactivate`

---

## 4. Installer les dépendances

```bat
pip install -r requirements.txt
```

Les dépendances nécessaires (déjà listées dans `requirements.txt`) :
- `Flask` — le serveur web de l'interface
- `pandas` — traitement des données
- `beautifulsoup4` — lecture des pages des boutiques
- `requests` — téléchargement des pages

---

## 5. Lancer le projet (2 serveurs)

Le projet fonctionne avec **2 serveurs en parallèle** :

| Serveur | Port  | Rôle                                          |
|---------|-------|-----------------------------------------------|
| Flask   | 5000  | L'interface web (le site)                     |
| http.server | 8000 | Héberge les pages des **boutiques** (`boutiques/`) |

> ⚠️ Le scraper va chercher les boutiques sur `http://localhost:8000`, il faut donc
> ouvrir **deux fenêtres de terminal**.

### Fenêtre 1 — le serveur des boutiques (port 8000)

Il **faut être dans le dossier `boutiques`** pour que les pages se trouvent au bon endroit :

```bat
cd C:\Users\TonNom\Documents\comparateur_prix\boutiques
python -m http.server 8000
```

*Résultat attendu : `Serving HTTP on :: port 8000`*

### Fenêtre 2 — l'application Flask (port 5000)

```bat
cd C:\Users\TonNom\Documents\comparateur_prix
venv\Scripts\activate
python app.py
```

*Résultat attendu : `Running on http://127.0.0.1:5000`*

---

## 6. Ouvrir le site

Dans ton navigateur, va sur :

```
http://localhost:5000
```

Tu peux ensuite :
- parcourir le catalogue de jeux,
- rechercher un jeu pour comparer les prix,
- **cliquer sur un jeu / une offre** → cela ouvre automatiquement la page de la boutique correspondante (port 8000).

---

## 7. Résolution des problèmes

| Problème | Solution |
|----------|----------|
| `'python' n'est pas reconnu` | Python n'est pas dans le PATH : réinstalle en cochant **« Add Python to PATH »**, ou relance `cmd`. |
| `(venv)` ne s'active pas | Vérifie que tu es bien dans le dossier du projet avec `venv\Scripts\activate`. |
| Le site s'ouvre mais la recherche ne trouve rien | Le serveur des boutiques (port 8000) n'est **pas** lancé ou est lancé depuis le mauvais dossier. Relance la **Fenêtre 1** depuis `boutiques/`. |
| Erreur 404 en cliquant sur une offre | Le serveur 8000 est down, ou il a été lancé en dehors du dossier `boutiques`. |
| Port déjà utilisé (`Address already in use`) | Un autre programme occupe le port : change le port (ex. `python -m http.server 8001`) **et** modifie `scraper.py` ainsi que `script.js` en conséquence. |
| `pip` lent | Facultatif : utilise un miroir `pip install -r requirements.txt -i https://pypi.org/simple`. |

---

## 8. Résumé rapide (à copier-coller)

```bat
:: Fenêtre 1
cd comparateur_prix\boutiques
python -m http.server 8000
```

```bat
:: Fenêtre 2
cd comparateur_prix
venv\Scripts\activate
python app.py
```

→ Ouvre **http://localhost:5000**
