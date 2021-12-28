//const object = require('../src/klaytn/Contracts');
//import object from '/home/young/auc-server/src/klaytn/Contracts.js'

// import object from '../src/klaytn/Contracts.js';
// const StorageContract = object.StorageContract;
// const AuctionContract = object.AuctionContract;
const express = require('express')
const app = express()
const fs = require('fs');
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const logger = require('./winston'); //logger.info('logfile2')
global.atob = require("atob");
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const port = 3002;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.contentMetaDB = new Map();

const fdURL = "http://203.250.77.156:3001/"
const KlayDIDClient = require('klay-did-auth');
const klayDID =  new KlayDIDClient({
  network: 'https://api.baobab.klaytn.net:8651/',
  regABI: __dirname+'/did-registry.json',
  regAddr: '0xbCd509F468Fbc017fE615dE0b9cEfAa1Fbf335A6'
});

const svcAddress = '0xd5addfadf499d81854bd55e91be4755e73b534de';
const svcDID = 'did:kt:'+svcAddress.toLowerCase().substring(2);
const privateKey = '0xfae0c518b26c52893d7c9175b96119b33e5e574110866d86fcc1fc17ea53a8af'; //옥션서비스 프라이빗 키

const DEPLOYED_ADDRESS = JSON.stringify(fs.readFileSync('deployedAddressContentManagement', 'utf8').replace(/\n|\r/g, ""));
const DEPLOYED_ABI = fs.existsSync('deployedABIContentManagement') && fs.readFileSync('deployedABIContentManagement', 'utf8');
const DEPLOYED_ADDRESS_NFT = JSON.stringify(fs.readFileSync('deployedAddressNFTManagement', 'utf8').replace(/\n|\r/g, ""));
const DEPLOYED_ABI_NFT = fs.existsSync('deployedABINFTManagement') && fs.readFileSync('deployedABINFTManagement', 'utf8');
const DEPLOYED_ADDRESS_AUCTION = JSON.stringify(fs.readFileSync('deployedAddressAuctionManagement', 'utf8').replace(/\n|\r/g, ""));
const DEPLOYED_ABI_AUCTION = fs.existsSync('deployedABIAuctionManagement') && fs.readFileSync('deployedABIAuctionManagement', 'utf8');

const StorageContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

app.post('/transferAuth', async (req, res) => {
    //한 콘텐츠의 옥션에 대한 모든 권한을 판매자로 부터 양도 받을 것인 가에 대한 합의가 이루어짐
    //판매자:seller(옥션 시작 요청자)의 신원 확인
    console.log(req.body);
    /*
    {
    auctionMeta: '[object Object]',
    auctionMetaSig: '0xad722a1e6f99ffdee6c4932e7d4be4efcc79e137ab385d23ae0b39d01cc268805f6e155ffc46bee56653efc1635b7a102c17522536328374bc63c55c6cdcaa421c',
    userDID: 'did:kt:180150aa48b9ebae77e569eacc31c807f81d2031',
    keyID: 'did:kt:180150aa48b9ebae77e569eacc31c807f81d2031#key-1'
    }
    */
    // s : seller
    const sSignature = req.body.auctionMetaSig; // user가 사인한 값
    const sDid = req.body.userDID;
    const sKeyId = req.body.keyID; //did가 가진 여러 publicKey들 중 사용한 key를 구별하기 위한 id
    const signData = req.body.auctionMetaHash;
    console.log(signData);
    const authResults = await klayDID.didAuth(sDid, sKeyId, sSignature, signData);
    const isValid = authResults[0];
    console.log(isValid);
    if(!isValid) res.send("The requestor's identity is not confirmed.");
    else {
      /*
        //content Management contract 에서 해당 NFT가 판매자 소유인게 맞는지 확인
      */
      // seller가 보낸 옥션메타해쉬에 사인함으로써 경매기간동안 해당 경매에 대한 콘텐츠의 모든 권한을 위임받음
      const adminAuctionSig = await klayDID.sign(signData, "EcdsaSecp256k1RecoveryMethod2020", privateKey);
      logger.info('Auction Service signed on the transfer of Auction authority. (adminAuctionSignature)', adminAuctionSig);
      // 옥션 서비스 did, 옥션 서비스 acc 함께 넘겨주기 -> did 생성하는거 먼저하기
      const delegation = {
          "auctionMetaHash":signData,
          "adminAuctionSig":adminAuctionSig.signature,
          "adminAuctionDID":svcDID,
          "adminAuctionAcc":svcAddress
      }
      res.send(delegation);
    }
});


app.post('/startAuction', async (req, res) => {
    console.log(req.body);
    // 0. req에서 옥션 메타 정보 빼내기'
    const auctionMeta = req.body.auctionMeta
    // 1. 판매자가 옥션 서비스에게 권한이 양도됨을 알림 , 이때 옥션 서비스는 콘텐츠 매니지먼트 컨트랙트에 접근하여 권한이 양도되었는지 확인

    /*
    // 컨트랙트 접근해서 확인하삼요
    -> 2.콘텐츠 매니지먼트에 등록된 deligation 확인
    */
    // 3. 확인이 완료되면, 옥션 서비스는 auctionManagement 컨트랙트를 통해 옥션을 시작
    // * Fee Delegation - create auction
    const createAucTxData = {
        type:'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: svcAddress, //actionAdmin service address
        to: DEPLOYED_ADDRESS,
        gas: 2000000,
        data: StorageContract.methods.auctionCreate(
            auctionMeta.name, 
            auctionMeta.expire, 
            auctionMeta.minPrice, 
            auctionMeta.NFT, 
            auctionMeta.desc, 
            DEPLOYED_ADDRESS_NFT
            ).encodeABI()
      }
    const { rawTransaction: metaRawTransaction } = await caver.klay.signTransaction(createAucTxData)
    const resAssign = await axios({
      url: fdURL+"createAucFD",
      method: "post",
      data: {
        senderRawTransaction: metaRawTransaction,
      },
      json: true
    })
    console.log(resAssign);
    console.log('FD_ASSIGN_DELEGATE     '+resAssign.statusText);
    /*
    // 4. 옥션 시작할 때 옥션 매니지먼트 컨트랙트한테 옥션 메타정보 전달하면서 옥션 시작하삼
    */
});

app.post('/Inprocessauction',async (req,res)=>{
    console.log(req.body);
    const buyerInfo = req.body;
    const contentMeta = req.body.contentMeta;
    app.contentMetaDB.set(contentMeta.metaHash,contentMeta);
    // b : buyer
    const bSignature = buyerInfo.auctionSig;
    const bDid = buyerInfo.userDID;
    const bKeyId = buyerInfo.keyID; //did가 가진 여러 publicKey들 중 사용한 key를 구별하기 위한 id
    const signData = JSON.stringify(contentMeta);
    const authResults = await klayDID.didAuth(bDid, bKeyId, bSignature, signData);
    const isValid = authResults[0];
    if (!isValid) res.send("The requestor's identity is not confirmed.");
    else {
        console.log('여기까지 완료');
        /*
        인증이 완료되면, 옥션 서버가 입찰에 대한 정보를 갱신하기 위하여 auctionManagement 컨트랙트에서 tx를 보냄.
        */
       /* auctionManagement contract에 지속적으로 send TX 해서 옥션 상황 확인  */
    }
});

app.post('/endAuction',async (req,res)=>{
    //1. 옥션 서비스가 옥션 종료를 감지
    //2. 옥션 서비스가 수수료를 제외한 최종 입찰가를 판매자에게 전달하기 위하여 auctionManagement 컨트랙트에 tx을 전송
    //3. 옥션 서비스가 비콘 스토리지에서 새로운 소유증명서 발급에 사용되는 이전 소유증명서를 contentManagement 컨트랙트에서 가져옴
    const oldOwnershipCert = '';
    //4. 옥션 서비스가 (소유권 양도에 사용 될) 새로운 소유 증명서를 발급받기 위하여
    //   이전 소유증명서(delegation 정보 제외 후),
    //   비딩할 때 받은 [최종 입찰자의(구매자) 시그니처, 콘텐츠 메타정보, 구매자 did, public key id] 정보들을  스토리지 서비스에게 전달
    res.send()
});
app.post('/transferOwnership',async (req,res)=>{
});

app.listen(port, ()=> {
    console.log(`Auction-server is running on `, port);
})

