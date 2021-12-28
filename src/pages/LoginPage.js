import React, { Component } from 'react'
import LoginForm from 'components/LoginForm'

import './LoginPage.scss'

class LoginPage extends Component {
  render() {
    return (
      <main className="LoginPage">
        <LoginForm />
      </main>
    )
  }
}

export default LoginPage
