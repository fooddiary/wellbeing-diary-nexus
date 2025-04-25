
import { mealActions } from './actions/mealActions';
import { waterActions } from './actions/waterActions';
import { weightActions } from './actions/weightActions';
import { settingsActions } from './actions/settingsActions';

export const appActions = {
  ...mealActions,
  ...waterActions,
  ...weightActions,
  ...settingsActions
};
