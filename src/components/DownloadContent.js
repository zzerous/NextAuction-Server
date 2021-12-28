import object from 'klaytn/Contracts'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Button from 'components/Button'
import Input from 'components/Input'
import Loading from 'components/Loading'
import AuctionCreate from 'components/AuctionCreate'
import { feedParser } from 'utils/misc'
import {saveAs} from 'file-saver';
import querystring from 'querystring'
import axios from 'axios';
const apiURL = "http://203.250.77.156:3001/"
const StorageContract = object.StorageContract;
const AuctionContract = object.AuctionContract;

import * as contentActions from 'redux/actions/contents'

import './DownloadContent.scss'

class DownloadContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: null,
    }
  }

  contentDownload = async (e) => {
    e.preventDefault()
    const { cName, cHash, endPoint } = this.props
    this.setState({ isLoading : "true" })

    console.log(cName, cHash, endPoint);

    await StorageContract.methods.getDownloadCert(cHash).call({from:klaytn.selectedAddress})
      .then(async (newCert) => {
        console.log(newCert)
        const downCert = [feedParser(newCert)][0]
        console.log(downCert)
        console.log(endPoint)
        const res = await this.props.requestDownload(downCert,endPoint)
        console.log(res)
        const downloadJWT = res.payload.downloadToken.data.downloadJWT
        const donwloadURL = res.payload.downloadToken.data.downloadURL
        const auth = await caver.klay.sign(downloadJWT, klaytn.selectedAddress)
        const KeyID = 'key-1'

        const downloadToken = {
          'downloadJWT': downloadJWT,
          'signature': auth,
          'pubKeyID': KeyID
        }
        
        const href = donwloadURL+'?'+querystring.stringify({'downloadToken':JSON.stringify(downloadToken)});
        saveAs(href, cName);

        this.setState({ isLoading : null})
        console.log(this.state.isLoading)
      })
  }
  createAuction = (e) => {
    e.preventDefault()
    const address = klaytn.selectedAddress;
    AuctionContract.methods.auctionCreate("kkk",10,10,1,"test",DEPLOYED_ADDRESS_AUCTION).send({
      from: address,
      gas: '20000000',
    })
    .once('receipt', (receipt) => {
      console.log(receipt.status)
    })
  }

  deleteCert = async (e) => {
    e.preventDefault()
    const { cHash, getFeed } = this.props

    /** 
      Fee Delegation - content Delete
    */
   const deleteCertTxData = {
    type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
    from: klaytn.selectedAddress, 
    to: DEPLOYED_ADDRESS,
    gas: 2000000,
    data: StorageContract.methods.deleteContentstate(cHash).encodeABI()
  }
    const { rawTransaction: metaRawTransaction } = await caver.klay.signTransaction(deleteCertTxData)

    const resMETA = await axios({
      url: apiURL+"deleteCertFD",
      method: "post",
      data: {
       senderRawTransaction: metaRawTransaction,
     },
     json: true
    })
    console.log('DELETE_CERT_'+resMETA.statusText);
    
    ui.hideModal()

    setTimeout(()=>{ getFeed(cHash); }, 2000);

  }

  render() {
    const { cName, cSize, cType, cDesc, accessLocation, createdTime  } = this.props
    const { isLoading } = this.state
    return (
      <div className="DownloadContent">
        <Input
          className="DownloadContent__infoName"
          name="contentName"
          label="Content Name"
          value={cName}
          readOnly
        />
        <Input
          className="DownloadContent__infoType"
          name="contentType"
          label="Content Type"
          value={cType}
          readOnly
        />
        <Input
          className="DownloadContent__infoSize"
          name="contentSize"
          label="Content Size"
          value={cSize}
          readOnly
        />
        <Input
          className="DownloadContent__infoLocation"
          name="contentLocation"
          label="Content Location"
          value={accessLocation}
          readOnly
        />
        <Input
          className="DownloadContent__infoTime"
          name="contentTime"
          label="Upload Time"
          value={createdTime}
          readOnly
        />
        <Input
          className="DownloadContent__description"
          name="contentDescription"
          label="Content Description"
          value={cDesc}
          readOnly
        />
        {/* <Button
          className="DownloadContent__download"
          onClick={this.contentDownload}
          title="Download"
        /> */}
        <Button
          className="DownloadContent__auction"
          onClick={()=> ui.showModal({
            header: 'Create Auction',
            content: <AuctionCreate cName={cName}/>
          })}
          title="Create Auction"
        />
        <Button
          className="DownloadContent__delete"
          onClick={this.contentDownload}
          title="Delete"
        />

        {isLoading && (
          <Loading />
        )}
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
export default connect(null, mapDispatchToProps)(DownloadContent)
