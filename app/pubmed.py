from functools import lru_cache
import requests
import time
from threading import Lock

from config.pubmed_config import PUBMED_CONFIG

class RateLimiter:
    def __init__(self):
        self.session = requests.Session()
        self.last_request_time = 0
        self.lock = Lock()
        self.min_interval = PUBMED_CONFIG["rate_limit"]["min_interval"]

    def get(self, *args, **kwargs):
        with self.lock:
            current_time = time.time()
            time_since_last_request = current_time - self.last_request_time
            
            if time_since_last_request < self.min_interval:
                time.sleep(self.min_interval - time_since_last_request)
            
            response = self.session.get(*args, **kwargs)
            self.last_request_time = time.time()
            
            return response

# Crear una instancia global del rate limiter
pubmed_client = RateLimiter()

@lru_cache(maxsize=PUBMED_CONFIG["rate_limit"]["cache_size"])
def fetch_pubmed_articles(disease_name, max_results=PUBMED_CONFIG["search_params"]["max_results"]):
    """
    Fetches the latest PubMed articles for a given disease.
    """
    base_url = PUBMED_CONFIG["base_urls"]["search"]
    params = {
        **PUBMED_CONFIG["default_params"],
        **PUBMED_CONFIG["search_params"],
        "term": disease_name,
        "retmax": max_results
    }

    try:
        response = pubmed_client.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()
        
        article_ids = data.get("esearchresult", {}).get("idlist", [])
        if not article_ids:
            return []
            
        return fetch_multiple_article_details(article_ids)

    except requests.RequestException as e:
        print(f"Error fetching articles: {e}")
        return []

def fetch_multiple_article_details(article_ids):
    """
    Fetches details for multiple articles in a single request.
    """
    base_url = PUBMED_CONFIG["base_urls"]["summary"]
    params = {
        **PUBMED_CONFIG["default_params"],  # solo db y retmode
        "id": ",".join(article_ids)
    }

    try:
        response = pubmed_client.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()
        
        articles = []
        results = data.get("result", {})
        
        for article_id in article_ids:
            summary = results.get(article_id, {})
            if summary:
                # Procesar los autores
                authors = summary.get("authors", [])
                author_names = [author.get("name", "") for author in authors]
                
                articles.append({
                    "title": summary.get("title", "No title available"),
                    "authors": ", ".join(author_names) if author_names else "No authors available",
                    "date": summary.get("pubdate", "No date available"),
                    "journal": summary.get("source", "No journal available"),
                    "volume": summary.get("volume", "N/A"),
                    "issue": summary.get("issue", "N/A"),
                    "pages": summary.get("pages", "N/A"),
                    "doi": summary.get("elocationid", "No DOI available"),
                    "abstract": summary.get("abstract", "No abstract available"),
                    "keywords": summary.get("keywords", []),
                    "link": f"https://pubmed.ncbi.nlm.nih.gov/{article_id}/"
                })
        
        return articles

    except requests.RequestException as e:
        print(f"Error fetching article details: {e}")
        return []

def clear_cache():
    """
    Clears the article cache.
    """
    fetch_pubmed_articles.cache_clear()