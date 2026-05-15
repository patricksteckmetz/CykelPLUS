import os
import requests
import json

url = "https://api.c1st.com/api/ticket-templates"
headers = {
    "Authorization": f"Bearer {os.environ.get('BIKEDESK_API_KEY')}"
}

try:
    response = requests.get(url, headers=headers)
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(e)
