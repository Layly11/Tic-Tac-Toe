import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Choice() {
  const navigation = useNavigation();
  const [gridSize, setGridSize] = useState(3);

  const handleSelectGrid = (size) => {
    setGridSize(size);
    navigation.navigate("Game", { gridSize: size });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Grid Size</Text>
          <Text style={styles.subtitle}>Select your preferred board size</Text>
        </View>

        <View style={styles.gridButtonsContainer}>
          {[3, 4, 5].map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.gridButton,
                gridSize === size && styles.selectedButton
              ]}
              onPress={() => handleSelectGrid(size)}
            >
              <Text style={[
                styles.gridButtonText,
                gridSize === size && styles.selectedButtonText
              ]}>
                {size} x {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 40,
  },
  gridButtonsContainer: {
    width: "100%",
    maxWidth: 300,
  },
  gridButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  selectedButton: {
    backgroundColor: "#3498db",
    borderColor: "#2980b9",
  },
  gridButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  selectedButtonText: {
    color: "#fff",
  },
  backButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    maxWidth: 300,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});