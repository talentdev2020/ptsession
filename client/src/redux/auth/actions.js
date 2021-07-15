import {
  GET_USER_INFO,
  SET_USER_ERROR,
  EDIT_USER,
  EDIT_USER_SUCCESS,
  EDIT_USER_ERROR,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  LOGIN_USER_ERROR,
  REGISTER_USER_ERROR,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  TRAINER_UPDATE_AVATAR,
} from '../actions';
export const setUserError = () => ({
  type: SET_USER_ERROR,
});
export const loginUser = (user, history) => ({
  type: LOGIN_USER,
  payload: { user, history },
});
export const editUser = (user, history) => ({
  type: EDIT_USER,
  payload: { user, history },
});
export const editUserSuccess = (messasge) => ({
  type: EDIT_USER_SUCCESS,
  payload: messasge,
});
export const editUserError = (message) => ({
  type: EDIT_USER_ERROR,
  payload: { message },
});
export const loginUserSuccess = (user) => ({
  type: LOGIN_USER_SUCCESS,
  payload: user,
});
export const loginUserError = (message) => ({
  type: LOGIN_USER_ERROR,
  payload: { message },
});

export const forgotPassword = (forgotUserMail, history) => ({
  type: FORGOT_PASSWORD,
  payload: { forgotUserMail, history },
});
export const forgotPasswordSuccess = (forgotUserMail) => ({
  type: FORGOT_PASSWORD_SUCCESS,
  payload: forgotUserMail,
});
export const forgotPasswordError = (message) => ({
  type: FORGOT_PASSWORD_ERROR,
  payload: { message },
});

export const resetPassword = ({ resetPasswordCode, newPassword, history }) => ({
  type: RESET_PASSWORD,
  payload: { resetPasswordCode, newPassword, history },
});
export const resetPasswordSuccess = (newPassword) => ({
  type: RESET_PASSWORD_SUCCESS,
  payload: newPassword,
});
export const resetPasswordError = (message) => ({
  type: RESET_PASSWORD_ERROR,
  payload: { message },
});

export const registerUser = (user, history) => ({
  type: REGISTER_USER,
  payload: { user, history },
});
export const registerUserSuccess = (message) => ({
  type: REGISTER_USER_SUCCESS,
  payload: { message },
});
export const registerUserError = (message) => ({
  type: REGISTER_USER_ERROR,
  payload: { message },
});

export const logoutUser = (history) => ({
  type: LOGOUT_USER,
  payload: { history },
});

export const getUserInfo = (history) => ({
  type: GET_USER_INFO,
  payload: { history },
});

export const updateAvatar = (data) => ({
  type: TRAINER_UPDATE_AVATAR,
  payload: data,
});
