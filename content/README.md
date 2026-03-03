# Content Architecture

All game content lives in JSON. Schema docs:

## /wards/ward_definitions.json
Each ward: id, name, description, tier, unlock, combat, exploration, defense, mastery, drawing_template.

## /corelings/coreling_types.json
Each coreling: id, name, zone_min, stats, behavior, abilities, weaknesses, resistances, loot_table, sprite.

## /zones/{zone_id}/
- overworld.json: width, height, tiles (2D array), collision, spawn, transitions
- town.json: buildings, npcs, exits
- zone_meta.json: zone names, unlock requirements

## /items/
- consumables.json, weapons.json, armor.json, materials.json

## /recipes/
- warding_recipes.json, alchemy_recipes.json, smithing_recipes.json

## /npcs/companions.json
Party member definitions with stats, skills, recruitment.

## /balance/level_curve.json
XP requirements per level.
