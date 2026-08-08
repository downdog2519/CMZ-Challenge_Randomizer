import {
  pickRandom,
  pickUnique,
  weightedPick,
  shuffle,
  randomInt,
} from '../app/js/utils.js';
import { trailMaps, trailRules } from '../app/js/data.js';

describe('Randomizer helpers', () => {
  test('pickRandom returns undefined for empty arrays', () => {
    expect(pickRandom([])).toBeUndefined();
    expect(pickRandom(null)).toBeUndefined();
  });

  test('pickRandom always returns a member of the array', () => {
    const pool = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 40; i++) {
      expect(pool).toContain(pickRandom(pool));
    }
  });

  test('pickUnique never exceeds available items and has no dupes', () => {
    const pool = [1, 2, 3, 4, 5];
    const picked = pickUnique(pool, 3);
    expect(picked).toHaveLength(3);
    expect(new Set(picked).size).toBe(3);
    expect(pickUnique(pool, 99)).toHaveLength(5);
    expect(pickUnique([], 3)).toEqual([]);
  });

  test('weightedPick respects heavy weights over many samples', () => {
    const values = ['rare', 'common'];
    const weights = [1, 99];
    const counts = { rare: 0, common: 0 };
    for (let i = 0; i < 800; i++) {
      counts[weightedPick(values, weights)]++;
    }
    expect(counts.common).toBeGreaterThan(counts.rare * 5);
  });

  test('shuffle returns a permutation of the input', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffle(input);
    expect(out).toHaveLength(input.length);
    expect([...out].sort()).toEqual([...input].sort());
    expect(out).not.toBe(input);
  });

  test('randomInt stays within inclusive bounds', () => {
    for (let i = 0; i < 50; i++) {
      const n = randomInt(2, 5);
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThanOrEqual(5);
    }
  });

  test('trailMaps are unique and all exist in trailRules', () => {
    expect(new Set(trailMaps).size).toBe(trailMaps.length);
    for (const map of trailMaps) {
      expect(trailRules[map]?.pool?.length).toBeGreaterThan(0);
    }
  });
});
