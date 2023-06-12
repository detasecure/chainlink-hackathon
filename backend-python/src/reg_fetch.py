import requests

def get_api_response(api_url):
    json_response = {}
    json_response[api_url] = {}
    try:
        response = requests.get(api_url)
        if response.status_code == 200:
            json_response[api_url]['response'] = response.json()
        else:
            json_response[api_url]['error'] = f"API request failed for URL {api_url} with status code: {response.status_code}"

    except Exception as e:
        print("###############",e)
        json_response[api_url]['error'] = f"API request failed for URL {api_url} with erroe: {e}"

    return json_response

def consolidate_api_responses(api_responses):
    consolidated_response = {}
    for api_response in api_responses:
        for key, value in api_response.items():
            if key not in consolidated_response:
                consolidated_response[key] = []
            consolidated_response[key].append(value)
    return consolidated_response

def main():
    api_urls = [
        "https://api.coindesk.com/v1/regulatory-tracker/updates",
        "https://api.coinmarketcap.com/regulatory-news/",
        "https://api.theblockcrypto.com/regulatory-news/",
        "https://api.cryptocompare.com/regulatory-news/",
        "https://api.ripple.com/regulatory-tracker/updates"
    ]

    API_urls = [
        "https://api.coindesk.com/v1/regulatory-tracker/updates?limit=10",
        "https://api.coinmarketcap.com/regulatory-news?limit=10",
        "https://api.theblockcrypto.com/regulatory-news?limit=10",
        "https://api.cryptocompare.com/regulatory-news?limit=10",
        "https://api.ripple.com/regulatory-tracker/updates?limit=10"
    ]

    api_responses = []
    for api_url in api_urls:
        print(f"Fetching data from {api_url}")
        api_response = get_api_response(api_url)
        print(api_response)
        api_responses.append(api_response)

    consolidated_response = consolidate_api_responses(api_responses)

    print(consolidated_response)

if __name__ == "__main__":
    main()
