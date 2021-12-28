import React, { Component } from 'react'
import { connect } from 'react-redux'

import './ItemRegButton.scss'

import * as auctionActions from 'redux/actions/auctions'

class ItemRegButton extends Component{
  closeAuction = () => {
    const {finalizeAuction} = this.props
    finalizeAuction()
  }

  render(){
    return(
      <button
      className="ItemRegButton"
      onClick={this.closeAuction}
    >
      Go Register
    </button>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  finalizeAuction : () => dispatch(auctionActions.finalizeAuction())
})
export default connect(null, mapDispatchToProps)(ItemRegButton)