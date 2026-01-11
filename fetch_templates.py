
import requests
import json

url = "https://api.c1st.com/api/ticket-templates"
headers = {
    "Authorization": "Bearer 59dad428d300a6920fb5356bebe52f109162c528fb3418b3f693d16ee9cf97f57b72c498d31f135532fbdfdeebf420ad10761059ae7fcd51a1b02fa9de0325f2"
}

try:
    response = requests.get(url, headers=headers)
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(e)
