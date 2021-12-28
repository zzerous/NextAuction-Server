import {
    ACTIVE_USER_AUCTION,
    FINALIZE_USER_AUCTION,
    SET_AUCFEED,
    SET_USERAUC
  } from 'redux/actions/actionTypes'
  
  const initialState = {
    userAuction: false,
    aucfeed: null,
    userauc: null,
  }
  
  const auctionReducer = (state = initialState, action) => {
    switch (action.type) {
      case ACTIVE_USER_AUCTION:
        return {
          ...state,
          userAuction: true,
        }
      case FINALIZE_USER_AUCTION:
        return {
          ...state,
          userAuction: false,
        }
      case SET_AUCFEED:
        return {
          ...state,
          aucfeed: action.payload.aucfeed,
        }
      case SET_USERAUC:
        return {
          ...state,
          userauc: action.payload.userauc,
        }
      default:
        return state
    }
  }
  
  export default auctionReducer
  