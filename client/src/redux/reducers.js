import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import trainerApp from './trainer/reducer';
import ideaApp from './idea/reducer';

const reducers = combineReducers({
  menu,
  settings,
  trainerApp,
  ideaApp,
  authUser,
});

export default reducers;
