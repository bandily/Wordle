import { Text, View, Alert, ActivityIndicator } from 'react-native';
import { colors, CLEAR, ENTER, colorsToEmoji } from "../../constants"; 
import Keyboard from '../Keyboard';
import { useEffect, useState } from 'react';
import words from '../../Words'
import styles from './Styles';
import { copyArray, getDayOfTheYear, getDayKey } from '../../Util';
import AsyncStorage from '@react-native-async-storage/async-storage'
import EndScreen from '../EndScreen';

const attempts = 6;

const dayOfTheYear = getDayOfTheYear();
const dayKey = getDayKey();

const Game = () => {
  AsyncStorage.removeItem("@game");
  const word = words[dayOfTheYear];
  const letters = word.split("");

  const [rows, setRows] = useState(
    new Array(attempts).fill(new Array(letters.length).fill(""))
    );

  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (currentRow > 0) {
      checkGameState();
    }
  }, [currentRow])

  useEffect(() => {
    if (loaded) {
      persistState();
    }
  }, [rows, currentRow, currentCol, gameState])

  useEffect(() => {
    readState()
  }, [])

  const persistState = async () => {
    const dataForToday = {
      rows, 
      currentRow,
      currentCol,
      gameState,
    }

    try {
      const existingStateString = await AsyncStorage.getItem("@game")
      const existingState = existingStateString ? JSON.parse(existingStateString) : {};

      existingState[dayKey] = dataForToday

      const dataString = JSON.stringify(existingState);
      await AsyncStorage.setItem('@game', dataString);
    }catch (e) {
      console.log("Failed to write", e)
    }
  }

  const readState = async () => {
    const dataString = await AsyncStorage.getItem("@game");
    console.log(dataString);
    try {
      const data = JSON.parse(dataString);
      const day = data[dayKey];
      setRows(day.rows);
      setCurrentCol(day.currentCol);
      setCurrentRow(day.currentRow);
      setGameState(day.gameState)
    } catch (e) {
      console.log("Could not parse")
    }

    setLoaded(true);
  }

  const checkGameState = () => {
    if(checkIfWon() && gameState !== 'won') {
      setGameState('won');
    }else if (checkIfLost() && gameState !== 'lost') {
      setGameState('lost')
    }
  }

  const checkIfWon = () => {
    const row = rows[currentRow - 1];

    return row.every((letter, i) => letter === letters[i])
  }

  const checkIfLost = () => {
    return !checkIfWon() && currentRow === rows.length;
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
    row.filter((cell, j) => getCellBGColor(i, j) === color)
    );
  }

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  if (!loaded) {
    return (<ActivityIndicator />)
  }

  if (gameState !== 'playing') {
    return (<EndScreen won={gameState === 'won'} rows={rows} getCellBGColor={getCellBGColor}/>)
  }

    return (
    <>
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
        greyCaps={greyCaps}
      />
    </>
  );
}

export default Game
