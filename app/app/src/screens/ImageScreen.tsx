import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Image } from 'react-native';

const ImageScreen = ({ user, onLogout }) => {
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);

  const checkTrigger = async () => {
    try {
      const response = await fetch('http://localhost:8082');
      const text = await response.text();
      if (text.trim() === '1') {
        fetchImage();
      }
    } catch (err) {
      console.error('Error fetching trigger value:', err);
      setError('Failed to fetch trigger');
    }
  };

  const fetchImage = async () => {
    try {
      setError(null);
      const url = `http://localhost:7001/capture?t=${Date.now()}`;
      setImageUri(url);
    } catch (err) {
      console.error('Error fetching image:', err);
      setError('Failed to fetch image');
    }
  };

  useEffect(() => {
    const interval = setInterval(checkTrigger, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user}!</Text>

      <View style={styles.imageContainer}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <Button title="Capture Image" onPress={fetchImage} color="blue" />
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
