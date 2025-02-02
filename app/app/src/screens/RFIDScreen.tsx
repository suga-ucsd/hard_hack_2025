import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const RFIDScreen = ({ onLogin }) => {
  const [rfidInput, setRfidInput] = useState('');
  const [message, setMessage] = useState('');

  const handleRFIDSubmit = async () => {
    try {
      const response = await fetch('http://172.20.10.2:7000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfidUUID: rfidInput }),
      });

      const data = await response.json();
      console.log("bruh", data)
      if (response.ok) {
        setMessage(data.message);
        onLogin(rfidInput);
      } else {
        setMessage(data.error || 'Error processing RFID');
      }

      setRfidInput('');
    } catch (error) {
      console.log('Error processing RFID:', error);
      setMessage('Server error');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter RFID UUID"
        value={rfidInput}
        onChangeText={setRfidInput}
        style={styles.input}
      />
      <Button title="Register/Login" onPress={handleRFIDSubmit} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
  input: {
    width: '80%',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  message: {
    marginTop: 10,
  },
});

export default RFIDScreen;
