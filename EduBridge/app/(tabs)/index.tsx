import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens here
import HomeScreen from '../../components/Pages/HomeScreen';  // Update the import based on your folder structure
import DetailsScreen from '../../components/Pages/DetailsScreen';   // Similarly, add DetailsScreen or other screens

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}
