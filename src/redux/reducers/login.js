import {
  LOGIN,
  LOGOUT,
  SET_ACCOUNT,
  REMOVE_WALLET,
} from 'redux/actions/actionTypes'

const initialState = {
  isLoggedIn: false,
  //isLoggedIn: !!sessionStorage.getItem("accountInstance"),
  address: null,
  balance: null,
}

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
      }
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        address: null,
      }
    case SET_ACCOUNT:
      return {
        ...state,
        address: action.payload.address,
        balance: action.payload.balance,
        }
    case REMOVE_WALLET:
      return {
        ...state,
        //privateKey: null,
        address: null,
      }
    default:
      return state
  }
}

export default loginReducer
