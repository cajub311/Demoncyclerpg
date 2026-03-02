# Demon Cycle RPG

A dark mobile survival RPG for Android based on Peter V. Brett's *Warded Man* book series. Built with React Native + Expo.

## Run the Game

```bash
npm install
npx expo start --tunnel
```

Scan the QR code with the Expo Go app on your Android device, or press `a` for Android emulator.

## Tech Stack

- React Native + Expo
- Android mobile first
- Modular structure: `src/systems/`, `src/screens/`, `src/components/`, `src/hooks/`, `src/data/`

## Features Implemented

1. **Day/Night Engine** — Real-time cycle (DAWN, DAY, DUSK, NIGHT) with dynamic sky colors
2. **World Screen** — Sky, ground, phase indicator
3. **Party Bar** — Switch between Arlen, Leesha, Rojer (44px+ tap targets)
4. **HUD** — Day count, phase, inventory (Food, Water, Wards, Herbs)
5. **Corelings** — Spawn at night, tap-to-attack
6. **Moral Path** — First-launch selection: Ward-Bearer, Demon-Eater, or neutral
7. **Town Screen** — Miln with ward strength, population, NPCs
8. **Messenger Travel** — Travel between Miln and Tibbet's Brook (day only)
9. **Warded Echo** — Death respawn mechanic
10. **Rojer Music System** — Rhythm-based Fiddle Charm, Demon Lullaby, Battle Hymn

## World

Humanity survives behind wards. Corelings rise at night. You travel as a Messenger between towns. Your moral choices shape your path—Ward-Bearer or Demon-Eater.
