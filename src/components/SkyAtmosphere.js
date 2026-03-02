/**
 * SkyAtmosphere.js - Living sky: stars, sun, moon, clouds, fog
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { PHASES, PHASE_BOUNDARIES } from '../systems/GameEngine';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sun arc: 6am (360) left, noon (720) top, 6pm (1080) right
function getSunPosition(minute) {
  if (minute < 300 || minute > 1140) return null; // Below horizon
  const t = (minute - 360) / 720;
  if (t < 0 || t > 1) return null;
  const x = t * 100;
  const y = (1 - Math.sin(t * Math.PI)) * 100;
  return { x: `${x}%`, y: `${y}%` };
}

// Moon arc: 8pm (1200) left, 1am (60) top, 5am (300) right
function getMoonPosition(minute) {
  const nightMin = minute >= 1200 ? minute - 1200 : minute + 240;
  if (nightMin < 0 || nightMin > 540) return null;
  const t = nightMin / 540;
  const x = t * 100;
  const y = (1 - Math.sin(t * Math.PI)) * 100;
  return { x: `${x}%`, y: `${y}%` };
}

// Generate star positions (fixed layout)
const STAR_COUNT = 60;
const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: (i * 17 + 13) % 100,
  y: (i * 23 + 7) % 70,
  size: 1 + (i % 3),
  delay: (i * 100) % 2000,
}));

function TwinklingStar({ x, y, size, delay }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    let loopRef;
    const t = setTimeout(() => {
      loopRef = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.9,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      loopRef.start();
    }, delay % 1500);
    return () => {
      clearTimeout(t);
      loopRef?.stop();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity,
        },
      ]}
    />
  );
}

export function SkyAtmosphere({ skyColorHex, phase, minute }) {
  const sunPos = getSunPosition(minute);
  const moonPos = getMoonPosition(minute);
  const showStars = phase === PHASES.NIGHT;
  const showDuskClouds = phase === PHASES.DUSK;
  const showDawnFog = phase === PHASES.DAWN;

  return (
    <View style={[styles.container, { backgroundColor: skyColorHex }]} pointerEvents="none">
      {/* Sun */}
      {sunPos && (
        <View style={[styles.celestialBody, styles.sun, { left: sunPos.x, top: sunPos.y }]} />
      )}

      {/* Moon */}
      {moonPos && (
        <View style={[styles.celestialBody, styles.moon, { left: moonPos.x, top: moonPos.y }]}>
          <View style={styles.moonGlow} />
        </View>
      )}

      {/* Stars at night */}
      {showStars &&
        stars.map((s) => (
          <TwinklingStar key={s.id} x={s.x} y={s.y} size={s.size} delay={s.delay} />
        ))}

      {/* Blood red clouds at dusk */}
      {showDuskClouds && (
        <>
          <View style={[styles.cloud, styles.cloud1]} />
          <View style={[styles.cloud, styles.cloud2]} />
          <View style={[styles.cloud, styles.cloud3]} />
        </>
      )}

      {/* Morning fog at dawn */}
      {showDawnFog && <View style={styles.fog} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  celestialBody: {
    position: 'absolute',
    marginLeft: -40,
    marginTop: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  sun: {
    backgroundColor: '#ffd700',
    shadowColor: '#ff8c00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 20,
  },
  moon: {
    backgroundColor: '#e8e8e8',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: -25,
    marginTop: -25,
  },
  moonGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
    backgroundColor: 'rgba(200,200,255,0.3)',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#fff',
  },
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(139, 38, 53, 0.5)',
    borderRadius: 50,
  },
  cloud1: {
    width: 120,
    height: 40,
    top: '15%',
    left: '10%',
    opacity: 0.7,
  },
  cloud2: {
    width: 100,
    height: 35,
    top: '25%',
    right: '15%',
    opacity: 0.6,
  },
  cloud3: {
    width: 80,
    height: 30,
    top: '35%',
    left: '40%',
    opacity: 0.5,
  },
  fog: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 240, 220, 0.4)',
    bottom: 0,
    height: '50%',
  },
});
