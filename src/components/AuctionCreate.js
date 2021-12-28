import object from 'klaytn/Contracts'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Button from 'components/Button'
import Input from 'components/Input'
import Loading from 'components/Loading'
import { feedParser } from 'utils/misc'
import {saveAs} from 'file-saver';
import querystring from 'querystring'
import axios from 'axios';
const fdURL = "http://203.250.77.156:3001/"
const StorageContract = object.StorageContract;
const AuctionContract = object.AuctionContract;

import * as contentActions from 'redux/actions/contents'

import './AuctionCreate.scss'

class AuctionCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      aucMIN: '',
      aucEXP: '', 
      aucDesc: '',
    }
  }
  
  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  createAuction = async (e) => {
    e.preventDefault()
    const { cName } = this.props;
    const { aucMIN, aucEXP, aucDesc } = this.state;
    
    /**
     * Fee delegation
     */
    // const address = klaytn.selectedAddress;
    // AuctionContract.methods.auctionCreate(cName,aucEXP,aucMIN,4981359849,aucDesc,DEPLOYED_ADDRESS_AUCTION).send({
    //   from: address,
    //   gas: '20000000',
    // })
    // .once('receipt', (receipt) => {
    //   console.log(receipt.status)
    //   ui.hideModal()
    // })
    const createAucTxData = {
      type:'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
      from:klaytn.selectedAddress,
      to:DEPLOYED_ADDRESS_AUCTION,
      gas:2000000,
      data:AuctionContract.methods.auctionCreate(cName,aucEXP,aucMIN,4981359849,aucDesc,DEPLOYED_ADDRESS_AUCTION).encodeABI()
    }

    const {rawTransaction: metaRawTransaction} = await caver.klay.signTransaction(createAucTxData)

    const resMETA = await axios({
      url: fdURL+"createAucFD",
      method: "post",
      data:{
        senderRawTransaction: metaRawTransaction,
      },
      json:true
    })
    console.log('CREATE_AUC_'+resMETA.statusText);
    ui.hideModal()
  }

  render() {
    const { cName } = this.props
    const { aucMIN, aucEXP, aucDesc } = this.state
    return (
      <div className="DownloadContent">
        <Input
          className="DownloadContent__infoName"
          name="aucName"
          label="Auction Name"
          value={cName}
          readOnly
        />
        <Input
          className="DownloadContent__infoType"
          name="aucMIN"
          label="Auction Min Price"
          value={aucMIN}
          onChange={this.handleInputChange}
          placeholder="Start Price"
          required
        />
        <Input
          className="DownloadContent__infoTime"
          name="aucEXP"
          label="Auction Valid Time"
          value={aucEXP}          
          onChange={this.handleInputChange}
          placeholder="When does this auction end"
          required
        />
        <Input
          className="DownloadContent__description"
          name="aucDesc"
          label="Auction Description"
          value={aucDesc}
          onChange={this.handleInputChange}
          placeholder="Explain about this auction"
          required
        />
        <Button
          className="DownloadContent__auction"
          onClick={this.createAuction}
          title="Create Auction"
        />
        <Button
          className="DownloadContent__delete"
          onClick={this.deleteCert}
          title="Delete"
        />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  requestDownload: (downloadCert, endpoint) => 
    dispatch(contentActions.requestDownload(downloadCert, endpoint)),
  
  getFeed: () => 
    dispatch(contentActions.getFeed()),  

})
export default connect(null, mapDispatchToProps)(AuctionCreate)
