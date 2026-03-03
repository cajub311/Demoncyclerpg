# Running in CodeSpaces

## Quick Start

1. **Auto-start**: Expo starts automatically when the codespace opens. A browser tab with the dev UI (QR code) should open when ready.

2. **Launch button**: Click the **Run and Debug** icon (▶️) in the sidebar, select **"Start Expo"**, then click the green play button. Or press **Ctrl+Shift+B** to run the default build task.

3. **Manual start**: Open Terminal and run `npm start`.

## Game Flow

- **Moral Path** → Choose Ward-Bearer, Demon-Eater, or neutral
- **World** → Day/night cycle, corelings at night, party bar
- **Explore** → Tile-based overworld: D-pad move, A to interact, walk to town
- **Town** → Tibbet's Brook interior, NPCs with dialogue
- **Combat** → Tap Fight for ATB battle demo

## QR Code

Scan the QR code with **Expo Go** on your phone to load the game. The `--tunnel` flag creates a public URL so your device can reach the Metro bundler in the cloud.

If the auto-opened browser didn't show the QR code, check the **Ports** tab → right-click port 8081 → **Preview in Editor**.

## Troubleshooting

- **No launch button?** Run **Terminal → Run Task** and choose "Start Expo".
- **Port not showing?** Run `npm start` in a terminal first.
- **QR code in log?** If Expo started in background: `cat /tmp/expo.log`
