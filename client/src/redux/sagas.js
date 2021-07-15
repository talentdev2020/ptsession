import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import trainerSagas from './trainer/saga';
import ideaSagas from './idea/saga';

export default function* rootSaga(getState) {
  yield all([trainerSagas(), authSagas(), ideaSagas()]);
}
