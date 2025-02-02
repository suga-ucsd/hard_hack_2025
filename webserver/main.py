from flask import Flask, Response, jsonify
import cv2
import os
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

def list_video_devices():
    """List all video devices in /dev/video*"""
    try:
        video_devices = [d for d in os.listdir('/dev') if d.startswith('video')]
        return sorted(video_devices)
    except:
        return []

def check_camera(device_index=0):
    """Check if specific camera index is available"""
    print(f"Attempting to open camera at index {device_index}")
    camera = cv2.VideoCapture(device_index)
    if camera.isOpened():
        # Try to actually read a frame to confirm it works
        ret, frame = camera.read()
        camera.release()
        return ret and frame is not None
    return False

def find_working_camera():
    """Find the first working camera index"""
    for idx in range(3):
        if check_camera(idx):
            return idx
    return None

def generate_frames(device_index=0):
    """Generate video frames for streaming"""
    camera = cv2.VideoCapture(device_index)
    if not camera.isOpened():
        raise RuntimeError(f"Could not open camera at index {device_index}")

    try:
        while True:
            success, frame = camera.read()
            if not success:
                print(f"Failed to read frame from camera {device_index}")
                break

            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    finally:
        camera.release()

@app.route('/video_feed')
def video_feed():
    """Stream video feed endpoint"""
    camera_idx = find_working_camera()
    if camera_idx is not None:
        return Response(
            generate_frames(camera_idx),
            mimetype='multipart/x-mixed-replace; boundary=frame'
        )

    return jsonify({
        "error": "No accessible camera found",
        "available_devices": list_video_devices(),
        "message": "No working camera found at indices 0-2"
    }), 503

@app.route('/video_feed/snapshot')
def video_snapshot():
    """Single frame snapshot endpoint"""
    camera_idx = find_working_camera()
    if camera_idx is not None:
        camera = cv2.VideoCapture(camera_idx)
        success, frame = camera.read()
        camera.release()

        if success:
            # Add timestamp to frame
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cv2.putText(
                frame,
                timestamp,
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 255, 255),
                2
            )

            ret, buffer = cv2.imencode('.jpg', frame)
            if ret:
                return Response(
                    buffer.tobytes(),
                    mimetype='image/jpeg',
                    headers={
                        'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0',
                        'Pragma': 'no-cache'
                    }
                )

    return jsonify({
        "error": "No accessible camera found",
        "available_devices": list_video_devices(),
        "message": "Could not capture snapshot"
    }), 503

@app.route('/camera_status')
def camera_status():
    """Check camera status endpoint"""
    devices = list_video_devices()
    working_cameras = [i for i in range(3) if check_camera(i)]

    return jsonify({
        "video_devices": devices,
        "working_cameras": working_cameras,
        "message": f"Found {len(devices)} video devices, {len(working_cameras)} working cameras"
    })

@app.route('/health')
def health_check():
    """Basic health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "camera_available": find_working_camera() is not None
    })

if __name__ == '__main__':
    print("\n=== Camera Server Diagnostic Information ===")
    print(f"Time: {datetime.now().isoformat()}")

    devices = list_video_devices()
    print(f"\nVideo devices found: {devices}")

    print("\nTesting camera indices 0-2:")
    for i in range(3):
        if check_camera(i):
            print(f"✅ Camera index {i} is working")
        else:
            print(f"❌ Camera index {i} is not working")

    print("\nStarting server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
