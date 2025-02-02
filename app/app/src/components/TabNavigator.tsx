import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RFIDScreen from '../screens/RFIDScreen';
import ImageScreen from '../screens/ImageScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="RFID"
        component={RFIDScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔖</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Images"
        component={ImageScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📸</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
