# -*- coding: utf-8 -*-
import json
import os
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

HEADERS = {"User-Agent": "GameFinder/1.0 (comparateur-prix project)"}
CACHE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".image_cache.json")
_CACHE = {}
_WIKI_API = "https://en.wikipedia.org/w/api.php"

def _load_cache():
    global _CACHE
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                _CACHE = json.load(f)
        except Exception:
            _CACHE = {}
    return _CACHE

def _save_cache():
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(_CACHE, f, ensure_ascii=False, indent=2)
    except Exception:
        pass

def _request_with_retry(url, params, timeout=10, retries=2):
    for attempt in range(retries):
        try:
            r = requests.get(url, params=params, headers=HEADERS, timeout=timeout)
            if r.status_code == 200:
                return r.json()
            if r.status_code == 429:
                time.sleep(1)
                continue
        except requests.exceptions.RequestException:
            pass
        time.sleep(0.5)
    return None

def get_cached_image(game_name):
    """Retourne l'image depuis le cache sans faire d'appel API"""
    _load_cache()
    key = game_name.lower().strip()
    return _CACHE.get(key)

def _variants(game_name):
    name = game_name.strip()
    yield name
    import re
    base = re.sub(r'\s+[\dIVXLC:\-]+.*$', '', name).strip()
    if base and base.lower() != name.lower():
        yield base
    parts = name.split()
    if len(parts) > 2:
        yield ' '.join(parts[:2])

def fetch_image(game_name, force_refresh=False):
    if not game_name:
        return None
    _load_cache()
    key = game_name.lower().strip()
    if not force_refresh and key in _CACHE:
        return _CACHE[key]
    for variant in _variants(game_name):
        data = _request_with_retry(_WIKI_API, {
            "action": "query", "list": "search", "srsearch": variant,
            "format": "json", "srlimit": 3
        })
        if not data:
            continue
        results = data.get("query", {}).get("search", [])
        for r_ in results:
            title = r_.get("title")
            img_data = _request_with_retry(_WIKI_API, {
                "action": "query", "prop": "pageimages", "titles": title,
                "format": "json", "pithumbsize": 500
            })
            if img_data:
                pages = img_data.get("query", {}).get("pages", {})
                for pid, page in pages.items():
                    if "thumbnail" in page:
                        img_url = page["thumbnail"]["source"]
                        _CACHE[key] = img_url
                        _save_cache()
                        return img_url
    return None

def fetch_images_for_catalogue(games):
    results = {}
    def _fetch(game):
        img = fetch_image(game)
        return (game, img)
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(_fetch, game): game for game in games}
        for future in as_completed(futures):
            game, img = future.result()
            results[game] = img
    return results

if __name__ == "__main__":
    tests = ["Grand Theft Auto VI", "Super Mario", "Cyberpunk 2077", "Resident Evil"]
    for t in tests:
        img = fetch_image(t)
        print(t + ": " + str(img))