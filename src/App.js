import React, { Component } from 'react'
import { connect } from 'react-redux'
import AuctionPage from 'pages/AuctionPage'
import LoginPage from 'pages/LoginPage'
import Nav from 'components/Nav'
import Modal from 'components/Modal'

import * as loginActions from 'redux/actions/login'

import './App.scss'

class App extends Component {
  constructor(props) {
    super(props)

    const addressFromSession = sessionStorage.getItem("accountInstance")
    const { setAccount, removeWallet } = this.props

    console.log(sessionStorage)
    if (addressFromSession) {
      try{
        setAccount()
      } catch (e) {
        removeWallet()
      }
    }
  }
  

  render() {
    const { isLoggedIn, address  } = this.props
    return (
      <div className="App">
        <Modal />
        {isLoggedIn && <Nav address={address} title="NextAuction"/>}
        {isLoggedIn ? <AuctionPage/> : <LoginPage/>}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.login.isLoggedIn,
  address: state.login.address,
})

const mapDispatchToProps = (dispatch) => ({
  setAccount: () => dispatch(loginActions.setAccount()),
  removeWallet: () => dispatch(loginActions.removeWallet()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
