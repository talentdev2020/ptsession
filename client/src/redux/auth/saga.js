import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
// import { auth, store } from '../../helpers/Firebase';

import {
  EDIT_USER,
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  GET_USER_INFO,
} from '../actions';

import {
  editUserSuccess,
  editUserError,
  loginUserSuccess,
  loginUserError,
  registerUserSuccess,
  registerUserError,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordSuccess,
  resetPasswordError,
} from './actions';

import { apiUrl, roles } from '../../constants/defaultValues';

const getUserInfoAsync = async (token) => {
  console.log('token1', token);
  try {
    const res = await axios.post(apiUrl + 'auth/getUserInfo', { token });
    console.log('res', res.data);
    return res.data;
  } catch (e) {
    console.log('error', e);
  }
};

function* getUserInfo({ payload }) {
  const { history } = payload;
  const token = localStorage.getItem('access_token');
  if (!token) {
  } else {
    const data = yield call(getUserInfoAsync, token);
    if (!data.error) {
      localStorage.setItem('auth_id', data.authUser._id);
      localStorage.setItem('access_token', data.token);
      yield put(loginUserSuccess(data.authUser));
    } else {
      yield put(loginUserError(data.msg));
    }
  }
}

export function* watchGetUser() {
  yield takeEvery(GET_USER_INFO, getUserInfo);
}

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

const loginWithEmailPasswordAsync = async (email, password, firstLogin) => {
  const response = await axios.post(apiUrl + 'auth/login', {
    email,
    password,
    firstLogin,
  });
  return response.data;
};

function* loginWithEmailPassword({ payload }) {
  const { email, password, firstLogin } = payload.user;
  const { history } = payload;
  try {
    const data = yield call(
      loginWithEmailPasswordAsync,
      email,
      password,
      firstLogin
    );
    if (!data.error) {
      localStorage.setItem('auth_id', data.authUser._id);
      localStorage.setItem('access_token', data.token);
      yield put(loginUserSuccess(data.authUser));
      history.push('/');
    } else {
      yield put(loginUserError(data.msg));
    }
  } catch (error) {
    yield put(loginUserError(error.message));
  }
}

export function* watchRegisterUser() {
  yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

const registerWithEmailPasswordAsync = async (user) => {
  const response = await axios.post(apiUrl + 'auth/register', user);
  return response.data;
};

function* registerWithEmailPassword({ payload }) {
  const { history } = payload;
  try {
    const registerUser = yield call(
      registerWithEmailPasswordAsync,
      payload.user
    );
    console.log(registerUser);
    if (registerUser.error) {
      yield put(registerUserError(registerUser.msg));
    } else {
      localStorage.removeItem('auth_id');
      localStorage.removeItem('access_token');
      yield put(registerUserSuccess(registerUser.msg));
      history.push('/');
    }
  } catch (error) {
    yield put(registerUserError(error));
  }
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
  localStorage.removeItem('auth_id');
  localStorage.removeItem('access_token');
};

function* logout({ payload }) {
  console.log('logout');
  const { history } = payload;
  try {
    yield call(logoutAsync, history);
    history.push('/');
  } catch (error) {}
}

export function* watchForgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async (email) => {
  // return await auth
  //   .sendPasswordResetEmail(email)
  //   .then((user) => {
  //     console.log('ForgetPassword user: ', user);
  //     return user;
  //   })
  //   .catch((error) => {
  //     console.log('ForgetPassword error: ', error);
  //     return error;
  //   });
};

function* forgotPassword({ payload }) {
  const { email } = payload.forgotUserMail;
  try {
    const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
    console.log('forgotPasswordStatus: ', forgotPasswordStatus);
    if (!forgotPasswordStatus) {
      yield put(forgotPasswordSuccess('success'));
    } else {
      yield put(forgotPasswordError(forgotPasswordStatus.message));
    }
  } catch (error) {
    yield put(forgotPasswordError(error));
  }
}

export function* watchResetPassword() {
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
  // return await auth
  //   .confirmPasswordReset(resetPasswordCode, newPassword)
  //   .then((user) => user)
  //   .catch((error) => error);
};

function* resetPassword({ payload }) {
  const { newPassword, resetPasswordCode } = payload;
  try {
    const resetPasswordStatus = yield call(
      resetPasswordAsync,
      resetPasswordCode,
      newPassword
    );
    if (!resetPasswordStatus) {
      yield put(resetPasswordSuccess('success'));
    } else {
      yield put(resetPasswordError(resetPasswordStatus.message));
    }
  } catch (error) {
    yield put(resetPasswordError(error));
  }
}

export function* watchEditUser() {
  yield takeEvery(EDIT_USER, editUser);
}
const editUserAsync = async (name, photoURL) => {
  var user = {};
  // if (user.email !== email) {
  //   await user.updateEmail(email);
  // }
  if (user.displayName !== name || user.photoURL !== photoURL) {
    await user.updateProfile({ photoURL, displayName: name });
  }
  //await user.updatePassword(password);
};

function* editUser({ payload }) {
  console.log(payload);
  const { name, photoURL } = payload.user;
  try {
    yield call(editUserAsync, name, photoURL);
    yield put(editUserSuccess('Successfully modified!'));
  } catch (error) {
    yield put(editUserError(error));
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
    fork(watchForgotPassword),
    fork(watchResetPassword),
    fork(watchEditUser),
    fork(watchGetUser),
  ]);
}
