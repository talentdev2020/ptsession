import {
  CLIENT_GET_LIST,
  CLIENT_GET_LIST_SUCCESS,
  CLIENT_GET_LIST_ERROR,
  CLIENT_GET_LIST_WITH_FILTER,
  CLIENT_GET_LIST_WITH_ORDER,
  CLIENT_GET_LIST_SEARCH,
  CLIENT_ADD_ITEM,
  CLIENT_ADD_ITEM_SUCCESS,
  CLIENT_ADD_ITEM_ERROR,
  CLIENT_EDIT_ITEM,
  CLIENT_EDIT_ITEM_SUCCESS,
  CLIENT_EDIT_ITEM_ERROR,
  CLIENT_SELECTED_ITEMS_CHANGE,
  CLIENT_SEND_INVITATION,
  CLIENT_SEND_INVITATION_SUCCESS,
  CLIENT_SEND_INVITATION_ERROR,
  CLIENT_ACCEPT_INVITATION,
  CLIENT_ACCEPT_INVITATION_SUCCESS,
  CLIENT_ACCEPT_INVITATION_ERROR,
  CLIENT_SEND_INVITATION_EMAIL,
  CLIENT_GET_ITEM,
  CLIENT_GET_ITEM_SUCCESS,
  UPDATE_PROFILE,
  INIT_ERROR_STATE,
  TRAINER_ADD_PACKAGE,
  TRAINER_EDIT_PACKAGE,
  TRAINER_REMOVE_PACKAGE,
} from '../actions';

export const getClientList = (user) => ({
  type: CLIENT_GET_LIST,
  payload: user,
});

export const getClientListSuccess = (items) => ({
  type: CLIENT_GET_LIST_SUCCESS,
  payload: items,
});

export const getClientListError = (error) => ({
  type: CLIENT_GET_LIST_ERROR,
  payload: error,
});

export const getClientListWithFilter = (column, value) => ({
  type: CLIENT_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getClientListWithOrder = (column) => ({
  type: CLIENT_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getClientListSearch = (keyword) => ({
  type: CLIENT_GET_LIST_SEARCH,
  payload: keyword,
});

export const addClientItem = (item) => ({
  type: CLIENT_ADD_ITEM,
  payload: item,
});

export const addClientItemSuccess = (items) => ({
  type: CLIENT_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addClientItemError = (error) => ({
  type: CLIENT_ADD_ITEM_ERROR,
  payload: error,
});
export const editClientItem = (item) => ({
  type: CLIENT_EDIT_ITEM,
  payload: item,
});

export const editClientItemSuccess = (items) => ({
  type: CLIENT_EDIT_ITEM_SUCCESS,
  payload: items,
});

export const editClientItemError = (error) => ({
  type: CLIENT_EDIT_ITEM_ERROR,
  payload: error,
});
export const selectedClientItemsChange = (selectedItems) => ({
  type: CLIENT_SELECTED_ITEMS_CHANGE,
  payload: selectedItems,
});

export const sendInvitation = (client) => ({
  type: CLIENT_SEND_INVITATION,
  payload: client,
});

export const sendInvitationSuccess = (msg) => ({
  type: CLIENT_SEND_INVITATION_SUCCESS,
  payload: msg,
});

export const sendInvitationError = (msg) => ({
  type: CLIENT_SEND_INVITATION_ERROR,
  payload: msg,
});

export const acceptInvitation = ({ payload }) => ({
  type: CLIENT_ACCEPT_INVITATION,
  payload,
});

export const acceptInvitationSuccess = (payload) => ({
  type: CLIENT_ACCEPT_INVITATION_SUCCESS,
  payload,
});

export const acceptInvitationError = (payload) => ({
  type: CLIENT_ACCEPT_INVITATION_ERROR,
  payload,
});

export const sendInvitationToEmail = (payload) => ({
  type: CLIENT_SEND_INVITATION_EMAIL,
  payload,
});

export const getItem = ({ payload: clientID }) => ({
  type: CLIENT_GET_ITEM,
  clientID,
});

export const getItemSuccess = (payload) => ({
  type: CLIENT_GET_ITEM_SUCCESS,
  payload,
});

export const updateProfile = (payload) => ({
  type: UPDATE_PROFILE,
  payload,
});

export const initErrorState = () => ({
  type: INIT_ERROR_STATE,
});

export const addPackage = (payload) => ({
  type: TRAINER_ADD_PACKAGE,
  payload,
});

export const editPackage = (payload) => ({
  type: TRAINER_EDIT_PACKAGE,
  payload,
});

export const removePackage = (payload) => ({
  type: TRAINER_REMOVE_PACKAGE,
  payload,
});
