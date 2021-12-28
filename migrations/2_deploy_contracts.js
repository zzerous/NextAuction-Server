const ContentManagement = artifacts.require('./ContentManagement.sol')
const NFTManagement = artifacts.require('./NFTManagement.sol')
const AuctionManagement = artifacts.require('./AuctionManagement.sol')
const fs = require('fs')

module.exports = function (deployer) {
  deployer.deploy(ContentManagement)
    .then(() => {
    if (ContentManagement._json) {
      // 1. Record recently deployed contract's abi file to 'deployedABI'
      fs.writeFile(
        'deployedABIContentManagement',
        JSON.stringify(ContentManagement._json.abi, 2),
        (err) => {
          if (err) throw err
          console.log(`The abi of ${ContentManagement._json.contractName} is recorded on deployedABI file`)
        })
    }

    // 2. Record recently deployed contract's address to 'deployedAddress'
    fs.writeFile(
      'deployedAddressContentManagement',
      ContentManagement.address,
      (err) => {
        if (err) throw err
        console.log(`The deployed contract address * ${ContentManagement.address} * is recorded on deployedAddress file`)
    })
  });
  deployer.deploy(NFTManagement, "TEST Auction NFT", "TEST")
    .then(() => {
    if (NFTManagement._json) {
      fs.writeFile(
        'deployedABINFTManagement',
        JSON.stringify(NFTManagement._json.abi, 2),
        (err) => {
          if (err) throw err
          console.log(`The abi of ${NFTManagement._json.contractName} is recorded on deployedABI file`)
        })
    }
    fs.writeFile(
      'deployedAddressNFTManagement',
      NFTManagement.address,
      (err) => {
        if (err) throw err
        console.log(`The deployed contract address * ${NFTManagement.address} * is recorded on deployedAddress file`)
    })
  });
  deployer.deploy(AuctionManagement)
    .then(() => {
    if (AuctionManagement._json) {
      fs.writeFile(
        'deployedABIAuctionManagement',
        JSON.stringify(AuctionManagement._json.abi, 2),
        (err) => {
          if (err) throw err
          console.log(`The abi of ${AuctionManagement._json.contractName} is recorded on deployedABI file`)
        })
    }
    fs.writeFile(
      'deployedAddressAuctionManagement',
      AuctionManagement.address,
      (err) => {
        if (err) throw err
        console.log(`The deployed contract address * ${AuctionManagement.address} * is recorded on deployedAddress file`)
    })
  });
}
