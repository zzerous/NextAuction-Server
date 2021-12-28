import object from 'klaytn/Contracts'
import React, { Component } from 'react'
import Input from 'components/Input'
const AuctionContract = object.AuctionContract;

import './AuctionDoneInfo.scss'

class AuctionDoneInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bidder: '',
            amount : '',
            fee: '',
        };
      }

    async componentDidMount() {
        const { aucID } = this.props;

        const bid = await AuctionContract.methods.getCurrentBid(aucID).call({from:klaytn.selectedAddress})
        const bidAmount = caver.utils.fromPeb(bid[1], 'KLAY');
        const feeAmount = bidAmount*(9/10);

        this.setState({
            bidder: bid[0],
            amount: bidAmount,
            fee: feeAmount
        })
          
    }

  render() {
    const { aucName, aucDesc } = this.props;
    const { bidder, amount, fee } = this.state;
    return (
      <div className="AuctionDoneInfo">
        <Input
          className="AuctionDoneInfo__infoName"
          name="auctionName"
          label="Auction Name"
          value={aucName}
          readOnly
        />
        <Input
          className="AuctionDoneInfo__description"
          name="auctionDescription"
          label="Auction Description"
          value={aucDesc}
          readOnly
        />
        <Input
          className="AuctionDoneInfo__bidder"
          name="auctionBidder"
          label="Auction Winning Bidder"
          value={bidder}
          readOnly
        />
        <Input
          className="AuctionDoneInfo__amount"
          name="auctionAmount"
          label="Auction Winning Bid Amount"
          value={amount}
          readOnly
        /> 
        <Input
          className="Input__input--final"
          name="auctionFee"
          label="Amount to be paid ( include the fee 10% )"
          value={fee}
          final={true}
          readOnly
        />         
      </div>
    )
  }
}

export default AuctionDoneInfo
