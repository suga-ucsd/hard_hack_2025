import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, StyleSheet, Image, Platform } from 'react-native';

const ImageScreen = ({ user, onLogout }) => {
  const [imageMode, setImageMode] = useState('snapshot'); // 'snapshot' or 'stream'
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState(0);
  const streamRef = useRef(null);

  const baseUrl = 'http://localhost:5000';

  const fetchSnapshot = async () => {
    try {
      setError(null);
      const url = `${baseUrl}/video_feed/snapshot?t=${Date.now()}`;
      setImageUri(url);
      setTimestamp(Date.now());
    } catch (error) {
      setError('Failed to fetch snapshot');
      console.error('Error fetching snapshot:', error);
    }
  };

  const startStream = () => {
    setError(null);
    setImageUri(`${baseUrl}/video_feed`);
    setImageMode('stream');
  };

  const stopStream = () => {
    setImageMode('snapshot');
    setImageUri(null);
  };

  // Auto-refresh snapshot mode
  useEffect(() => {
    let interval;
    if (imageMode === 'snapshot') {
      fetchSnapshot(); // Initial fetch
      interval = setInterval(fetchSnapshot, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [imageMode]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user}!</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={imageMode === 'snapshot' ? 'Switch to Stream' : 'Switch to Snapshot'}
          onPress={() => imageMode === 'snapshot' ? startStream() : stopStream()}
        />
      </View>

      <View style={styles.imageContainer}>
        {imageUri && (
          <Image
            source={{
              uri: imageUri,
              headers: { 'Cache-Control': 'no-cache' },
              key: imageMode === 'snapshot' ? timestamp.toString() : 'stream'
            }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <Button title="Logout" onPress={onLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  imageContainer: {
    width: 300,
    height: 300,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default ImageScreen;
