//import caver from './caver.js'
import caver from 'klaytn/caver'
/**
 * 1. Create contract instance
 * ex:) new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
 * You can call contract method through this instance.
 * Now you can access the instance by `this.countContract` variable.
 */


 const StorageContract = DEPLOYED_ABI
 && DEPLOYED_ADDRESS
 && new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)

const NFTContract = DEPLOYED_ABI_NFT
 && DEPLOYED_ADDRESS_NFT
 && new caver.klay.Contract(DEPLOYED_ABI_NFT, DEPLOYED_ADDRESS_NFT)

const AuctionContract = DEPLOYED_ABI_AUCTION 
 && DEPLOYED_ADDRESS_AUCTION
 && new caver.klay.Contract(DEPLOYED_ABI_AUCTION, DEPLOYED_ADDRESS_AUCTION)

const object = {
 StorageContract: StorageContract,
 NFTContract: NFTContract,
 AuctionContract: AuctionContract
}

export default object
