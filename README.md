# Demon Cycle RPG

A dark mobile survival RPG for Android based on Peter V. Brett's [Warded Man](https://www.petervbrett.com/) book series.
Built with **React Native + Expo**.

> *Humanity survives behind wards. Corelings rise at night. You travel as a Messenger between towns. Your moral choices shape your path — Ward-Bearer or Demon-Eater.*
>
> ---
>
> ## Run the Game
>
> ```bash
> npm install
> npx expo start --tunnel
> ```
>
> Scan the QR code with the **Expo Go** app on your Android device, or press `a` for Android emulator.
>
> ---
>
> ## Tech Stack
>
> | Component | Choice |
> |-----------|--------|
> | Framework | React Native + Expo (managed workflow) |
> | Language  | JavaScript (ES2022) |
> | State     | React Context + useReducer |
> | Storage   | AsyncStorage (save files) |
> | Audio     | expo-av |
> | Dev Tools | GitHub Codespaces, Cursor AI, Expo Go |
>
> ---
>
> ## Phase Progress
>
> ### ✅ Phase 1 — Foundation (COMPLETE)
> - Day/Night Engine — real-time DAWN → DAY → DUSK → NIGHT cycle
> - - World Screen — dynamic sky, ground, atmosphere layers
>   - - Party Bar — switch between Arlen, Leesha, Rojer (44px tap targets)
>     - - HUD — day count, phase indicator, inventory (Food, Water, Wards, Herbs)
>       - - Moral Path — first-launch selection: Ward-Bearer, Demon-Eater, or neutral
>         - - Town Screen — Miln with ward strength, population, NPCs
>           - - Messenger Travel — travel between Miln and Tibbet's Brook (day only)
>             - - Warded Echo — death/respawn mechanic
>               - - Rojer Music System — rhythm-based Fiddle Charm, Demon Lullaby, Battle Hymn
>                
>                 - ### ✅ Phase 2 — Combat Engine (COMPLETE)
>                 - - `CombatEngine.js` — full ATB system, damage formulas, enemy AI, ward charge meter
>                   - - `CombatScreen.js` — battle UI with HP/ATB/WardCharge bars, action menu (Fight/Ward/Item/Flee)
>                     - - Status effects — Burn, Freeze, Poison, Stun, Confuse, Slow
>                       - - Ward mastery scaling — F through S ranks affect damage and MP cost
>                         - - Grand Ward (limit break) — fills from dealing/taking damage
>                           - - Enemy AI — behavior-based (aggressive_melee, ranged, charge, commander, ambush)
>                             - - Flee system — speed-based success chance, blocked on bosses
>                               - - Victory screen — XP and loot summary
>                                 - - Defeat screen — Warded Echo respawn
>                                  
>                                   - ### 🔲 Phase 3 — Ward System
>                                   - - Ward drawing mini-game (finger trace on touchscreen)
>                                     - - Ward learning from NPCs, ruins, ancient texts
>                                       - - Ward exploration use (fire burns thorns, impact breaks boulders)
>                                         - - Ward-gated zone progression
>                                          
>                                           - ### 🔲 Phase 4 — Inventory & Crafting
>                                           - - Grid inventory UI (RE4-style weight slots)
>                                             - - Item pickup from overworld resource nodes
>                                               - - JSON-driven crafting recipes
>                                                 - - Equipment system (weapon + armor + accessory)
>                                                   - - Shop UI with NPC shopkeepers
>                                                    
>                                                     - ### 🔲 Phase 5 — Party & Companions
>                                                     - - Companion recruitment through quest chains
>                                                       - - Loyalty meter with moral choice tracking
>                                                         - - Companion AI in battle
>                                                           - - Personal companion quests
>                                                            
>                                                             - ### 🔲 Phase 6 — Night Defense Mode
>                                                             - - Dusk prep screen (ward placement on town grid)
>                                                               - - Wave spawning system
>                                                                 - - Ward auto-damage on coreling contact
- Survival scoring

### 🔲 Phase 7 — World Expansion
- All 5 zones: Tibbet's Brook → Cutter's Hollow → Angiers → Miln → Desert Spear
- - Full main story quest chain (Acts 1–5)
  - - Dungeons and ruins with puzzles
   
    - ### 🔲 Phase 8 — Polish
    - - Sound effects and ambient music
      - - Save/load system (3 slots + auto-save)
        - - Settings menu
          - - Tutorial/onboarding
           
            - ---

            ## Content Architecture

            All game content lives in JSON under `/content/`:

            ```
            content/
            ├── wards/
            │   └── ward_definitions.json     # 8 wards — combat, exploration, defense, mastery F-S
            ├── corelings/
            │   └── coreling_types.json       # 11 enemy types + boss phases + loot tables
            ├── npcs/
            │   └── companions.json           # 5 companions — stats, skills, loyalty dialogue
            ├── balance/
            │   └── level_curve.json          # 30-level XP curve + damage formulas
            └── (quests, items, zones coming in Phase 3+)
            ```

            ### Adding a new coreling
            Just add one entry to `content/corelings/coreling_types.json` with the required schema — no code changes needed.

            ### Adding a new ward
            Add one entry to `content/wards/ward_definitions.json`. Define its combat damage, exploration action, defense behavior, and mastery tiers.

            ---

            ## File Structure

            ```
            src/
            ├── components/
            │   ├── Coreling.js             # Night enemy sprite component
            │   ├── DamageNumber.js         # Floating damage numbers
            │   ├── EchoButton.js           # Warded Echo respawn button
            │   ├── GameHUD.js              # Day count, phase, inventory HUD
            │   ├── GroundLayer.js          # Ground/terrain rendering
            │   ├── NightAtmosphere.js      # Night overlay effects
            │   ├── PartyBar.js             # Party character switcher
            │   ├── PhaseIndicator.js       # DAWN/DAY/DUSK/NIGHT indicator
            │   ├── RojerMusicSystem.js     # Fiddle Charm rhythm system
            │   ├── SkyAtmosphere.js        # Dynamic sky color system
            │   └── WardPlacementEffect.js  # Ward draw visual effect
            ├── context/
            │   └── GameContext.js          # Global game state provider
            ├── data/
            │   └── towns.js                # Town definitions
            ├── hooks/
            │   └── useGameState.js         # Game state hook
            ├── screens/
            │   ├── CombatScreen.js         # ✨ NEW: ATB battle UI
            │   ├── MessengerTravelScreen.js
            │   ├── MoralPathScreen.js
            │   ├── TownScreen.js
            │   └── WorldScreen.js
            └── systems/
                ├── CombatEngine.js         # ✨ NEW: ATB math, AI, loot, XP
                ├── DayNightEngine.js
                └── GameEngine.js
            ```

            ---

            ## Ward System

            Each ward serves triple duty:

            | Role | Example |
            |------|---------|
            | **Combat spell** | Fire Ward burns a coreling for 15 damage + burn DoT |
            | **Exploration tool** | Fire Ward burns thorn bushes blocking a secret path |
            | **Defense structure** | Fire Ward placed on the town perimeter ignites attackers |

            Ward mastery runs **F → D → C → B → A → S**. Higher mastery = more damage, lower MP cost, and unique S-rank bonuses.

            ---

            ## Moral Choices

            Key decisions with permanent consequences:

            - **Share ward knowledge** — empowers towns but reduces your edge
            - - **Hora weapons** — powerful demon-bone gear, but morally grey
              - - **Krasian alliance** — unlocks Jardir as companion, closes other paths
                - - **Mercy vs. ruthlessness** — affects reputation, town loyalty, and endings
                 
                  - ---

                  ## Contributors

                  - **cajub311** — design, direction, content
                  - - **cursoragent** — AI-assisted development
                   
                    - ---

                    *Built in Saint Paul, MN. For the night is dark and full of corelings.*
