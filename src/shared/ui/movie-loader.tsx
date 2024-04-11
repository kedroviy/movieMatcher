import React from "react";
import LottieView from "lottie-react-native";

export function MovieLoader() {
  return (
    <LottieView
      source={require('../../../asset/sanimation-movie-loader.json')}
      style={{width: "100%", height: "100%"}}
      autoPlay
      loop
    />
  );
}
