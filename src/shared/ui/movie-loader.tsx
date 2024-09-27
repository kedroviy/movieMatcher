import React from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";
import { Color } from "styles/colors";

export function MovieLoader() {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      width: '100%',
      height: '100%',
    }}>
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        opacity: 0.5,
        width: '100%',
        height: '100%',
        backgroundColor: Color.NEW_BLACK,
      }} />
      <LottieView
        autoPlay
        loop
        source={require('../../../assets/animo-2.json')}
        style={{
          width: 50,
          height: 50,
        }}
      />
    </View>
  );
}
