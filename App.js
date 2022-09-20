import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { colors } from "./src/constants"; 
import Keyboard from './src/components/Keyboard';

const attempts = 6;

export default function App() {

  const word = "hello";
  const letters = word.split("");

  const rows = new Array(attempts).fill(
    new Array(letters.length).fill("")
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDLE</Text>

      <View style={styles.map}>
        {rows.map((row) => (
          <View style={styles.row}>
            {row.map((cell) => (
              <View style={styles.cell}>
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
                </View>
            ))}
            </View>
        ))}
      </View>

      <Keyboard />
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
    height: 100,
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
