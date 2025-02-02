#!/usr/bin/env python3

import cv2

def list_cameras():
    index = 2
    arr = []
    while True:
        cap = cv2.VideoCapture(index)
        if not cap.read()[0]:
            break
        else:
            arr.append(index)
        cap.release()
        index += 1
    return arr

print("Available camera indices:", list_cameras())
