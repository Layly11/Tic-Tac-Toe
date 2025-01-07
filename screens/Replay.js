import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function Replay({ route, navigation }) {
  const { gameData = {}, gameIndex = 0 } = route.params || {};
  const { gridSize = 3, moves = [], result = "No result available" } = gameData;

  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [replayBoard, setReplayBoard] = useState(
    Array(gridSize).fill().map(() => Array(gridSize).fill(null))
  );
  
  // เพิ่ม useEffect เพื่อตรวจสอบการโหลดข้อมูลเกม
  useEffect(() => {
    console.log("Game Data Loaded:", gameData);
    console.log("Moves:", moves);
    resetReplay();
  }, [gameData]);

  const playNextMove = () => {
    if (currentMoveIndex + 1 < moves.length) {
      const nextMoveIndex = currentMoveIndex + 1;
      const move = moves[nextMoveIndex];
      
      // สร้าง board ใหม่โดยคัดลอกจาก state ปัจจุบัน
      const newBoard = replayBoard.map(row => [...row]);
      
      // ตรวจสอบว่า move มีข้อมูลครบถ้วน
      if (move && typeof move.row === 'number' && typeof move.col === 'number' && move.player) {
        newBoard[move.row][move.col] = move.player;
        setReplayBoard(newBoard);
        setCurrentMoveIndex(nextMoveIndex);
      } else {
        console.error("Invalid move data:", move);
      }
    }
  };

  const resetReplay = () => {
    // รีเซ็ตกระดานให้ว่าง
    setReplayBoard(Array(gridSize).fill().map(() => Array(gridSize).fill(null)));
    // รีเซ็ต index ให้เป็น -1 เพื่อเริ่มต้นใหม่
    setCurrentMoveIndex(-1);
  };

  // เพิ่มฟังก์ชันเช็คสถานะการเล่น
  const getReplayStatus = () => {
    if (moves.length === 0) {
      return "No moves available";
    }
    if (currentMoveIndex + 1 >= moves.length) {
      return "Replay Finished";
    }
    return `Move ${currentMoveIndex + 1} of ${moves.length}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Replay Game {gameIndex + 1}</Text>
      
      {/* เพิ่มการแสดงข้อมูลสถานะการเล่น */}
      <Text style={styles.statusText}>{getReplayStatus()}</Text>

      <View style={styles.gridContainer}>
        {replayBoard.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View 
                key={`${rowIndex}-${colIndex}`} 
                style={[
                  styles.cell,
                  cell && styles.filledCell
                ]}
              >
                <Text style={[
                  styles.cellText,
                  cell === 'X' ? styles.xText : styles.oText
                ]}>
                  {cell}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <Text style={styles.resultText}>{result}</Text>

      <TouchableOpacity 
        style={[
          styles.replayButton,
          currentMoveIndex + 1 >= moves.length && styles.disabledButton
        ]} 
        onPress={playNextMove}
        disabled={currentMoveIndex + 1 >= moves.length}
      >
        <Text style={styles.buttonText}>
          {currentMoveIndex + 1 >= moves.length ? 'Replay Finished' : 'Play Next Move'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={resetReplay}>
        <Text style={styles.buttonText}>Reset Replay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to History</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  statusText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  gridContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  filledCell: {
    backgroundColor: '#f8f9fa',
  },
  cellText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  xText: {
    color: '#e74c3c',
  },
  oText: {
    color: '#3498db',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#27ae60',
  },
  replayButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: 200,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  resetButton: {
    backgroundColor: '#FF7043',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: 200,
  },
  backButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});