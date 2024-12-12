import requests

def fetch_pubmed_articles(disease_name, max_results=5):
    """
    Fetches the latest PubMed articles for a given disease.

    Args:
        disease_name (str): The name of the disease to search for.
        max_results (int): Maximum number of articles to fetch. Default is 5.

    Returns:
        list: A list of dictionaries containing article details (title, date, link).
    """
    base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    params = {
        "db": "pubmed",
        "term": disease_name,
        "retmax": max_results,
        "sort": "pub+date",
        "retmode": "json"
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()

        # Parse results
        article_ids = data.get("esearchresult", {}).get("idlist", [])
        articles = []

        for article_id in article_ids:
            details = fetch_article_details(article_id)
            if details:
                articles.append(details)

        return articles

    except requests.RequestException as e:
        print(f"Error fetching articles: {e}")
        return []

def fetch_article_details(article_id):
    """
    Fetches detailed information for a specific PubMed article.

    Args:
        article_id (str): The PubMed article ID.

    Returns:
        dict: A dictionary containing article details (title, date, link).
    """
    base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
    params = {
        "db": "pubmed",
        "id": article_id,
        "retmode": "json"
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()

        summary = data.get("result", {}).get(article_id, {})
        return {
            "title": summary.get("title", "No title available"),
            "date": summary.get("pubdate", "No date available"),
            "link": f"https://pubmed.ncbi.nlm.nih.gov/{article_id}/"
        }
    except requests.RequestException as e:
        print(f"Error fetching article details: {e}")
        return None
