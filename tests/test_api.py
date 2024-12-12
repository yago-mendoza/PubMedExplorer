import requests

def test_search_api():
    url = "http://127.0.0.1:5000/search"
    params = {"disease": "diabetes"}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        print("Response JSON:", response.json())
    else:
        print("Error:", response.status_code)

if __name__ == "__main__":
    test_search_api()
