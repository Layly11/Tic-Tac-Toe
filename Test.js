import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function Game() {
  const route = useRoute();
  const { gridSize } = route.params;

  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [isAIMode, setIsAIMode] = useState(false); // เปิด/ปิด AI

  useEffect(() => {
    resetBoard();
  }, [gridSize]);

  const resetBoard = () => {
    setBoard(Array(gridSize).fill().map(() => Array(gridSize).fill(null)));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const handlePress = (row, col) => {
    if (board[row][col] || winner) return;

    const newBoard = board.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? currentPlayer : cell))
    );
    setBoard(newBoard);
    checkWinner(newBoard, currentPlayer);


    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    // ให้ AI เล่นถ้าเปิดโหมด AI และเป็นตาของ AI
    if (isAIMode && nextPlayer === 'O' && !winner) {
      setTimeout(() => makeAIMove(newBoard), 500); // ดีเลย์เล็กน้อย
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
      setMoveHistory((prev) => [...prev, { player: 'O', row, col }]);
  
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
          // ทดลองใส่ 'O' ในเซลล์ว่าง
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
  
  const minimax = (board, depth, isMaximizing) => {
    const scores = { X: -10, O: 10, draw: 0 };
  
    const result = getWinner(board);
    if (result) {
      return scores[result] - depth; // Depth ช่วยให้ AI เลือกวิธีที่ชนะเร็วขึ้น
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (!board[row][col]) {
            board[row][col] = 'O';
            const score = minimax(board, depth + 1, false);
            board[row][col] = null;
            bestScore = Math.max(score, bestScore);
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
            const score = minimax(board, depth + 1, true);
            board[row][col] = null;
            bestScore = Math.min(score, bestScore);
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
    const checkLine = (line) => line.every((cell) => cell === player);
  
    // ตรวจสอบแถว
    for (let row of board) {
      if (checkLine(row)) return declareWinner(player);
    }
  
    // ตรวจสอบคอลัมน์
    for (let col = 0; col < gridSize; col++) {
      const column = board.map((row) => row[col]);
      if (checkLine(column)) return declareWinner(player);
    }
  
    // ตรวจสอบแนวทแยง
    const mainDiagonal = board.map((row, i) => row[i]);
    const antiDiagonal = board.map((row, i) => row[gridSize - 1 - i]);
    if (checkLine(mainDiagonal) || checkLine(antiDiagonal)) return declareWinner(player);
  
    // ตรวจสอบว่าเสมอ
    if (board.every((row) => row.every((cell) => cell !== null))) {
      return declareWinner(null); // เสมอ
    }
  };
  
  const declareWinner = (player) => {
    setWinner(player);
    const result = player ? `${player} wins!` : "It's a Draw!";
    
    // แสดงผลลัพธ์และรีเซ็ตอัตโนมัติหลัง 2 วินาที
    Alert.alert("Game Over", result);
    setTimeout(() => {
      resetBoard(); // รีเซ็ตกระดาน
    }, 2000); // รอ 2 วินาทีเพื่อให้ผู้เล่นเห็นผลลัพธ์
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

  console.log("Debug: Board", board);
console.log("Debug: Current Grid Size:", gridSize);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>XO Game</Text>
      <Text>Grid Size: {gridSize} x {gridSize}</Text>

      <View style={styles.grid}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </View>
        ))}
      </View>

      <Text style={styles.status}>
        {winner ? (winner === null ? "It's a Draw!" : `${winner} wins!`) : `${currentPlayer}'s turn`}
      </Text>

      <TouchableOpacity style={styles.resetButton} onPress={resetBoard}>
        <Text style={styles.resetButtonText}>Reset Board</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: isAIMode ? 'lightgreen' : 'lightblue' }]}
        onPress={() => setIsAIMode((prev) => !prev)}
      >
        <Text style={styles.resetButtonText}>{isAIMode ? "Disable AI" : "Enable AI"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 18,
    marginVertical: 20,
  },
  resetButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    marginTop: 20,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
