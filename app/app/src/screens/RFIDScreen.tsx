import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import RFIDDatabase from '../firebase/rfidDatabase';

const RFIDScreen = ({ onLogin }) => {
  const [rfidInput, setRfidInput] = useState('');
  const [message, setMessage] = useState('');

  const handleRFIDSubmit = async () => {
    try {
      const user = await RFIDDatabase.getUser(rfidInput);
      if (user) {
        setMessage('Login successful');
        onLogin(user.rfidUUID); // Navigate to profile with user UUID
      } else {
        await RFIDDatabase.registerUser(rfidInput);
        setMessage('New user registered');
        onLogin(rfidInput);
      }
      setRfidInput('');
    } catch (error) {
      console.error('Error processing RFID:', error);
      setMessage('Error processing RFID');
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
