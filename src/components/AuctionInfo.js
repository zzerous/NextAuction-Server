import object from 'klaytn/Contracts'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Button from 'components/Button'
import Input from 'components/Input'
import BidAuction from 'components/BidAuction'
import CheckCancel from 'components/CheckCancel'
const fdURL = "http://203.250.77.156:3001/"
const StorageContract = object.StorageContract;
const AuctionContract = object.AuctionContract;

import * as contentActions from 'redux/actions/contents'

import './AuctionInfo.scss'

class AuctionInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  bidOnAuction = async (e) => {
    e.preventDefault();
    const { aucID, NFT } = this.props;
    console.log(aucID);
    const bids = await AuctionContract.methods.getBidhistory(aucID).call({from:klaytn.selectedAddress})
    console.log(bids);
    const len = bids.length;
    const history = []
    for (var i=len; i>0; i--){
      var from = bids[i-1].from;
      var amount = caver.utils.fromPeb(bids[i-1].amount, 'KLAY');
      history.push("입찰자 : "+from+" 입찰가 : "+amount+"KLAY\n\n");  
    }

    await ui.showModal({
      header: 'Bidding Auction',
      content: <BidAuction 
                  aucID = {aucID}
                  NFT={NFT}
                  bidHistory={history.join(" ")}
                />,
    }) 

    /**
     * Fee delegation - bid 
     */


    // const bidAucTxData = {
    //   type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
    //   from: klaytn.selectedAddress,
    //   to: DEPLOYED_ADDRESS_AUCTION,
    //   gas: 2000000,
    //   data: AuctionContract.methods.bidAuction(aucID).encodeABI(),
    //   value: caver.utils.toPeb('2','KLAY'),
    // }
    // const { rawTransaction : metaRawTransaction } = await caver.klay.signTransaction(bidAucTxData)
    
    // const resMETA = await axios({
    //   url: fdURL+"bidAucFD",
    //   method: "post",
    //   data:{
    //     senderRawTransaction: metaRawTransaction,
    //   },
    //   json:true
    // })
    // console.log('BID_AUC_'+resMETA.statusText);
    // ui.hideModal()
  }

  render() {
    const { aucID, aucName, aucEXP, aucMIN, aucDesc, contentCreator, contentOwner, image, isUserAuction } = this.props
    console.log(isUserAuction);
    return (
      <div className="AuctionInfo">
        <div className="AuctionInfo__image">
          <img 
            src={image} alt="image" />
        </div>
        <Input
          className="AuctionInfo__infoName"
          name="auctionName"
          label="Auction Name"
          value={aucName}
          readOnly
        />
        <Input
          className="AuctionInfo__infoEXP"
          name="auctionEXP"
          label="Auction Expiretime"
          value={aucEXP}
          readOnly
        />
        <Input
          className="AuctionInfo__infoMIN"
          name="auctionPrice"
          label="Auction Min Price"
          value={aucMIN}
          readOnly
        />
        <Input
          className="AuctionInfo__description"
          name="auctionDescription"
          label="Auction Description"
          value={aucDesc}
          readOnly
        />
        <Input
          className="AuctionInfo__contentCreator"
          name="contentCreator"
          label="Content Created by"
          value={contentCreator}
          readOnly
        />
        <Input
          className="AuctionInfo__contentOwner"
          name="contentOwner"
          label="Content Owned by"
          value={contentOwner}
          readOnly
        />        
        <Button
          className="AuctionInfo__auction"
          onClick={this.bidOnAuction}
          title="Place Bid"
        />
        {isUserAuction && 
          <Button
            className="Button__delete"
            onClick={()=> ui.showModal({
              header: 'Cancel Auction',
              content: <CheckCancel aucID={aucID} />
            })}
            title="Auction Cancel"            
          />}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isUserAuction: state.auctions.userAuction,
})

export default connect(mapStateToProps, null)(AuctionInfo)
