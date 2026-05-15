import { test, describe } from 'node:test';
import assert from 'node:assert';
import { getDanishHolidays } from './constants.ts';

describe('getDanishHolidays', () => {
  test('2024 (Leap Year) Holidays', () => {
    const holidays = getDanishHolidays(2024);

    // Fixed dates
    assert.strictEqual(holidays['2024-01-01'], 'Nytårsdag');
    assert.strictEqual(holidays['2024-06-05'], 'Grundlovsdag');
    assert.strictEqual(holidays['2024-12-24'], 'Juleaften');
    assert.strictEqual(holidays['2024-12-25'], '1. Juledag');
    assert.strictEqual(holidays['2024-12-26'], '2. Juledag');
    assert.strictEqual(holidays['2024-12-31'], 'Nytårsaften');

    // Easter-related dates for 2024 (Easter Sunday: March 31)
    assert.strictEqual(holidays['2024-03-28'], 'Skærtorsdag');
    assert.strictEqual(holidays['2024-03-29'], 'Langfredag');
    assert.strictEqual(holidays['2024-03-31'], 'Påskedag');
    assert.strictEqual(holidays['2024-04-01'], '2. Påskedag');
    assert.strictEqual(holidays['2024-05-09'], 'Kristi Himmelfart'); // 39 days after Easter
    assert.strictEqual(holidays['2024-05-19'], 'Pinsedag'); // 49 days after Easter
    assert.strictEqual(holidays['2024-05-20'], '2. Pinsedag'); // 50 days after Easter
  });

  test('2025 Holidays', () => {
    const holidays = getDanishHolidays(2025);

    // Easter Sunday 2025: April 20
    assert.strictEqual(holidays['2025-04-17'], 'Skærtorsdag');
    assert.strictEqual(holidays['2025-04-18'], 'Langfredag');
    assert.strictEqual(holidays['2025-04-20'], 'Påskedag');
    assert.strictEqual(holidays['2025-04-21'], '2. Påskedag');
    assert.strictEqual(holidays['2025-05-29'], 'Kristi Himmelfart');
    assert.strictEqual(holidays['2025-06-08'], 'Pinsedag');
    assert.strictEqual(holidays['2025-06-09'], '2. Pinsedag');
  });

  test('Check for formatting edge cases (Timezone Independence)', () => {
    const holidays = getDanishHolidays(2024);
    const keys = Object.keys(holidays);
    keys.forEach(key => {
      assert.match(key, /^\d{4}-\d{2}-\d{2}$/, `Key ${key} should match YYYY-MM-DD format`);
    });
  });
});
