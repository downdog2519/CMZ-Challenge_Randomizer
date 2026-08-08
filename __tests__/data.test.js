import {
  grimRelics,
  sinisterRelics,
  wickedRelics,
  allRelics,
  survivalMaps,
  relicCodex,
  bossMaps,
  startingRoomMaps,
  trailRules,
} from '../app/js/data.js';
import { relicImages } from '../app/js/utils.js';

describe('Data Module', () => {
  test('allRelics combines all three relic pools', () => {
    expect(allRelics.length).toBe(grimRelics.length + sinisterRelics.length + wickedRelics.length);
  });

  test('each relic pool has ten entries (5 maps × tiers)', () => {
    expect(grimRelics).toHaveLength(10);
    expect(sinisterRelics).toHaveLength(10);
    expect(wickedRelics).toHaveLength(10);
    expect(allRelics).toHaveLength(30);
  });

  test('known relics from all maps are present', () => {
    expect(grimRelics).toContain('Rocket');
    expect(grimRelics).toContain('Power Switch');
    expect(grimRelics).toContain('Gramophone');
    expect(sinisterRelics).toContain('Summoning Key');
    expect(sinisterRelics).toContain('Stuffed Elephant');
    expect(sinisterRelics).toContain('Film Reel');
    expect(wickedRelics).toContain('Mangler Helmet');
    expect(wickedRelics).toContain('Agarthan Device');
    expect(wickedRelics).toContain('Dragon Egg');
  });

  test('removed relics are absent', () => {
    expect(allRelics).not.toContain('Rocket Grim');
    expect(allRelics).not.toContain('Summoning Key Sinister');
    expect(allRelics).not.toContain('Mangler Helmet Wicked');
  });

  test('survivalMaps includes Ashwood', () => {
    expect(survivalMaps).toContain('Ashwood');
  });

  test('boss and starting-room maps include Totenreich and Kowakujo', () => {
    expect(bossMaps).toEqual(expect.arrayContaining(['Totenreich', 'Kowakujo']));
    expect(startingRoomMaps).toEqual(expect.arrayContaining(['Totenreich', 'Kowakujo']));
  });

  test('trail rules cover all five cursed maps', () => {
    expect(Object.keys(trailRules)).toEqual(
      expect.arrayContaining([
        'Ashes of the Damned',
        'Astra Malorum',
        'Paradox Junction',
        'Totenreich',
        'Kowakujo',
      ]),
    );
  });

  test('relicCodex lists every relic with map, tier, and unlock steps', () => {
    expect(relicCodex).toHaveLength(allRelics.length);
    for (const entry of relicCodex) {
      expect(allRelics).toContain(entry.name);
      expect(['Grim', 'Sinister', 'Wicked']).toContain(entry.tier);
      expect(entry.map).toBeTruthy();
      expect(entry.requires).toBeTruthy();
      expect(entry.effect).toBeTruthy();
      expect(Array.isArray(entry.steps)).toBe(true);
      expect(entry.steps.length).toBeGreaterThan(1);
      expect(entry.trial).toBeTruthy();
    }
  });

  test('every relic has an image mapping', () => {
    for (const name of allRelics) {
      expect(relicImages[name]).toBeTruthy();
      expect(relicImages[name]).toMatch(/\.(png|webp|jpg|jpeg|svg)$/i);
    }
  });
});
