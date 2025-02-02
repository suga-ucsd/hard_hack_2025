# Use Node.js for React Native app
FROM node:18-bullseye AS app

# Set working directory
WORKDIR /app

# Copy React Native app files
COPY app/package.json app/package-lock.json ./
RUN npm install  # Use npm instead of yarn

COPY app ./

# Install Python for backend services
RUN apt update && apt install -y python3 python3-pip
WORKDIR /webserver
COPY webserver/requirements.txt ./
RUN pip3 install -r requirements.txt

# Copy Python files
COPY webserver .

# Expose necessary ports
EXPOSE 8081 7000 7001 5001

# Start all services
CMD ["sh", "-c", "npm start --prefix /app & python3 /webserver/server.py & python3 /webserver/camera_server.py & python3 /webserver/cors_proxy.py"]
