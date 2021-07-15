import {
  GET_USER_INFO,
  SET_USER_ERROR,
  EDIT_USER_SUCCESS,
  EDIT_USER_ERROR,
  EDIT_USER,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  TRAINER_UPDATE_AVATAR,
} from '../actions';

const INIT_STATE = {
  authID: localStorage.getItem('auth_id'),
  email: '',
  forgotUserMail: '',
  newPassword: '',
  resetPasswordCode: '',
  loading: false,
  error: '',
  displayName: '',
  role: localStorage.getItem('user_role'),
  avatar: '',
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_USER_ERROR:
      return {
        ...state,
        error: null,
      };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case EDIT_USER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    case EDIT_USER:
      return { ...state, loading: true, error: '' };
    case LOGIN_USER:
      return { ...state, loading: true, error: '' };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        authID: action.payload._id,
        email: action.payload.email,
        role: action.payload.role,
        displayName: `${action.payload.firstName} ${action.payload.lastName}`,
        error: '',
        avatar: action.payload.avatar,
      };
    case LOGIN_USER_ERROR:
      return {
        ...state,
        loading: false,
        user: '',
        error: action.payload.message,
      };
    case FORGOT_PASSWORD:
      return { ...state, loading: true, error: '' };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        forgotUserMail: action.payload,
        error: '',
      };
    case FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        forgotUserMail: '',
        error: action.payload.message,
      };
    case RESET_PASSWORD:
      return { ...state, loading: true, error: '' };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        newPassword: action.payload,
        resetPasswordCode: '',
        error: '',
      };
    case RESET_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        newPassword: '',
        resetPasswordCode: '',
        error: action.payload.message,
      };
    case REGISTER_USER:
      return { ...state, loading: true, error: '' };
    case REGISTER_USER_SUCCESS:
      return { ...state, loading: false, error: action.payload.message };
    case REGISTER_USER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    case LOGOUT_USER:
      return { ...state, authID: null, error: '', ...INIT_STATE };
    case TRAINER_UPDATE_AVATAR:
      return { ...state, avatar: action.payload.avatar };
    default:
      return { ...state };
  }
};
