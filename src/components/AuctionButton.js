import React, {Component} from 'react'
import { connect } from 'react-redux'
import './AuctionButton.scss'

import * as aucActions from 'redux/actions/auctions'

class AuctionButton extends Component{

    render() {
        const { finishUserAuction } = this.props;
        return (
            <button
              className="AuctionButton"
              onClick={finishUserAuction}
            >
                Go Auction
            </button>
        )
    }

}

const mapDispatchToProps = (dispatch) => ({
    finishUserAuction: () => dispatch(aucActions.finalizeUserAuction())
})
export default connect(null, mapDispatchToProps)(AuctionButton)