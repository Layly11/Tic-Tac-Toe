import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";


export default function Game() {
  const route = useRoute();
  const { gridSize } = route.params;
  const navigation = useNavigation();
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [isAIMode, setIsAIMode] = useState(false); // เปิด/ปิด AI
  const [moveHistory, setMoveHistory] = useState([]); // History of moves
  const [gameHistory, setGameHistory] = useState([]); // History of game results

  useEffect(() => {
    resetBoard();
    loadGameHistory();
  }, [gridSize]);

  useEffect(() => {
    if (winner) {
      saveGameResult();
    }
  }, [winner, moveHistory]);
  
  const saveGameResult = async () => {
    try {
      const currentHistory = await AsyncStorage.getItem('gameHistory');
      const parsedHistory = currentHistory ? JSON.parse(currentHistory) : [];
      const gameResult = {
        result: winner === 'draw' ? "It's a Draw!" : `${winner} wins!`,
        gridSize,
        moves: moveHistory
      };
      await saveGameHistory([...parsedHistory, gameResult]);
    } catch (error) {
      console.error("Failed to save game history", error);
    }
  };

  const loadGameHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('gameHistory');
      if (savedHistory) {
        setGameHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load game history", error);
    }
  };
  
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear(); // ลบข้อมูลทั้งหมดจาก AsyncStorage
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };
 const saveGameHistory = async (history) => {
  try {
    await AsyncStorage.setItem('gameHistory', JSON.stringify(history));
    console.log("Game history saved successfully", history);
  } catch (error) {
    console.error("Failed to save game history", error);
  }
};

  const resetBoard = () => {
    setBoard(Array(gridSize).fill().map(() => Array(gridSize).fill(null)));
    setCurrentPlayer('X');
    setWinner(null);
    setMoveHistory([]); // Reset move history
  };


  const handlePress = (row, col) => {
    if (board[row][col] || winner) return;

    const newBoard = board.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? currentPlayer : cell))
    );
    setBoard(newBoard);

    // บันทึกการเคลื่อนไหวของผู้เล่น X
    setMoveHistory((prev) => {
      const newMoveHistory = [...prev, { player: currentPlayer, row, col }];
      console.log("Move History after X move: ", newMoveHistory); // ตรวจสอบการอัพเดต
      return newMoveHistory;
    });

    const isWinner = checkWinner(newBoard, currentPlayer);
    if (isWinner) return;

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    if (isAIMode && nextPlayer === 'O' && !winner) {
      setTimeout(() => makeAIMove(newBoard), 500);
    }
};

const makeAIMove = (currentBoard) => {
    if (winner) return; // หยุด AI ถ้ามีผู้ชนะแล้ว

    const bestMove = findBestMove(currentBoard);
    if (bestMove) {
      const { row, col } = bestMove;
      const newBoard = currentBoard.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? 'O' : cell))
      );

      // เพิ่มการเล่นของ AI ลงใน moveHistory ทันที
      setMoveHistory((prev) => {
        const newMoveHistory = [...prev, { player: 'O', row, col }];
        console.log("Move History after AI move: ", newMoveHistory); // ตรวจสอบการอัพเดต
        return newMoveHistory;
      });

      setBoard(newBoard);

      // เช็กผู้ชนะหลังจากอัปเดต moveHistory
      const isWinner = checkWinner(newBoard, 'O');
      if (isWinner) {
        setWinner('O'); // ตั้งค่า winner
        return;
      }

      setCurrentPlayer('X'); // กลับไปที่ผู้เล่น
    }
};



  const findBestMove = (board) => {
    let bestScore = -Infinity;
    let move = null;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (!board[row][col]) {
          board[row][col] = 'O';
          const score = minimax(board, 0, false);
          board[row][col] = null; // ย้อนกลับ

          if (score > bestScore) {
            bestScore = score;
            move = { row, col };
          }
        }
      }
    }
    return move;
  };

  const minimax = (board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
    const scores = { X: -10, O: 10, draw: 0 };
    const result = getWinner(board);
    if (result) {
      return scores[result] - depth;
    }

    if (depth >= 4) {
      return 0; // หยุดเมื่อถึงความลึกที่กำหนด
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (!board[row][col]) {
            board[row][col] = 'O';
            const score = minimax(board, depth + 1, false, alpha, beta);
            board[row][col] = null;
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (!board[row][col]) {
            board[row][col] = 'X';
            const score = minimax(board, depth + 1, true, alpha, beta);
            board[row][col] = null;
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
          }
        }
      }
      return bestScore;
    }
  };

  const getWinner = (board) => {
    for (let row of board) {
      if (row.every((cell) => cell === 'X')) return 'X';
      if (row.every((cell) => cell === 'O')) return 'O';
    }

    for (let col = 0; col < gridSize; col++) {
      const column = board.map((row) => row[col]);
      if (column.every((cell) => cell === 'X')) return 'X';
      if (column.every((cell) => cell === 'O')) return 'O';
    }

    const mainDiagonal = board.map((row, i) => row[i]);
    const antiDiagonal = board.map((row, i) => row[gridSize - 1 - i]);
    if (mainDiagonal.every((cell) => cell === 'X')) return 'X';
    if (mainDiagonal.every((cell) => cell === 'O')) return 'O';
    if (antiDiagonal.every((cell) => cell === 'X')) return 'X';
    if (antiDiagonal.every((cell) => cell === 'O')) return 'O';

    if (board.every((row) => row.every((cell) => cell !== null))) {
      return 'draw'; // ไม่มีที่ว่างและไม่มีผู้ชนะ
    }

    return null; // ยังไม่มีผู้ชนะ
  };

  const checkWinner = (board, player) => {
    const winner = getWinner(board);
    if (winner) {
      declareWinner(winner);
      return true;
    }
    return false;
  };

  const declareWinner = async (player) => {
    if (winner) return;
  
    setWinner(player);
    const result = player === 'draw' ? "It's a Draw!" : `${player} wins!`;
    Alert.alert("Game Over", result);
    try {
      const currentHistory = await AsyncStorage.getItem('gameHistory');
      const parsedHistory = currentHistory ? JSON.parse(currentHistory) : [];
      const gameResult = {
        result,
        gridSize,
        moves: moveHistory // บันทึกการเคลื่อนไหวทั้งหมดในเกม
      };
      await AsyncStorage.setItem('gameHistory', JSON.stringify([...parsedHistory, gameResult]));
    } catch (error) {
      console.error("Failed to save game history", error);
    }
   console.log('สรุปmove history', moveHistory)
    setTimeout(() => {
      resetBoard();
    }, 2000);
  };
  

  const renderCell = (row, col) => (
    <TouchableOpacity
      key={`${row}-${col}`}
      style={[styles.cell, { width: 300 / gridSize, height: 300 / gridSize }]}
      onPress={() => handlePress(row, col)}
    >
      <Text style={styles.cellText}>{board[row][col] ?? ''}</Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Tic Tac Toe</Text>
            <Text style={styles.subtitle}>Grid Size: {gridSize} x {gridSize}</Text>
          </View>

          <View style={styles.gameContainer}>
            <View style={styles.grid}>
              {board.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((_, colIndex) => (
                    <TouchableOpacity
                      key={`${rowIndex}-${colIndex}`}
                      style={[
                        styles.cell,
                        { width: 300 / gridSize, height: 300 / gridSize },
                        board[rowIndex][colIndex] && styles.cellFilled
                      ]}
                      onPress={() => handlePress(rowIndex, colIndex)}
                    >
                      <Text style={[
                        styles.cellText,
                        board[rowIndex][colIndex] === 'X' ? styles.xText : styles.oText
                      ]}>
                        {board[rowIndex][colIndex] ?? ''}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>

            <Text style={[
              styles.status,
              winner && styles.winnerText,
              currentPlayer === 'X' ? styles.xTurn : styles.oTurn
            ]}>
              {winner ? 
                (winner === 'draw' ? "It's a Draw!" : `${winner} wins!`) 
                : `${currentPlayer}'s turn`}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.resetButton]} 
              onPress={resetBoard}
            >
              <Text style={styles.buttonText}>Reset Board</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                isAIMode ? styles.aiEnabled : styles.aiDisabled
              ]}
              onPress={() => setIsAIMode((prev) => !prev)}
            >
              <Text style={styles.buttonText}>
                {isAIMode ? "Disable AI" : "Enable AI"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.historyButton]}
              onPress={() => navigation.navigate('History', { 
                gameHistory: gameHistory.map(item => item.result) 
              })}
            >
              <Text style={styles.buttonText}>View History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  gameContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  grid: {
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1.5,
    borderColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cellFilled: {
    backgroundColor: '#f8f9fa',
  },
  cellText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  xText: {
    color: '#e74c3c',
  },
  oText: {
    color: '#3498db',
  },
  status: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    padding: 10,
    borderRadius: 10,
  },
  xTurn: {
    color: '#e74c3c',
    backgroundColor: '#ffeded',
  },
  oTurn: {
    color: '#3498db',
    backgroundColor: '#edf6ff',
  },
  winnerText: {
    color: '#27ae60',
    backgroundColor: '#edfff5',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  resetButton: {
    backgroundColor: '#3498db',
  },
  aiEnabled: {
    backgroundColor: '#27ae60',
  },
  aiDisabled: {
    backgroundColor: '#7f8c8d',
  },
  historyButton: {
    backgroundColor: '#9b59b6',
  },
  backButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});