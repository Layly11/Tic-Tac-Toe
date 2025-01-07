// StackNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Choice from "../screens/Choice";
import Game from "../screens/Game";
import History from "../screens/History";
import Replay from "../screens/Replay";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      <Stack.Screen name="Choice" component={Choice} options={{ headerShown: false }}/>
      <Stack.Screen name="Game" component={Game} options={{ headerShown: false }}/>
      <Stack.Screen name="History" component={History} options={{ headerShown: false }}/>
      <Stack.Screen name="Replay" component={Replay} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default StackNavigator;
