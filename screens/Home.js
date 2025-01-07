import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Tic Tac Toe</Text>
          <Text style={styles.subtitle}>Classic Game</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => navigation.navigate("Choice")}
          >
            <Text style={styles.playButtonText}>Play Game</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.historyButton}
            onPress={() => navigation.navigate("History")}
          >
            <Text style={styles.buttonText}>View History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 24,
    color: '#7f8c8d',
    marginTop: 5,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  playButton: {
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#9b59b6',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});