import object from 'klaytn/Contracts'
import React, { Component } from 'react';
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Input from 'components/Input'
import InputContent from 'components/InputContent'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import UpdateFeed from 'components/UpdateFeed'
import axios from 'axios';
import { LinearProgress } from '@material-ui/core';
import * as contentActions from 'redux/actions/contents'

const {Keccak} = require('sha3');
const HASH = new Keccak(256);
const apiURL = "http://203.250.77.156:3001/"
const StorageContract = object.StorageContract

const contentList = {
  'IMAGE' : 'Image',
  'VIDEO' : 'Video',
  'MUSIC' : 'Music',
  'TEXT' : 'Text',
  'COMPRESS' : 'Compressed',
}

class UploadContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      cName: '',
      cSize: '',
      cHash: '',
      cDesc: '',
      cType: null,
      fType: '',
      uploadPercent: 0,
    };
  }

  selectContentTitle = (cType) => {
    this.setState({ cType })
    console.log(cType)
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleContentChange = (e) => {
    const content = e.target.files[0]
    const { cType } = this.state

    this.setState({
      content: content,
      cName: content.name,
      fType: content.type,
      cSize: content.size.toString(), //number to string
      cHash: HASH.update(content+content.name+content.type+content.size+cType).digest('hex'),
    })
  }

  uploadContent = async (e) => {
    e.preventDefault()
    const { content, cName, cSize, cHash, cType, cDesc, fType } = this.state
    
    const formData = new FormData();
    formData.append('file', content);

    /** 
      Fee Delegation - file Meta UPLOAD
    */
   const contentMetaTxData = {
    type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
    from: klaytn.selectedAddress, 
    to: DEPLOYED_ADDRESS,
    gas: 2000000,
    data: StorageContract.methods.uploadContentMeta(cName, fType, cSize, cHash, cType, cDesc).encodeABI()
  }
  const { rawTransaction: metaRawTransaction } = await caver.klay.signTransaction(contentMetaTxData)

  const resMETA = await axios({
    url: apiURL+"metaFD",
    method: "post",
    data: {
      senderRawTransaction: metaRawTransaction,
    },
    json: true
  })
  console.log('UPLOAD_META_'+resMETA.statusText);    

  /**
   * File Upload to Storage Service
   */
  const signObj = await caver.klay.sign(cHash, klaytn.selectedAddress)
  console.log(cName+fType+cSize+cHash+cDesc)
  const credential = await this.props.requestCredential(signObj, cName, cType, cSize, cHash, fType,cDesc)
  console.log(credential)
  const accessToken = await this.props.requestAccessToken(credential)
  console.log(accessToken)
  const uploadJWT = accessToken.payload.accessToken.data.uploadJWT;
  const uploadEndPoint = accessToken.payload.accessToken.data.endpoint;
  formData.append('token', uploadJWT);

  const result = await axios.post(uploadEndPoint, formData, {
    header: {
      'content-type':'multipart/form-data'
    },
    onUploadProgress: (ProgressEvent) => {
      let progress = Math.round((ProgressEvent.loaded / ProgressEvent.total * 100),2);
      this.setState({uploadPercent: progress})
    }
  }).catch(function (error) {
    console.log('Error', error.message);
  })

  console.log(result)
  const downloadCert = result.data.downloadCert
  console.log(downloadCert)

  /** 
    Fee Delegation - download Cert STORE
  */
  const storeCertTxData = {
    type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
    from: klaytn.selectedAddress, 
    to: DEPLOYED_ADDRESS,
    gas: 2000000,
    data: StorageContract.methods.storeDownloadCert(
      cHash, 
      downloadCert.accessLocation,
      downloadCert.issuer, 
      downloadCert.audience, 
      downloadCert.createTime, 
      downloadCert.endpoint,
      downloadCert.signature.signature,
    ).encodeABI()      
  }

  const { rawTransaction: certRawTransaction } = await caver.klay.signTransaction(storeCertTxData)

  const resCERT = await axios({
    url: apiURL+"storeCertFD",
    method: "post",
    data: {
        senderRawTransaction: certRawTransaction,
    },
    json: true
  })
  console.log('STORE_DOWNLOADCERT_'+resCERT.statusText);

  await ui.showModal({
      header: 'Upload Content',
      content: <UpdateFeed 
                  contentHash={cHash}
                  downloadCert={downloadCert}
              />,
    })
  }
  render(){
    const { cName, cType, cDesc, warningMessage, uploadPercent } = this.state
    const contentTitles = Object.keys(contentList)
    return (
      
      <form className="UploadContent" encType='multipart/form-data' method='post' onSubmit={this.uploadContent}>
        <Dropdown 
          className="UploadContent__dropdown"
          placeholder="Contents Type"
          selectedItem={cType}
          handleSelect={this.selectContentTitle}
          list={contentTitles}
        />
        <Input
          className="UploadContent__description"
          name="cDesc"
          label="Contents Description"
          value={cDesc}
          onChange={this.handleInputChange}
          placeholder="Explain this content"
          required
        />
        <InputContent
          className="UploadContent__file"
          name="content"
          label="Search content"
          contentName={cName}
          onChange={this.handleContentChange}
          err={warningMessage}
          required
        />
        {/* <Progress 
          max="100" 
          color="success" 
          value={uploadPercent}
        >
          {Math.round(uploadPercent, 2) }%
        </Progress> */}
        {/* <div
          className="ProgressBar"
          style={{width: progress}}
          max="100" 
          color="success" 
          value={uploadPercent}
        >
          {Math.round(uploadPercent, 2) }%
        </div> */}
        <LinearProgress
          className="UploadContent__ProgressBar"
          variant="determinate"
          value={uploadPercent} 
        />
        <Button
          className="UploadContent__upload"
          type="submit"
          title="Upload"
        />
      </form>
      
    );
  } 
}

const mapDispatchToProps = (dispatch) => ({
  requestCredential: (signObj, cName, cType, cSize, cHash, fType, cDesc) => 
  dispatch(contentActions.requestCredential(signObj, cName, cType, cSize, cHash, fType, cDesc)),

  requestAccessToken: (credential) =>
  dispatch(contentActions.requestAccessToken(credential))

})
export default connect(null, mapDispatchToProps)(UploadContent)