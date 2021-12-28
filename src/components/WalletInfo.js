import React, { Component } from 'react'
import caver from 'klaytn/caver'
import Input from 'components/Input'
import './WalletInfo.scss'

class WalletInfo extends Component {
  state = {
    balance: '0',
  }

  componentDidMount() {
    this.getBalance()
  }

  getBalance = (address = this.props.address) => {
    if (!address) return
    caver.klay.getBalance(address).then((balance) => {
      this.setState({
        balance: caver.utils.fromWei(balance, 'ether'),
      })
    })
  }

  render() {
    const { address } = this.props
    return (
      <div className="WalletInfo">
        <Input
          className="WalletInfo__address"
          name="address"
          label="Wallet Address"
          value={address}
          readOnly
        />
        <Input
          className="WalletInfo__balance"
          name="balance"
          label="Balance"
          value={`${this.state.balance} KLAY`}
          readOnly
        />
      </div>
    )
  }
}

export default WalletInfo
