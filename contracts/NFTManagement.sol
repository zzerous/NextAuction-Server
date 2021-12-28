pragma solidity ^0.5.6;
import "./KIP17/KIP17Token.sol";

contract NFTManagement is KIP17Token {

    event NFTRegistered(address _by, uint256 _tokenId);
 
    constructor(string memory _name, string memory _symbol) 
        public KIP17Token(_name, _symbol) {}

    function registerNFT(address _addr, uint256 _tokenId) public {
        _mint(_addr, _tokenId);
        //_setTokenURI(_tokenId, _uri); //증서에 메타데이터 추가
        emit NFTRegistered(_addr, _tokenId);
    }

}