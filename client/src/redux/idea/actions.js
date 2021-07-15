import {
  IDEA_COMMENT,
  IDEA_COMMENT_SUCCESS,
  IDEA_COMMENT_ERROR,
  IDEA_DELETE,
  IDEA_DELETE_SUCCESS,
  IDEA_DELETE_ERROR,
  VOTE_UP,
  VOTE_UP_SUCCESS,
  VOTE_UP_ERROR,
  VOTE_DOWN,
  VOTE_DOWN_SUCCESS,
  VOTE_DOWN_ERROR,
  CLIENT_SET_CURRENTID,
  IDEA_GET_LIST,
  IDEA_GET_LIST_SUCCESS,
  IDEA_GET_LIST_ERROR,
  IDEA_GET_LIST_WITH_FILTER,
  IDEA_GET_LIST_WITH_ORDER,
  IDEA_GET_LIST_SEARCH,
  IDEA_ADD_ITEM,
  IDEA_ADD_ITEM_SUCCESS,
  IDEA_ADD_ITEM_ERROR,
  IDEA_EDIT_ITEM,
  IDEA_EDIT_ITEM_SUCCESS,
  IDEA_EDIT_ITEM_ERROR,
  IDEA_SELECTED_ITEMS_CHANGE,
} from '../actions';

export const getIdeaList = (id) => ({
  type: IDEA_GET_LIST,
  payload: id,
});
export const deleteIdea = (id) => ({
  type: IDEA_DELETE,
  payload: id,
});
export const setCurrentClientId = (id) => ({
  type: CLIENT_SET_CURRENTID,
  payload: id,
});
export const getIdeaListSuccess = (items) => ({
  type: IDEA_GET_LIST_SUCCESS,
  payload: items,
});

export const getIdeaListError = (error) => ({
  type: IDEA_GET_LIST_ERROR,
  payload: error,
});
export const deleteIdeaError = (error) => ({
  type: IDEA_DELETE_ERROR,
  payload: error,
});
export const deleteIdeaSuccess = (payload) => ({
  type: IDEA_DELETE_SUCCESS,
  payload: payload,
});
export const addComment = (payload) => ({
  type: IDEA_COMMENT,
  payload: payload,
});
export const addCommentSuccess = (item) => ({
  type: IDEA_COMMENT_SUCCESS,
  payload: item,
});

export const addCommentError = (error) => ({
  type: IDEA_COMMENT_ERROR,
  payload: error,
});
export const voteUp = (payload) => ({
  type: VOTE_UP,
  payload: payload,
});
export const voteUpSuccess = (item) => ({
  type: VOTE_UP_SUCCESS,
  payload: item,
});

export const voteUpError = (error) => ({
  type: VOTE_UP_ERROR,
  payload: error,
});
export const voteDown = (payload) => ({
  type: VOTE_DOWN,
  payload: payload,
});
export const voteDownSuccess = (item) => ({
  type: VOTE_DOWN_SUCCESS,
  payload: item,
});

export const voteDownError = (error) => ({
  type: VOTE_DOWN_ERROR,
  payload: error,
});
export const getIdeaListWithFilter = (column, value) => ({
  type: IDEA_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getIdeaListWithOrder = (column) => ({
  type: IDEA_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getIdeaListSearch = (keyword) => ({
  type: IDEA_GET_LIST_SEARCH,
  payload: keyword,
});

export const addIdeaItem = (item) => ({
  type: IDEA_ADD_ITEM,
  payload: item,
});

export const addIdeaItemSuccess = (items) => ({
  type: IDEA_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addIdeaItemError = (error) => ({
  type: IDEA_ADD_ITEM_ERROR,
  payload: error,
});
export const editIdeaItem = (item) => ({
  type: IDEA_EDIT_ITEM,
  payload: item,
});

export const editIdeaItemSuccess = (items) => ({
  type: IDEA_EDIT_ITEM_SUCCESS,
  payload: items,
});

export const editIdeaItemError = (error) => ({
  type: IDEA_EDIT_ITEM_ERROR,
  payload: error,
});
export const selectedIdeaItemsChange = (selectedItems) => ({
  type: IDEA_SELECTED_ITEMS_CHANGE,
  payload: selectedItems,
});
