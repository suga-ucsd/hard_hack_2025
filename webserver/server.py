from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

CSV_FILE = "data.csv"

# Ensure CSV file exists with headers
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["rfidUUID"])

def check_uuid_exists(uuid):
    """Check if the given UUID already exists in the CSV file."""
    with open(CSV_FILE, mode='r', newline='') as file:
        reader = csv.reader(file)
        next(reader, None)  # Skip header
        for row in reader:
            if row and row[0] == uuid:
                return True
    return False

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    rfid_uuid = data.get("rfidUUID")

    if not rfid_uuid:
        return jsonify({"error": "Missing RFID UUID"}), 400

    if check_uuid_exists(rfid_uuid):
        return jsonify({"message": "Login successful", "rfidUUID": rfid_uuid})

    with open(CSV_FILE, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([rfid_uuid])

    return jsonify({"message": "New user registered", "rfidUUID": rfid_uuid})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7000, debug=True)  # Bind to all interfaces for Docker
