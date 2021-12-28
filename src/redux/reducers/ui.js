import {
  SHOW_MODAL,
  HIDE_MODAL,
} from 'redux/actions/actionTypes'

const initialState = {
  modal: null,
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        modal: action.payload.content,
      }
    case HIDE_MODAL:
      return {
        ...state,
        modal: null,
      }
    default:
      return state
  }
}

export default uiReducer
