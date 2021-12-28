import caver from 'klaytn/caver'
import {
  LOGIN,
  LOGOUT,
  SET_ACCOUNT,
  REMOVE_WALLET,
} from './actionTypes'

export const login = () => async (dispatch) => {
  const {klaytn} = window
  if (klaytn === undefined) return
  await klaytn.enable()

  dispatch(setAccount(klaytn))
  klaytn.on('accountsChanged', () => dispatch(setAccount(klaytn)))
  return dispatch({
    type: LOGIN,
  })
}

export const setAccount = () => (dispatch) => {
  const address = klaytn.selectedAddress
  const balance = caver.klay.getBalance(address)
  sessionStorage.setItem("accountInstance", address);
  return dispatch({
    type: SET_ACCOUNT,
    payload: {
      address,
      balance,
      //balance: caver.utils.fromPeb(balance, 'KLAY'),
    }
  })
}

export const logout = () => (dispatch) => {
  dispatch(removeWallet())
  return dispatch({
    type: LOGOUT,
  })
}

export const removeWallet = () => (dispatch) => {
  caver.klay.accounts.wallet.clear()
  sessionStorage.removeItem("accountInstance")
  return dispatch({
    type: REMOVE_WALLET,
  })
}