import { View, Text, StyleSheet, Pressable} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../constants';

const Number = ({number, label}) => (
    <View style={{alignItems: "center", margin: 10}}>
        <Text style={{color: colors.lightgrey, fontSize: 30, fontWeight: "bold",}}>
            {number}
        </Text>
        <Text style={{color: colors.lightgrey, fontSize: 16}}>{label}</Text>
    </View>
)

const GuessDistributionLine = ({position, amount, percentage}) => {
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center", 
            width: "100%"
            }}>
                <Text style={{color: colors.lightgrey }}>{position}</Text>
            <View style={{
                width: "90%", 
                backgroundColor: colors.grey, 
                margin: 5, 
                padding: 5, 
                width: `${percentage}%`
                }}>
                <Text style={{color: colors.lightgrey }}>{amount}</Text>
            </View>
        </View>
    )
}

const GetDistribution = () => {
return (
    <>
    <Text style={styles.subtitle}>GUESS DISTRIBUTION</Text>
    <View style={{width: "100%", padding: 20}}>
        <GuessDistributionLine position={0} amount={2} percentage={50}/>
        <GuessDistributionLine position={3} amount={2} percentage={50}/>
    </View>
    </>
)
}

const EndScreen = ({won = false}) => {

    const share = () => {

    }

    const [secondsTillTomorrow, setSecondsTillTomorrow] = useState(0)

    useEffect(() => {
       const updateTime = () => {
         const now = new Date();
         const tomorrow = new Date(
            now.getFullYear(), 
            now.getMonth(), 
            now.getDate() + 1
        );

         setSecondsTillTomorrow((tomorrow - now) / 1000);
       };

       const interval = setInterval(updateTime, 1000)
       return () => clearInterval(interval);
    }, [])

    const formatSeconds = () => {
        // const days = Math.floor(secondsTillTomorrow / (60 * 60 * 24))
        const hours = Math.floor(secondsTillTomorrow / (60 * 60))
        const minutes = Math.floor((secondsTillTomorrow % (60 * 60)) / 60)
        const seconds = Math.floor(secondsTillTomorrow % 60)

        return `${hours}:${minutes}:${seconds}`;
    }

    return (
        <View style={{width: "100%", alignItems: "center"}}>
            <Text style={styles.title}>
                {won ? 'Congrats!' : 'Meh, try again tomorrow'}
            </Text>

            <Text style={styles.subtitle}>STATISTICS</Text>
            <View style={{flexDirection: "row", marginBottom: 20}}>
                <Number number={2} label={"Played"} />
                <Number number={2} label={"Win %"} />
                <Number number={2} label={"Cur Streak"} />
                <Number number={2} label={"Max Streak"} />
            </View>
            <GetDistribution />

            <View style={{flexDirection: "row", padding: 10}}>
                <View style={{alignItems: "center", flex: 1}}>
                    <Text style={{color: colors.lightgrey, }}>Next Wordle</Text>
                    <Text style={{color: colors.lightgrey, fontSize: 24, fontWeight: "bold" }}>{formatSeconds()}</Text>
                </View>

                <Pressable onPress={share} 
                    style={{
                        flex: 1, 
                        backgroundColor: colors.primary, 
                        borderRadius: 25, 
                        alignItems: "center", 
                        justifyContent: "center"
                    }}>
                    <Text style={{color: colors.lightgrey, fontWeight: "bold"}}>Share</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: "white",
        textAlign: "center",
        marginVertical: 20,
    },

    subtitle: {
        fontSize: 20,
        color: colors.lightgrey,
        textAlign: "center",
        marginVertical: 15, 
        fontWeight: "bold",
    },
})

export default EndScreen;