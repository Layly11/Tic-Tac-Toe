import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function History({ navigation }) {
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadGameHistory();
    });

    return unsubscribe;
  }, [navigation]);

  const loadGameHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('gameHistory');
      if (savedHistory) {
        setGameHistory(JSON.parse(savedHistory));
      } else {
        setGameHistory([]);
      }
    } catch (error) {
      console.error("Failed to load game history", error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('gameHistory');
      setGameHistory([]);
    } catch (error) {
      console.error("Failed to clear history", error);
    }
  };


  // const saveGameHistory = async (newGame) => {
  //   try {
  //     const updatedHistory = [...gameHistory, newGame];
  //     await AsyncStorage.setItem('gameHistory', JSON.stringify(updatedHistory));
  //     setGameHistory(updatedHistory); // Update local state
  //   } catch (error) {
  //     console.error("Failed to save game history", error);
  //   }
  // };

  const countWins = () => {
    let xWins = 0;
    let oWins = 0;

    gameHistory.forEach((game) => {
      if (game.result === "X wins!") {
        xWins += 1;
      } else if (game.result === "O wins!") {
        oWins += 1;
      }
    });

    return { xWins, oWins };
  };

  const { xWins, oWins } = countWins();

  const renderItem = ({ item, index }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyContent}>
        <Text style={styles.historyText}>{item.result}</Text>
        <Text style={styles.gridSize}>Grid: {item.gridSize}x{item.gridSize}</Text>
      </View>
      <TouchableOpacity
        style={styles.replayButton}
        onPress={() => navigation.navigate('Replay', { gameData: item, gameIndex: index })}
      >
        <Text style={styles.replayButtonText}>Replay</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
  <View style={{ flex: 1 }}>
    <Text style={styles.title}>Game History</Text>

    <View style={styles.winCounts}>
      <Text style={styles.winCountText}>X Wins: {xWins}</Text>
      <Text style={styles.winCountText}>O Wins: {oWins}</Text>
    </View>

    <FlatList
      data={gameHistory}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={<Text style={styles.emptyText}>No games played yet</Text>}
    />

    <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
      <Text style={styles.buttonText}>Clear History</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.buttonText}>Back</Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  winCounts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  winCountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyItem: {
    backgroundColor: 'lightgray',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridSize: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  replayButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  replayButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  backButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
});
