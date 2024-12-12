PUBMED_CONFIG = {
    "base_urls": {
        "search": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
        "summary": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
    },
    "default_params": {
        "db": "pubmed",
        "retmode": "json"
    },
    "search_params": {
        "sort": "pub+date", # Use "-pub+date" for older articles first
        "max_results": 12
    },
    "rate_limit": {
        "min_interval": 1,
        "cache_size": 100
    }
}