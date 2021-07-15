import {
  all,
  delay,
  call,
  fork,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { getDateWithFormat } from '../../helpers/Utils';
import { auth, store } from '../../helpers/Firebase';
import axios from 'axios';

import {
  CLIENT_GET_LIST,
  CLIENT_ADD_ITEM,
  CLIENT_EDIT_ITEM,
  CLIENT_SEND_INVITATION,
  CLIENT_ACCEPT_INVITATION,
  CLIENT_SEND_INVITATION_EMAIL,
  CLIENT_GET_ITEM,
  UPDATE_PROFILE,
  TRAINER_ADD_PACKAGE,
  TRAINER_EDIT_PACKAGE,
  TRAINER_REMOVE_PACKAGE,
} from '../actions';

import {
  getClientListSuccess,
  getClientListError,
  addClientItemSuccess,
  addClientItemError,
  editClientItemSuccess,
  editClientItemError,
  getItemSuccess,
  sendInvitationSuccess,
  sendInvitationError,
  acceptInvitationSuccess,
  acceptInvitationError,
  initErrorState,
} from './actions';

import { roles, apiUrl } from '../../constants/defaultValues';

const getClientListRequest = async () => {
  try {
    const trainerID = localStorage.getItem('auth_id');
    const token = localStorage.getItem('access_token');
    const config = {
      headers: { 'x-access-token': token },
    };
    const res = await axios.get(
      `${apiUrl}trainer/getClientList/${trainerID}`,
      config
    );
    if (res.status === 200) {
      const { allClients, clients } = res.data;
      return { allClients, clients };
    }
  } catch (e) {
    console.log('getClientListRequest: ', e);
  }
};

function* getClientListItems(payload) {
  try {
    const response = yield call(getClientListRequest, payload);
    console.log('response', response);
    yield put(getClientListSuccess(response));
  } catch (error) {
    yield put(getClientListError(error));
  }
}

const addClientItemRequest = async (item) => {
  item.createDate = getDateWithFormat();
  item.updateDate = getDateWithFormat();
  // items.splice(0, 0, item);
  await store.collection('clients').add(item);

  return item;
};

function* addClientItem({ payload }) {
  try {
    const response = yield call(addClientItemRequest, payload);
    yield put(addClientItemSuccess(response));
  } catch (error) {
    yield put(addClientItemError(error));
  }
}
const getClientItemRequest = async (item) => {
  item.updateDate = getDateWithFormat();
  let clientCollection = store.collection('clients').doc(item.id);
  var data = Object.assign({}, item);
  delete data.id;

  clientCollection.get().then(function (thisdoc) {
    if (thisdoc.exists) {
      clientCollection.update(data);
    }
  });
  return item;
};

function* getClientItem({ payload }) {
  try {
    const response = yield call(getClientItemRequest, payload);
    yield put(editClientItemSuccess(response));
  } catch (error) {
    yield put(editClientItemError(error));
  }
}

const sendInvitationRequest = async ({ payload }) => {
  const trainerID = localStorage.getItem('auth_id');
  const token = localStorage.getItem('access_token');
  const config = {
    headers: { 'x-access-token': token },
  };
  const formData = { trainerID, ...payload };
  console.log('formData', formData);
  const res = await axios.post(apiUrl + 'trainer/sendInvite', formData, config);
  return res;
};

function* sendInvitation(payload) {
  try {
    const res = yield call(sendInvitationRequest, payload);
    if (res.data.error) {
      yield put(sendInvitationError(res.data.msg));
    } else {
      yield put(sendInvitationSuccess(res.data.msg));
    }
    yield put(initErrorState());
  } catch (error) {
    console.log('invitation error', error);
  }
}

function* sendInvitationToEmail(payload) {
  try {
    const res = yield call(sendInvitationRequest, payload);
    if (res.data.error) {
      yield put(sendInvitationError(res.data.msg));
    } else {
      yield put(sendInvitationSuccess(res.data.msg));
    }
    yield put(initErrorState());
  } catch (error) {
    console.log('invitation error', error);
    yield put(sendInvitationError('Invitation failed. Try again.'));
  }
}

const acceptInvitationAsync = async (formData) => {
  const token = localStorage.getItem('access_token');
  console.log('formData', formData);
  const config = {
    headers: { 'x-access-token': token },
  };
  const res = await axios.post(
    `${apiUrl}trainer/acceptInvite`,
    formData,
    config
  );
  console.log('response', res);
  return res.data;
};

function* acceptInvitation(payload) {
  const { history, result } = payload.payload;
  console.log('acceptInvitation');
  try {
    const res = yield call(acceptInvitationAsync, result);
    if (res.msg) {
      if (res.error) {
        yield put(acceptInvitationError(res.msg));
      } else {
        yield put(acceptInvitationSuccess(res.msg));
      }
    }
    yield delay(2000);
    history.push('/client');
  } catch (error) {
    console.log('error', error);
  }
}

const getItemAsync = async (clientID) => {
  // const token = localStorage.getItem('access_token');
  // const config = {
  //   headers: { 'x-access-token': token },
  // };
  const res = await axios.get(`${apiUrl}user/${clientID}`);
  // if (res.status === 200) {
  //   yield put(getItem(res.data.data));
  // }
  return res;
};

function* getItem({ clientID }) {
  console.log('clientID', clientID);
  try {
    const res = yield call(getItemAsync, clientID);
    if (res.status === 200) {
      yield put(getItemSuccess(res.data.data));
    }
  } catch (error) {
    console.log('error', error);
  }
}

const updateProfileAsync = async (data) => {
  try {
    const token = localStorage.getItem('access_token');
    const config = {
      headers: { 'x-access-token': token },
    };
    const res = await axios.post(`${apiUrl}user/updateProfile`, data, config);
    return res;
  } catch (err) {
    console.log('err', err);
  }
};

function* updateProfile(data) {
  try {
    const res = yield call(updateProfileAsync, data.payload);
    if (!res.data.error) {
      yield put(getItemSuccess(res.data.data));
    }
  } catch (error) {
    console.log('error', error);
  }
}

const addPackageAsync = async (data) => {
  try {
    const token = localStorage.getItem('access_token');
    const config = {
      headers: { 'x-access-token': token },
    };
    const res = await axios.post(`${apiUrl}trainer/addPackage `, data, config);
    return res;
  } catch (err) {
    console.log('err', err);
  }
};

function* addPackage({ payload }) {
  console.log('data', payload);
  try {
    const res = yield call(addPackageAsync, payload);
    if (!res.error) {
      yield put(getItemSuccess(res.data.data));
    }
  } catch (error) {
    console.log('error', error);
  }
}

function* editPackage(data) {
  console.log('data', data);
}

function* removePackage(data) {
  console.log('data', data);
}

export function* watchGetList() {
  yield takeEvery(CLIENT_GET_LIST, getClientListItems);
}

export function* watchAddItem() {
  yield takeEvery(CLIENT_ADD_ITEM, addClientItem);
}

export function* watchEditItem() {
  yield takeEvery(CLIENT_EDIT_ITEM, getClientItem);
}

export function* watchSendInvitation() {
  yield takeEvery(CLIENT_SEND_INVITATION, sendInvitation);
}

export function* watchSendInvitationToEmail() {
  yield takeEvery(CLIENT_SEND_INVITATION_EMAIL, sendInvitationToEmail);
}

export function* watchAcceptInvitation() {
  yield takeEvery(CLIENT_ACCEPT_INVITATION, acceptInvitation);
}

export function* watchGetItem() {
  yield takeEvery(CLIENT_GET_ITEM, getItem);
}

export function* watchUpdateProfile() {
  yield takeEvery(UPDATE_PROFILE, updateProfile);
}

export function* watchAddPackage() {
  yield takeLatest(TRAINER_ADD_PACKAGE, addPackage);
}

export function* watchEditPackage() {
  yield takeLatest(TRAINER_EDIT_PACKAGE, editPackage);
}

export function* watchRemovePackage() {
  yield takeLatest(TRAINER_REMOVE_PACKAGE, removePackage);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchEditItem),
    fork(watchSendInvitation),
    fork(watchSendInvitationToEmail),
    fork(watchAcceptInvitation),
    fork(watchGetItem),
    fork(watchUpdateProfile),
    fork(watchAddPackage),
    fork(watchEditPackage),
    fork(watchRemovePackage),
  ]);
}
