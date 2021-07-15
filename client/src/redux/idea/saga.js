import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { getDateWithFormat, getCurrentTime } from '../../helpers/Utils';
import axios from 'axios';
import {
  IDEA_GET_LIST,
  IDEA_ADD_ITEM,
  IDEA_EDIT_ITEM,
  VOTE_UP,
  VOTE_DOWN,
  IDEA_DELETE,
  IDEA_COMMENT,
} from '../actions';

import {
  getIdeaListSuccess,
  getIdeaListError,
  addIdeaItemSuccess,
  addIdeaItemError,
  editIdeaItemSuccess,
  editIdeaItemError,
  voteUpError,
  voteUpSuccess,
  voteDownSuccess,
  voteDownError,
  deleteIdeaSuccess,
  deleteIdeaError,
  addCommentSuccess,
  addCommentError,
} from './actions';
// import { store, auth } from "../../helpers/Firebase";

const getIdeaListRequest = async (boardId) => {
  // let res = await store
  //   .collection('ideas')
  //   .get()
  //   .then((querySnapshot) => {
  //     let result = querySnapshot.docs.map((doc) => {
  //       return { id: doc.id, ...doc.data() };
  //     });
  //     if (result.length === 0) return [];
  //     else return result;
  //   });
  // let ideas = res.filter((item) => item.boardId === boardId);
  // return ideas;
};

function* getIdeaListItems(action) {
  try {
    const response = yield call(getIdeaListRequest, action.payload);
    yield put(getIdeaListSuccess(response));
  } catch (error) {
    yield put(getIdeaListError(error));
  }
}

const addIdeaItemRequest = async (item) => {
  item.createDate = getDateWithFormat();
  item.updateDate = getDateWithFormat();
  // const res = await store.collection('ideas').add(item);
  // axios.get(
  //   'https://us-central1-test-5d5bf.cloudfunctions.net/sendMail?title=' +
  //     item.title +
  //     '&status=new&username=' +
  //     item.username +
  //     '&email=' +
  //     item.email +
  //     '&hub=' +
  //     item.hubname
  // );
  // return { id: res.id, ...item };
};

function* addIdeaItem({ payload }) {
  try {
    const response = yield call(addIdeaItemRequest, payload);
    yield put(addIdeaItemSuccess(response));
  } catch (error) {
    yield put(addIdeaItemError(error));
  }
}
const editIdeaItemRequest = async (item) => {
  item.updateDate = getDateWithFormat();
  // let idea_collection = store.collection('ideas').doc(item.id);
  // var data = Object.assign({}, item);
  // delete data.id;

  // idea_collection.get().then(function (thisdoc) {
  //   if (thisdoc.exists) {
  //     const olddata = thisdoc.data();

  //     idea_collection.update(data);
  //     console.log(item);
  //     if (olddata.title !== item.title || olddata.detail !== item.detail)
  //       axios.get(
  //         'https://us-central1-test-5d5bf.cloudfunctions.net/sendMail?title=' +
  //           item.title +
  //           '&status=change&username=' +
  //           item.username +
  //           '&email=' +
  //           item.email +
  //           '&hub=' +
  //           item.hubname
  //       );
  //     else if (olddata.status !== item.status)
  //       axios.get(
  //         'https://us-central1-test-5d5bf.cloudfunctions.net/sendMail?title=' +
  //           item.title +
  //           '&status=' +
  //           item.status +
  //           '&username=' +
  //           item.username +
  //           '&fromstatus=' +
  //           olddata.status +
  //           '&email=' +
  //           item.email +
  //           '&hub=' +
  //           item.hubname
  //       );
  //   }
  // });
  // return item;
};

function* editIdeaItem({ payload }) {
  try {
    const response = yield call(editIdeaItemRequest, payload);
    yield put(editIdeaItemSuccess(response));
  } catch (error) {
    yield put(editIdeaItemError(error));
  }
}

function* voteUpSaga({ payload }) {
  try {
    const response = yield call(voteUpRequest, payload);
    yield put(voteUpSuccess(response));
  } catch (error) {
    yield put(voteUpError(error));
  }
}
const voteUpRequest = async (payload) => {
  // let idea_collection = store.collection('ideas').doc(payload.ideaid);
  // idea_collection.get().then(function (thisdoc) {
  //   if (thisdoc.exists) {
  //     let temp = thisdoc.data();
  //     if (payload.isDisliked)
  //       temp.dislikeUsers = temp.dislikeUsers.filter(
  //         (item) => item !== payload.userid
  //       );
  //     else temp.likeUsers.push(payload.userid);
  //     console.log(temp);
  //     idea_collection.update(temp);
  //   }
  // });
  // return payload;
};
function* voteDownSaga({ payload }) {
  try {
    const response = yield call(voteDownRequest, payload);
    yield put(voteDownSuccess(response));
  } catch (error) {
    yield put(voteDownError(error));
  }
}
const voteDownRequest = async (payload) => {
  // let idea_collection = store.collection('ideas').doc(payload.ideaid);
  // console.log(payload);
  // idea_collection.get().then(function (thisdoc) {
  //   if (thisdoc.exists) {
  //     let temp = thisdoc.data();
  //     if (payload.isLiked)
  //       temp.likeUsers = temp.likeUsers.filter(
  //         (item) => item !== payload.userid
  //       );
  //     else temp.dislikeUsers.push(payload.userid);
  //     idea_collection.update(temp);
  //   }
  // });
  // return payload;
};
function* deleteIdea({ payload }) {
  try {
    const response = yield call(deleteIdeaRequest, payload);
    yield put(deleteIdeaSuccess(response));
  } catch (error) {
    yield put(deleteIdeaError(error));
  }
}
const deleteIdeaRequest = async (payload) => {
  // await store.collection('ideas').doc(payload).delete();
  return payload;
};
function* addComment({ payload }) {
  try {
    const response = yield call(addCommentRequest, payload);
    yield put(addCommentSuccess(response));
  } catch (error) {
    yield put(addCommentError(error));
  }
}
const addCommentRequest = async (payload) => {
  // let idea_collection = store.collection('ideas').doc(payload.ideaid);
  // const newcomment = {
  //   username: auth.currentUser.displayName,
  //   photoURL: auth.currentUser.photoURL,
  //   comment: payload.comment,
  //   createDate: getDateWithFormat() + ' ' + getCurrentTime(),
  // };
  // idea_collection.get().then(function (thisdoc) {
  //   if (thisdoc.exists) {
  //     let data = thisdoc.data();
  //     if (data.comments) data.comments.push(newcomment);
  //     else data.comments = [newcomment];
  //     idea_collection.update(data);
  //   }
  // });
  // return { id: payload.ideaid, ...newcomment };
};
export function* watchGetList() {
  yield takeEvery(IDEA_GET_LIST, getIdeaListItems);
}

export function* watchAddItem() {
  yield takeEvery(IDEA_ADD_ITEM, addIdeaItem);
}

export function* watchEditItem() {
  yield takeEvery(IDEA_EDIT_ITEM, editIdeaItem);
}
export function* wathcVoteUp() {
  yield takeEvery(VOTE_UP, voteUpSaga);
}

export function* watchVoteDown() {
  yield takeEvery(VOTE_DOWN, voteDownSaga);
}
export function* watchDeleteIdea() {
  yield takeEvery(IDEA_DELETE, deleteIdea);
}
export function* watchAddComment() {
  yield takeEvery(IDEA_COMMENT, addComment);
}
export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchEditItem),
    fork(wathcVoteUp),
    fork(watchVoteDown),
    fork(watchDeleteIdea),
    fork(watchAddComment),
  ]);
}
