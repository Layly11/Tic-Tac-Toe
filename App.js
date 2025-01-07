// App.js
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";  // Ensure this import
import StackNavigator from "./navigation/StackNavigation"
import Home from './screens/Home'; 


export default function App() {
  return (
    <NavigationContainer>
    <StackNavigator /> 
    </NavigationContainer>
  )
}
