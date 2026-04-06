import React from "react";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import { Color } from "styles/colors";

export function MovieLoader() {
  return (
    <View style={styles.root}>
      <View style={styles.dim} />
      <LottieView
        autoPlay
        loop
        source={require('../../../assets/animo-2.json')}
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
    backgroundColor: Color.NEW_BLACK,
  },
  lottie: {
    width: 50,
    height: 50,
  },
});
