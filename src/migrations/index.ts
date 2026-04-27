import * as migration_20260331_072449_initial from './20260331_072449_initial';
import * as migration_20260331_092943 from './20260331_092943';

export const migrations = [
  {
    up: migration_20260331_072449_initial.up,
    down: migration_20260331_072449_initial.down,
    name: '20260331_072449_initial',
  },
  {
    up: migration_20260331_092943.up,
    down: migration_20260331_092943.down,
    name: '20260331_092943'
  },
];
