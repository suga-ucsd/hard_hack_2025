from flask import Flask, Response
from flask_cors import CORS
import cv2

app = Flask(__name__)
CORS(app)

@app.route('/capture')
def capture():
    camera = cv2.VideoCapture(0)  # Open the webcam
    success, frame = camera.read()
    camera.release()

    if not success:
        return "Failed to capture image", 500

    _, buffer = cv2.imencode('.jpg', frame)
    response = Response(buffer.tobytes(), mimetype='image/jpeg')

    # Set CORS headers manually to ensure React Native can access the image
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7001, debug=True)
