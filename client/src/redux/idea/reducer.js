import {
  IDEA_COMMENT_ERROR,
  IDEA_COMMENT_SUCCESS,
  CLIENT_SET_CURRENTID,
  IDEA_DELETE_SUCCESS,
  IDEA_DELETE_ERROR,
  VOTE_UP_SUCCESS,
  VOTE_UP_ERROR,
  VOTE_DOWN_SUCCESS,
  VOTE_DOWN_ERROR,
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

const INIT_STATE = {
  allIdeaItems: null,
  ideaItems: null,
  error: '',
  filter: null,
  currentClientId: '',
  searchKeyword: '',
  orderColumn: null,
  loading: false,
  orderColumns: [
    { column: 'votes', label: 'Highet Vote' },
    { column: 'updateDate', label: 'Last Updated' },
  ],
  selectedItems: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case IDEA_GET_LIST:
      return { ...state, loading: false };
    case CLIENT_SET_CURRENTID:
      return { ...state, currentClientId: action.payload };
    case IDEA_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        allIdeaItems: action.payload,
        ideaItems: action.payload,
      };
    case IDEA_DELETE_SUCCESS:
      const delete_ideaItems = state.ideaItems.filter(
        (item) => item.id !== action.payload
      );
      const delete_allideaItems = state.allIdeaItems.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        allIdeaItems: delete_allideaItems,
        ideaItems: delete_ideaItems,
      };
    case IDEA_DELETE_ERROR:
      return { ...state, error: action.payload };
    case VOTE_UP_SUCCESS:
      let ideaItems;
      let allIdeaItems;
      if (action.payload.isDisliked) {
        ideaItems = state.ideaItems.map((item) => {
          if (item.id === action.payload.ideaid) {
            item.dislikeUsers = item.dislikeUsers.filter(
              (item) => item !== action.payload.authID
            );
            return item;
          }
          return item;
        });
        allIdeaItems = state.allIdeaItems.map((item) => {
          if (item.id === action.payload.ideaid) {
            item.dislikeUsers = item.dislikeUsers.filter(
              (item) => item !== action.payload.authID
            );
            return item;
          }
          return item;
        });
      } else {
        ideaItems = state.ideaItems.map((item) => {
          if (item.id === action.payload.ideaid) {
            let temp = item;
            temp.likeUsers.push(action.payload.authID);

            return temp;
          }
          return item;
        });

        allIdeaItems = state.allIdeaItems.map((item) => {
          if (item.id === action.payload.ideaid) {
            let temp = item;
            // temp.likeUsers.push(action.payload.authID);

            return temp;
          }
          return item;
        });
      }

      return { ...state, allIdeaItems: allIdeaItems, ideaItems: ideaItems };
    case VOTE_UP_ERROR:
      return { ...state, error: action.payload };
    case VOTE_DOWN_SUCCESS:
      let d_ideaItems;
      let d_allIdeaItems;
      if (action.payload.isLiked) {
        d_ideaItems = state.ideaItems.map((item) => {
          if (item.id === action.payload.ideaid) {
            item.likeUsers = item.likeUsers.filter(
              (item) => item !== action.payload.authID
            );
            return item;
          }
          return item;
        });
        d_allIdeaItems = state.allIdeaItems.map((item) => {
          if (item.id === action.payload.ideaid) {
            item.likeUsers = item.likeUsers.filter(
              (item) => item !== action.payload.authID
            );
            return item;
          }
          return item;
        });
      } else {
        d_ideaItems = state.ideaItems.map((item) => {
          if (item.id === action.payload.ideaid) {
            let temp = item;
            temp.dislikeUsers.push(action.payload.authID);

            return temp;
          }
          return item;
        });

        d_allIdeaItems = state.allIdeaItems.map((item) => {
          if (item.id === action.payload.ideaid) {
            let temp = item;
            // temp.likeUsers.push(action.payload.authID);

            return temp;
          }
          return item;
        });
      }

      return { ...state, allIdeaItems: d_allIdeaItems, ideaItems: d_ideaItems };
    case VOTE_DOWN_ERROR:
      return { ...state, error: action.payload };
    case IDEA_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case IDEA_GET_LIST_WITH_FILTER:
      if (action.payload.column === '' || action.payload.value === '') {
        return {
          ...state,
          loading: true,
          ideaItems: state.allIdeaItems,
          filter: null,
        };
      } else {
        const filteredItems = state.allIdeaItems.filter(
          (item) => item[action.payload.column] === action.payload.value
        );
        return {
          ...state,
          loading: true,
          ideaItems: filteredItems,
          filter: {
            column: action.payload.column,
            value: action.payload.value,
          },
        };
      }

    case IDEA_GET_LIST_WITH_ORDER:
      if (action.payload === '') {
        return {
          ...state,
          loading: true,
          ideaItems: state.IdeaItems,
          orderColumn: null,
        };
      } else {
        const sortedItems = state.ideaItems.sort((a, b) => {
          if (action.payload === 'votes') {
            if (a['likeUsers'].length < b['likeUsers'].length) return 1;
            else if (a['likeUsers'].length > b['likeUsers'].length) return -1;
          } else {
            if (a[action.payload] < b[action.payload]) return 1;
            else if (a[action.payload] > b[action.payload]) return -1;
          }

          return 0;
        });
        return {
          ...state,
          loading: true,
          ideaItems: sortedItems,
          orderColumn: state.orderColumns.find(
            (x) => x.column === action.payload
          ),
        };
      }

    case IDEA_GET_LIST_SEARCH:
      if (action.payload === '') {
        return { ...state, ideaItems: state.allIdeaItems };
      } else {
        const keyword = action.payload.toLowerCase();
        const searchItems = state.allIdeaItems.filter(
          (item) => item.title.toLowerCase().indexOf(keyword) > -1
        );
        return {
          ...state,
          loading: true,
          ideaItems: searchItems,
          searchKeyword: action.payload,
        };
      }

    case IDEA_ADD_ITEM:
      return { ...state, loading: false };

    case IDEA_ADD_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allIdeaItems: [action.payload, ...state.allIdeaItems],
        ideaItems: [action.payload, ...state.ideaItems],
      };

    case IDEA_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };
    case IDEA_COMMENT_SUCCESS:
      console.log(action);
      const add_ideaitems = state.ideaItems.map((item) => {
        if (item.id === action.payload.id) {
          if (item.comments) item.comments.push(action.payload);
          else item.comments = [action.payload];
          console.log(item);
          return item;
        }
        return item;
      });
      console.log(add_ideaitems);
      return {
        ...state,
        loading: true,

        ideaItems: add_ideaitems,
      };
    case IDEA_COMMENT_ERROR:
      return { ...state, loading: true, error: action.payload };
    case IDEA_EDIT_ITEM:
      return { ...state, loading: false };

    case IDEA_EDIT_ITEM_SUCCESS:
      let t_allIdeaItems;
      t_allIdeaItems = state.allIdeaItems.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
      let t_ideaItems;
      t_ideaItems = state.ideaItems.map((item) => {
        if (item.id === action.payload.id) return action.payload;
        return item;
      });
      return {
        ...state,
        loading: true,
        allIdeaItems: t_allIdeaItems,
        ideaItems: t_ideaItems,
      };

    case IDEA_EDIT_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };
    case IDEA_SELECTED_ITEMS_CHANGE:
      return { ...state, loading: true, selectedItems: action.payload };
    default:
      return { ...state };
  }
};
