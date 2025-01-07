# Tic Tac Toe App

A dynamic and feature-rich Tic Tac Toe game supporting customizable grid sizes, human vs AI gameplay, and game history tracking.

# Get started

1. **Install Dependencies**  
   Run the following command to install required packages:  
   ```bash
   npm install


2. **Start the app**
    ```bash
   npm start


# Code Summary
1. **Game Component**:
    * Main gameplay logic for Tic Tac Toe.
    * Adjust the Game Board: Dynamically generate the grid based on the selected gridSize
    * Supports human vs human and human vs AI modes.
    * Uses AsyncStorage to save and load game history.
    * AI logic implemented using Minimax with alpha-beta pruning.
    * Allows dynamic grid sizes and keeps track of move history.
2. **History Component**:
    * Displays a list of past game results stored in AsyncStorage.
    * Provides options to clear history or replay specific games.
3. **Replay Component**:
    * Allows users to replay a selected game step by step.
    * Dynamically updates the game board with each move from the history.

# Observations and Suggestions:
1. Reuse of State and AsyncStorage Logic: Some logic, like saving/loading history, appears multiple times (e.g., in Game and History components). Consider creating a utility module for AsyncStorage operations to avoid repetition.
2. Error Handling:
    * Good error handling for AsyncStorage operations.
    * For replay logic, ensure all moves are validated to prevent potential crashes (e.g., checking row, col, and player).
3. Performance in AI and Large Grids:
    * Minimax with alpha-beta pruning is efficient, but you’ve limited the depth to 4 for performance. If larger grids are allowed, AI performance might degrade. Consider optimizing further or limiting the grid size for AI mode.
4. Responsive Design: The grid cell size is calculated dynamically (300 / gridSize), which is good for responsiveness. Test on different screen sizes to ensure proper scaling.
5. Replay Logic:
    * The Replay component successfully reconstructs game progress. The logic to reset and progress through moves is clear and effective.
    * Add a feature to allow jumping to specific moves or rewinding moves for user flexibility.
6. History Navigation:
    * History links to individual replays using indices. Consider adding timestamps or unique identifiers for games to make navigation clearer.
7. AI Behavior:
    * AI makes a move with a slight delay (setTimeout), which improves user experience. Test this for edge cases to ensure AI responses are always valid.
