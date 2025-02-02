#!/usr/bin/env python3

from flask import Flask, Response, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

EXTERNAL_PORT_8082 = "http://host.docker.internal:8082"  # Correct way to access outside from Docker

@app.route('/', methods=['GET'])
def proxy_8082():
    try:
        response = requests.get(EXTERNAL_PORT_8082, timeout=2)
        return Response(response.content, status=response.status_code, content_type=response.headers['Content-Type'])
    except requests.RequestException as e:
        return {"error": "Failed to fetch from 8082", "details": str(e)}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)  # New internal port
