import React, { Component } from 'react'
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Button from 'components/Button'
import axios from 'axios';

import object from 'klaytn/Contracts'
const StorageContract = object.StorageContract;
const AuctionContract = object.AuctionContract;
const serviceURL = "http://203.250.77.156:3002/"

import './CheckCancel.scss'

import * as aucActions from 'redux/actions/auctions'

class CheckCancel extends Component {

  auctionCancel = async (e) => {
    e.preventDefault();
    const { aucID, getUserAuction } = this.props  

    const cancelAucTxData = {
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: klaytn.selectedAddress, 
        to: DEPLOYED_ADDRESS_AUCTION,
        gas: 2000000,
        data: AuctionContract.methods.auctionCancel(aucID).encodeABI()
      }
    const { rawTransaction: metaRawTransaction } = await caver.klay.signTransaction(cancelAucTxData)
    
    const resMETA = await axios({
        url: serviceURL+"cancel-auction",
        method: "post",
        data: {
           senderRawTransaction: metaRawTransaction,
        },

        json: true
    })
    
    console.log('DELETE_CERT_'+resMETA.statusText);
        
    ui.hideModal()
    
    setTimeout(()=>{ getUserAuction(); }, 3000);

  }

  closeModal = (e) => {
      e.preventDefault();
      ui.hideModal();
  }

  render() {
    return (
      <form className="CheckCancel">
        <p><span className="Cancel__msg">
            선택한 콘텐츠의 경매를 취소하시겠습니까 ?
            </span>
        </p><br/><br/>
        <Button
          className="Button__delete"
          onClick={this.auctionCancel}
          title="YES"
        />
        <Button
          className="Check__Auction"
          onClick={this.closeModal}
          title="NO"
        />
      </form>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({    

    getUserAuction: () => dispatch(aucActions.getUserAuction()),  
  
  })

export default connect(null, mapDispatchToProps)(CheckCancel)
