#!/usr/bin/env python3

from flask import Flask
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def random_bit():
    return str(random.randint(0, 1))

if __name__ == '__main__':
    print("Starting server on port 8082...")
    app.run(host='0.0.0.0', port=8082)
