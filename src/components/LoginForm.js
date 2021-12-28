import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from 'components/Button'

import * as loginActions from 'redux/actions/login'

import './LoginForm.scss'

class LoginForm extends Component {
  
  handleLogin = () => {
    this.props.login()
  }

  render() {
    return (
      <div className="LoginForm">
        <h2 className="LoginForm__h2">
          NextAuction<br />
          Klaytn-Based NFT Auction Service
        </h2>
        <Button
          className="LoginForm__button"
          title="Log in"
          onClick={this.handleLogin}
        />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(loginActions.login()),
})

export default connect(null, mapDispatchToProps)(LoginForm)
