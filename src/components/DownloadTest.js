import StorageContract from 'klaytn/Contracts'
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
import { LinearProgress } from '@material-ui/core';

const apiURL = "http://203.250.77.156:3001/"

import * as contentActions from 'redux/actions/contents'

import './DownloadContent.scss'

class DownloadTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: null,
      downloadPercent: null,
    }
  }

  contentDownload = async (e) => {
    e.preventDefault()
    const { cName, cHash, endPoint } = this.props
    this.setState({ isLoading : "true" })

    var start = new Date(); //timer start

    await StorageContract.methods.getDownloadCert(cHash).call({from:klaytn.selectedAddress})
      .then(async (newCert) => {
        const downCert = [feedParser(newCert)][0]
        console.log(downCert)
        console.log(endPoint)
        const res = await this.props.requestDownload(downCert,endPoint)
        console.log(res)
        const downloadJWT = res.payload.downloadToken.data.downloadJWT
        const downloadURL = res.payload.downloadToken.data.downloadURL
        const auth = await caver.klay.sign(downloadJWT, klaytn.selectedAddress)
        const KeyID = 'key-1'

        const downloadToken = {
          'downloadJWT': downloadJWT,
          'signature': auth,
          'pubKeyID': KeyID
        }

        const href = downloadURL+'?'+querystring.stringify({'downloadToken':JSON.stringify(downloadToken)});
        saveAs(href, cName);

        this.setState({ isLoading : null})
        console.log(this.state.isLoading)
      })

    var end = new Date(); //timer end
    var elaspMS = end-start
    console.log(elaspMS)

    const blob = new Blob([elaspMS], {type:'application/json'});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = "1MB.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
      
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
    const { isLoading, downloadPercent } = this.state
    return (
      <div className="DownloadTest">
        <Input
          className="DownloadTest__infoName"
          name="contentName"
          label="Content Name"
          value={cName}
          readOnly
        />
        <Input
          className="DownloadTest__infoType"
          name="contentType"
          label="Content Type"
          value={cType}
          readOnly
        />
        <Input
          className="DownloadTest__infoSize"
          name="contentSize"
          label="Content Size"
          value={cSize}
          readOnly
        />
        <Input
          className="DownloadTest__infoLocation"
          name="contentLocation"
          label="Content Location"
          value={accessLocation}
          readOnly
        />
        <Input
          className="DownloadTest__infoTime"
          name="contentTime"
          label="Upload Time"
          value={createdTime}
          readOnly
        />
        <Input
          className="DownloadTest__description"
          name="contentDescription"
          label="Content Description"
          value={cDesc}
          readOnly
        />
        <LinearProgress
          className="DownloadTest__ProgressBar"
          variant="determinate"
          value={downloadPercent} 
        />
        <Button
          className="DownloadTest__download"
          onClick={this.contentDownload}
          title="Download"
        />
        <Button
          className="DownloadTest__delete"
          onClick={this.deleteCert}
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
export default connect(null, mapDispatchToProps)(DownloadTest)
