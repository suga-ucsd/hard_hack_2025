import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RFIDScreen from './screens/RFIDScreen';
import ImageScreen from './screens/ImageScreen';

const Stack = createStackNavigator();

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {loggedInUser ? (
          <Stack.Screen name="Profile">
            {() => <ImageScreen user={loggedInUser} onLogout={() => setLoggedInUser(null)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="RFID">
            {() => <RFIDScreen onLogin={setLoggedInUser} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
