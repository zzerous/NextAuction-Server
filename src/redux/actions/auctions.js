import object from 'klaytn/Contracts' //1. contract instance import
import { aucfeedParser } from 'utils/aucmisc'
import axios from 'axios'
const AuctionContract = object.AuctionContract

import {
    ACTIVE_USER_AUCTION,
    FINALIZE_USER_AUCTION,
    SET_AUCFEED,
    SET_USERAUC
} from './actionTypes'


const setAuctionFeed = (aucfeed) => ({
  type: SET_AUCFEED,
  payload: { aucfeed },
})

const setUserAuction = (userauc) => ({
  type: SET_USERAUC,
  payload: {userauc},
})

export const activeUserAuction = () => async (dispatch) => {
  return dispatch({
    type: ACTIVE_USER_AUCTION,
  })
}

export const finalizeUserAuction = () => (dispatch) => {
    return dispatch({
        type: FINALIZE_USER_AUCTION,
    })
}

export const getAuctionFeed = () => async (dispatch) => {
  const address = klaytn.selectedAddress
  await AuctionContract.methods.getAuctions().call()
    .then(async (auctions) => {
      console.log(auctions);
      const aucLen = auctions.length;
      if (aucLen == 0) return []
      const auctionFeed = []
        for (let i = aucLen; i > 0; i--) {
          const aucID = auctions[i-1].id;
          const auction = await AuctionContract.methods.getAuctionInfo(aucID).call({from:address});
          const aucState = auctions[i-1].state;
          if (aucState == 1) //state ==1, auction active만 가져오기
            auctionFeed.push(auction)          
      }
      console.log("success GET AUCTION FEED!!");
      console.log(auctionFeed)
      return Promise.all(auctionFeed)
    })
    .then((auctionFeed) => dispatch(setAuctionFeed(aucfeedParser(auctionFeed))))
}

export const getUserAuction = () => async (dispatch) => {
  const address = klaytn.selectedAddress;
  await AuctionContract.methods.getOwnedAuction(address).call()
    .then(async (auctions) => {
      const aucLen = auctions.length;
      if (aucLen == 0) return [];
      const ownAuction = [];
      for (let i = aucLen; i>0 ; i--){
        const aucID = auctions[i-1];
        const auction = await AuctionContract.methods.getAuctionInfo(aucID).call({from: address});
        //const aucState = auctions[i-1].state;
        ownAuction.push(auction)
      }
      console.log("GET USER AUCTION FEED");
      console.log(ownAuction)
      return Promise.all(ownAuction)
    })
    .then((ownAuction) => dispatch(setUserAuction(aucfeedParser(ownAuction))))
}
