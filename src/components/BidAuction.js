import object from 'klaytn/Contracts'
import React, { Component } from 'react';
import ui from 'utils/ui'
import Input from 'components/Input'
import TextArea from 'components/TextArea'
import Button from 'components/Button'
import axios from 'axios';

import './BidAuction.scss'

const {Keccak} = require('sha3');
const HASH = new Keccak(256);
const serviceURL = "http://203.250.77.156:3002/"
const AuctionContract = object.AuctionContract;
const StorageContract = object.StorageContract;

class BidAuction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount : '',
    };
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }


  bidAuction = async (e) => {
    e.preventDefault();
    const { aucID, NFT } = this.props;
    const { amount } = this.state;

    /**
     * content storage 에게 auth를 받기 위해 content meta에 대한 정보와 sign 이 필요
     */
    const tmp = await StorageContract.methods.getOwnershipCert(NFT).call({from:klaytn.selectedAddress})
    const contentMeta = tmp.contentMeta;

    const contentMetaSig = await caver.klay.sign(JSON.stringify(contentMeta), klaytn.selectedAddress);
    const userDID = 'did:kt:'+klaytn.selectedAddress.toLowerCase().substring(2);
    const keyID = userDID+'#key-1';

    const bidAucTxData = {
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from: klaytn.selectedAddress,
      to: DEPLOYED_ADDRESS_AUCTION,
      gas: 2000000,
      data: AuctionContract.methods.bidAuction(aucID).encodeABI(), 
      value: caver.utils.toPeb(amount,'KLAY'),
    }
    const { rawTransaction : metaRawTransaction } = await caver.klay.signTransaction(bidAucTxData)
    
    const resBID = await axios({
      url: serviceURL+"inprocess-auction",
      method: "post",
      data:{
        senderRawTransaction: metaRawTransaction,
        contentMeta: contentMeta,
        contentSig: contentMetaSig,
        userAddr: klaytn.selectedAddress,
        userDID: userDID,
        keyID: keyID,
        aucID: aucID,
        amount: amount

      },
      json:true
    })
    console.log('BID_AUC_'+resBID.data);

    ui.hideModal()     

  }

  render(){
    const { amount } = this.state;
    const { bidHistory } = this.props;

    return (
      
      <div className="BidAuction">

        <TextArea
          className="BidAuction__history"
          name="addrs"
          label="Bid History"
          value={bidHistory}
          cols="300" 
          rows="15"
          readOnly
        />
        <Input
          className="BidAuction__amount"
          name="amount"
          label="Bid Amount (KLAY)"
          value={amount}
          onChange={this.handleInputChange}
          placeholder="Enter the Bid Amount (KLAY)"
          required
        />
        <Button
          className="BidAuction__bid"
          onClick={this.bidAuction}
          title="Bidding"
        />
      </div>
      
    );
  } 
}

export default BidAuction