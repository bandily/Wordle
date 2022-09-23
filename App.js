import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import { colors, CLEAR, ENTER } from "./src/constants"; 
import Keyboard from './src/components/Keyboard';
import { useEffect, useState } from 'react';

const attempts = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])]
}

export default function App() {

  const word = "hello";
  const letters = word.split("");

  const [rows, setRows] = useState(
    new Array(attempts).fill(new Array(letters.length).fill(""))
    );

  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameState, setGameState] = useState('playing');

  useEffect(() => {
    if (currentRow > 0) {
      checkGameState();
    }
  }, [currentRow])

  const checkGameState = () => {
    if(checkIfWon()) {
      Alert.alert('Huraaat', 'You Won!')
      setGameState('won')
    }else if (checkIfLost()) {
      Alert.alert('Meh', 'Try again tomorrow!')
      setGameState('lost')
    }
  }

  const checkIfWon = () => {
    const row = rows[currentRow - 1];

    return row.every((letter, i) => letter === letters[i])
  }

  const checkIfLost = () => {
    return currentRow === rows.length;
  }

  const onKeyPressed = (key) => {
    if (gameState !== 'playing') {
      return;
    }

    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = currentCol - 1;
      if (prevCol >= 0) {
        updatedRows[currentRow][prevCol] = "";
        setRows(updatedRows);
        setCurrentCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if(currentCol === rows[0].length) {
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      }

      return;
    }

    if (currentCol < rows[0].length) {
      updatedRows[currentRow][currentCol] = key;
      setRows(updatedRows);
      setCurrentCol(currentCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === currentRow && col == currentCol;
  }

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];
    if (row >= currentRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
      return colors.darkgrey;
  }

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) => 
    row.filter((cell,j) => getCellBGColor(i, j) === color)
    );
  }

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

    return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDLE</Text>

      <View style={styles.map}>
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((letter, j) => (
              <View 
                key={`cell-${i}-${j}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                    ? colors.lightgrey
                    : colors.darkgrey,
                    backgroundColor: getCellBGColor(i , j),
                  },
                ]}
              >
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                </View>
            ))}
            </View>
        ))}
      </View>

      <Keyboard 
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greenCaps}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },

  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },

  map: {
    alignSelf: "stretch",
    marginVertical: 20,
  },

  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },

  cell: {
    borderWidth: 3,
    borderColor: colors.grey,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28,
  },
});
