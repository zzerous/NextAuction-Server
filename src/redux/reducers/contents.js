import { 
SET_FEED, 
REQ_CREDENTIAL,
REQ_ACCESSTOKEN,
UPLOAD_CONTENT,
DOWNLOAD_CONTENT
  } from 'redux/actions/actionTypes'

const initialState = {
  feed: null,
  credential: null,
  accessToken: null,
  downloadCert: null,
  downloadToken: null,
}

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FEED:
      return {
        ...state,
        feed: action.payload.feed,
      }
    case REQ_CREDENTIAL:
      return {
        ...state,
        credential: action.payload.credential,
      }
    case REQ_ACCESSTOKEN:
      return {
        ...state,
        accessToken: action.payload.accessToken,
      }
    case UPLOAD_CONTENT:
      return {
        ...state,
        downloadCert: action.payload.downloadCert,
      }
    case DOWNLOAD_CONTENT:
      return {
        ...state,
        downloadToken: action.payload.downloadToken,
      }     
    default:
      return state;
  }
}

export default contentReducer
