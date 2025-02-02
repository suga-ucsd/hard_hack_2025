#!/usr/bin/env python3

import requests
import time

def query_endpoint(url="http://localhost:8082"):
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print("Response:")
        print(response.text)
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to server: {e}")

if __name__ == "__main__":
    while True:
        query_endpoint()
        time.sleep(1)  # Wait 1 second between queries
        print("\n" + "-"*50 + "\n")  # Separator between responses
