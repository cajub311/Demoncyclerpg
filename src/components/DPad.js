/**
 * DPad.js - Virtual D-pad for mobile (left thumb)
 * 44px minimum touch targets per accessibility
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const BTN_SIZE = 48;

export function DPad({ onDirection }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.spacer} />
        <TouchableOpacity
          style={styles.btn}
          onPressIn={() => onDirection('up')}
          onPressOut={() => onDirection(null)}
          activeOpacity={0.7}
        >
          <Text style={styles.arrow}>▲</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.btn}
          onPressIn={() => onDirection('left')}
          onPressOut={() => onDirection(null)}
          activeOpacity={0.7}
        >
          <Text style={styles.arrow}>◀</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity
          style={styles.btn}
          onPressIn={() => onDirection('right')}
          onPressOut={() => onDirection(null)}
          activeOpacity={0.7}
        >
          <Text style={styles.arrow}>▶</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <View style={styles.spacer} />
        <TouchableOpacity
          style={styles.btn}
          onPressIn={() => onDirection('down')}
          onPressOut={() => onDirection(null)}
          activeOpacity={0.7}
        >
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BTN_SIZE * 3,
    height: BTN_SIZE * 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  spacer: {
    width: BTN_SIZE,
    height: BTN_SIZE,
  },
  arrow: {
    fontSize: 20,
    color: '#e8e6e3',
    fontWeight: 'bold',
  },
});
