/**
 * caver-js library helps making connection with klaytn node.
 * You can connect to specific klaytn node by setting 'rpcURL' value.
 * default rpcURL is 'https://api.baobab.klaytn.net:8651'.
 */
import Caver from 'caver-js'

// const provider = null;

// if(typeof window !== 'undefined'){
//   provider = window['klaytn'];
// }


// const caver = new Caver(provider)

const caver = new Caver(window.klaytn);

export default caver
