import threading
import time
import requests
from flask import Flask, Response
from flask_cors import CORS
# Configuration
SOURCE_URL = 'http://172.20.10.12:8082'  # Change this if your source is on a different port
TARGET_PORT = 8082                    # Port where our server will run

# Global variable to store the latest data
latest_data = "0"

app = Flask(__name__)
CORS(app)
def poll_source():
    """
    This function runs in a background thread.
    It polls the source endpoint every second and updates the global 'latest_data'.
    """
    global latest_data
    while True:
        try:
            # Make a GET request to the source
            response = requests.get(SOURCE_URL, timeout=5)
            if response.status_code == 200:
                latest_data = response.text
            else:
                latest_data = f"Error: Received status code {response.status_code}"
        except Exception as e:
            latest_data = f"Exception: {e}"
        # Wait for 1 second before polling again
        time.sleep(0.31)

@app.route('/', methods=['GET'])
def serve_data():
    """
    When a GET request is made to the root endpoint of our server,
    return the latest data.
    """
    # You can also set a specific mimetype if needed, e.g., text/plain or application/json.
    return Response(latest_data, mimetype='text/plain')

if __name__ == '__main__':
    # Start the polling thread as a daemon so it automatically exits when the main program does.
    polling_thread = threading.Thread(target=poll_source, daemon=True)
    polling_thread.start()
    
    # Start the Flask server on the specified port.
    app.run(host='0.0.0.0', port=8082)
