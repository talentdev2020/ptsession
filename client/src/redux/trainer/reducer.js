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
  CLIENT_GET_ITEM,
  CLIENT_GET_ITEM_SUCCESS,
  CLIENT_SEND_INVITATION_SUCCESS,
  CLIENT_SEND_INVITATION_ERROR,
  CLIENT_ACCEPT_INVITATION_SUCCESS,
  CLIENT_ACCEPT_INVITATION_ERROR,
  INIT_ERROR_STATE,
  TRAINER_ADD_PACKAGE,
  TRAINER_EDIT_PACKAGE,
  TRAINER_REMOVE_PACKAGE,
} from '../actions';

const INIT_STATE = {
  allClientItems: null,
  clientItems: null,
  error: false,
  errorMsg: '',
  filter: null,
  searchKeyword: '',
  orderColumn: null,
  loading: false,
  orderColumns: [
    { column: 'title', label: 'Title' },
    { column: 'status', label: 'Status' },
    { column: 'createDate', label: 'Last Updated' },
  ],
  selectedClient: {},
  avatar: '',
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CLIENT_GET_LIST:
      return { ...state, loading: false };

    case CLIENT_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        allClientItems: action.payload.allClients,
        clientItems: action.payload.clients,
      };

    case CLIENT_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case CLIENT_GET_LIST_WITH_FILTER:
      if (action.payload.column === '' || action.payload.value === '') {
        return {
          ...state,
          loading: true,
          clientItems: state.allClientItems,
          filter: null,
        };
      } else {
        const filteredItems = state.allClientItems.filter(
          (item) => item[action.payload.column] === action.payload.value
        );
        return {
          ...state,
          loading: true,
          clientItems: filteredItems,
          filter: {
            column: action.payload.column,
            value: action.payload.value,
          },
        };
      }

    case CLIENT_GET_LIST_WITH_ORDER:
      if (action.payload === '') {
        return {
          ...state,
          loading: true,
          clientItems: state.clientItems,
          orderColumn: null,
        };
      } else {
        const sortedItems = state.clientItems.sort((a, b) => {
          if (a[action.payload] < b[action.payload]) return -1;
          else if (a[action.payload] > b[action.payload]) return 1;
          return 0;
        });
        return {
          ...state,
          loading: true,
          clientItems: sortedItems,
          orderColumn: state.orderColumns.find(
            (x) => x.column === action.payload
          ),
        };
      }

    case CLIENT_GET_LIST_SEARCH:
      if (action.payload === '') {
        return { ...state, clientItems: state.allClientItems };
      } else {
        const keyword = action.payload.toLowerCase();
        const searchItems = state.allClientItems.filter(
          (item) => item.title.toLowerCase().indexOf(keyword) > -1
        );
        return {
          ...state,
          loading: true,
          clientItems: searchItems,
          searchKeyword: action.payload,
        };
      }

    case CLIENT_ADD_ITEM:
      return { ...state, loading: false };

    case CLIENT_ADD_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allClientItems: [action.clientad, ...state.allClientItems],
        clientItems: [action.payload, ...state.clientItems],
      };

    case CLIENT_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };
    case CLIENT_EDIT_ITEM:
      return { ...state, loading: false };

    case CLIENT_EDIT_ITEM_SUCCESS:
      let t_allClientItems;
      t_allClientItems = state.allClientItems.map((item) => {
        if (item.client === action.payload.id) {
          return action.payload;
        }
        return item;
      });
      let t_clientItems;
      t_clientItems = state.clientItems.map((item) => {
        if (item.id === action.payload.id) return action.payload;
        return item;
      });
      return {
        ...state,
        loading: true,
        allClientItems: t_allClientItems,
        clientItems: t_clientItems,
      };

    case CLIENT_EDIT_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };
    case CLIENT_SELECTED_ITEMS_CHANGE:
      return { ...state, loading: true };
    case CLIENT_GET_ITEM:
      return { ...state, loading: true };
    case CLIENT_GET_ITEM_SUCCESS:
      return { ...state, selectedClient: action.payload, loading: false };
    case CLIENT_SEND_INVITATION_SUCCESS:
      return { ...state, error: false, errorMsg: action.payload };
    case CLIENT_SEND_INVITATION_ERROR:
      return { ...state, error: true, errorMsg: action.payload };
    case CLIENT_ACCEPT_INVITATION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        errorMsg: action.payload,
      };
    case CLIENT_ACCEPT_INVITATION_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    case INIT_ERROR_STATE:
      return { ...state, error: false, errorMsg: '' };
    case TRAINER_ADD_PACKAGE:
      return { ...state, selectedClient: action.payload };
    case TRAINER_EDIT_PACKAGE:
      return { ...state, selectedClient: action.payload };
    case TRAINER_REMOVE_PACKAGE:
      return { ...state, selectedClient: action.payload };
    default:
      return { ...state };
  }
};
