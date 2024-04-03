import React, { FC } from 'react'
import { View, Text } from 'react-native'
import { StyleSheet } from 'react-native'

type OverlayLabelType = {
    label: string,
    color: string
}

export const OverlayLabel: FC <OverlayLabelType> = ({ label, color }) => (
  <View style={[styles.overlayLabel, { borderColor: color }]}>
    <Text style={[styles.overlayLabelText, { color }]}>{label}</Text>
  </View>
);


const styles = StyleSheet.create({
  overlayLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  overlayLabelText: {
    fontSize: 25,
    fontFamily: 'Avenir',
    textAlign: 'center',
  },
})