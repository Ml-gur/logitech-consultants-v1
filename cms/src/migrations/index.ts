import * as migration_20260805_194609_initial from './20260805_194609_initial';

export const migrations = [
  {
    up: migration_20260805_194609_initial.up,
    down: migration_20260805_194609_initial.down,
    name: '20260805_194609_initial'
  },
];
