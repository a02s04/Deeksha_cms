import * as migration_20260331_072449_initial from './20260331_072449_initial';
import * as migration_20260331_092943 from './20260331_092943';
import * as migration_20260427_094958 from './20260427_094958';
import * as migration_20260427_095800_fix_previous_work from './20260427_095800_fix_previous_work';

export const migrations = [
  {
    up: migration_20260331_072449_initial.up,
    down: migration_20260331_072449_initial.down,
    name: '20260331_072449_initial',
  },
  {
    up: migration_20260331_092943.up,
    down: migration_20260331_092943.down,
    name: '20260331_092943',
  },
  {
    up: migration_20260427_094958.up,
    down: migration_20260427_094958.down,
    name: '20260427_094958'
  },
  {
    up: migration_20260427_095800_fix_previous_work.up,
    down: migration_20260427_095800_fix_previous_work.down,
    name: '20260427_095800_fix_previous_work'
  }
];
