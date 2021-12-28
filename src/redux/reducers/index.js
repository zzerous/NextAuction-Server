import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import login from './login'
import ui from './ui'
import contents from './contents'
import auctions from './auctions'

const reducer = combineReducers({
  routing: routerReducer,
  login,
  ui,
  contents,
  auctions,
})

export default reducer
