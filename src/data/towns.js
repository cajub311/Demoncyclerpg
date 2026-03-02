/**
 * towns.js - Town data, NPCs, dialogue
 */

export const TOWN_DATA = {
  miln: {
    id: 'miln',
    name: 'Miln',
    wardStrength: 80,
    population: 340,
    description: 'Mountain fortress. Mining town. Skeptical but fair.',
    supplies: ['ward_stone', 'food'],
    npcs: [
      { id: 'elona', name: 'Elona', role: 'Merchant', dialogue: 'The wards hold. For now.' },
      { id: 'cob', name: 'Cob', role: 'Ward Keeper', dialogue: 'Reinforce the outer ring before dusk.' },
    ],
  },
  tibbets: {
    id: 'tibbets',
    name: "Tibbet's Brook",
    wardStrength: 30,
    population: 80,
    description: 'Struggling hamlet. Desperate for help.',
    supplies: ['healing_herbs', 'food'],
    npcs: [
      { id: 'bruna', name: 'Bruna', role: 'Herb Gatherer', dialogue: 'We need every hand. The wards are failing.' },
    ],
  },
  angiers: {
    id: 'angiers',
    name: 'Angiers',
    wardStrength: 75,
    population: 1200,
    description: 'River city. Political and complex.',
    supplies: ['ward_stone', 'food', 'water'],
    unlocked: false,
  },
  krasia: {
    id: 'krasia',
    name: 'Krasia',
    wardStrength: 95,
    population: 5000,
    description: 'Desert warrior city. Respects strength only.',
    supplies: ['ward_stone', 'demon_flesh'],
    unlocked: false,
  },
};
