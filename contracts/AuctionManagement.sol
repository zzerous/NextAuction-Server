pragma solidity ^0.5.6;
pragma experimental ABIEncoderV2;

import "./ContentManagement.sol";

contract AuctionManagement {

    event BidSuccess(address _from, uint _auctionId);//입찰 성공 이벤트
    event AuctionCreated(address _owner, uint _auctionId);//경매가 생성 이벤트
    event AuctionCanceled(address _owner, uint _auctionId);//경매가 취소 이벤트
    event AuctionDone(address _owner, uint _auctionId);//경매가 완료 이벤트
    event SendLastBid(address _owner, uint _auctionId);//NFT 소유권 이전 이벤트
    
    Auction[] public auctions;//모든 경매들의 배열

    enum AuctionState{Ready, Active, Cancel, Done}
    
    mapping(uint256 => Bid[]) public auctionBids;//경매에 대한 입찰리스트 맵핑 key: auctionID
    mapping(address => uint[]) public auctionOwner;//owner가 소유한 경매 리스트들 맵핑 key:owner
    
        constructor() public {
        Auction memory _auc = Auction({
            name : "test",
            id : 0,
            expireTime : 1000, 
            minPrice : 0,
            NFT : 100,
            desc : "test",
            NFTRepositoryAddr : 0x0000000000000000000000000000000000000000,
            owner : 0x180150Aa48B9EBAE77E569eacC31c807f81D2031,
            state : AuctionState.Active
        });
        
        Bid memory _bid = Bid({
            from: 0x000150Aa48B9EBAe77E569EACC31C807F81d2031,
            amount: 1
        });
        
        auctions.push(_auc);
        auctionBids[0].push(_bid);
    }
    
    modifier onlyNotOwner(uint _auctionID){
        require(msg.sender != auctions[_auctionID].owner, "Not valid Bid Address");
        _;
    }

    modifier onlyBeforeEnd(uint _auctionID){
        Auction memory myAuction = auctions[_auctionID];
        require(block.timestamp < myAuction.expireTime, "Not valid Bid Time");
        _;
    }

    modifier onlyAfterEnd(uint _auctionID) {
        Auction memory myAuction = auctions[_auctionID];
        require(block.timestamp > myAuction.expireTime, "Not valid Auction End");
        _;
    }

    modifier onlyOnceAuction(uint _nft){
        uint len = auctions.length;
        for(uint i = 0; i < len ; i++){
            if(_nft == auction[i].NFT)
                require(auction[i].state != AuctionState.Active, "Not valid duplicate Auction");
        }
        _;
    }

    //입찰자 및 금액을 저장하는 Bid 구조체
    struct Bid {
        address payable from; //bidder
        uint256 amount;
    }

    struct Auction{
        string name;
        uint256 id;
        uint256 expireTime;
        uint256 minPrice;
        uint256 NFT;
        string desc;
        address NFTRepositoryAddr;
        address payable owner;
        AuctionState state;
    }

    //경매 생성
    function auctionCreate(
        string memory _name, 
        uint256 _expireTime, 
        uint256 _minPrice,
        uint256 _NFT,
        string memory _desc,
        address _NFTRepositoryAddr
        ) public {
        uint auctionID = auctions.length;
        auctions.push(Auction({
            name : _name,
            id : auctionID,
            expireTime : _expireTime,
            minPrice : _minPrice,
            NFT : _NFT,
            desc : _desc,
            NFTRepositoryAddr : _NFTRepositoryAddr,
            owner : msg.sender,
            state : AuctionState.Active
        }));

        auctionOwner[msg.sender].push(auctionID);
        emit AuctionCreated(msg.sender, auctionID);
    }

    //경매의 owner가 진행중인 경매를 취소하는 함수
    //입찰이 없어야 하고 
    //증서는 경매소유자에게 다시 전송
    //경매의 상태는 취소된 상태
    function auctionCancel(uint256 _auctionID, address _ContentManagementAddr) public {
        Auction memory myAuction = auctions[_auctionID];
        uint256 bidsLength = auctionBids[_auctionID].length;
        ContentManagement contentContract = ContentManagement(_ContentManagementAddr);

        if(bidsLength > 0){
            revert("auctionCancel_bids_exist");
        }

        if(contentContract.approveAndTransfer(address(this), myAuction.owner, myAuction.NFTRepositoryAddr, myAuction.NFT)){
            auctions[_auctionID].state = AuctionState.Cancel;
            emit AuctionCanceled(msg.sender, _auctionID);
        }
    }
    
    //경매의 owner가 진행중인 경매를 종료하는 함수
    //입찰 성공 시, 증서는 입찰자에게 양도,
    //경매 소유자는 금액을 받고, 경매서비스에0.게 일정수수료 납부
    //경매의 상태는 완료된 상태
    function sendLastBid(uint256 _auctionID, address _ContentManagementAddr) public onlyAfterEnd(_auctionID){
        //onlyAfterEnd // expiretime 이 안되면 철회
        Auction memory myAuction = auctions[_auctionID];
        uint256 bidsLength = auctionBids[_auctionID].length;

        //입찰이 없으면 경매는 취소만가능
        if(bidsLength == 0){
            auctionCancel(_auctionID, _ContentManagementAddr);
        }else{
            //경매 owner에게 입찰된 금액 전송
            Bid memory lastBid = auctionBids[_auctionID][bidsLength-1];
            uint feeEx = (lastBid.amount*9)/10 ;//10프로 수수료 계산, 소수점 계산안되서 !
            if(!myAuction.owner.send(feeEx)){
                revert("auctionDone_cannot_send");
            
            }
            emit SendLastBid(msg.sender, _auctionID);
        }
    }
    
    
    function auctionDone(uint256 _auctionID, address _ContentManagementAddr) public {
        //ContentManagement contentContract = ContentManagement(_ContentManagementAddr);
        //Auction memory myAuction = auctions[_auctionID];
        //uint256 bidsLength = auctionBids[_auctionID].length;
        //Bid memory lastBid = auctionBids[_auctionID][bidsLength-1];
        
        //if(contentContract.approveAndTransfer(address(this), lastBid.from, myAuction.NFTRepositoryAddr, myAuction.NFT)){
            auctions[_auctionID].state = AuctionState.Done;
            emit AuctionDone(msg.sender, _auctionID);
            
        //}
    }

    //@@@contract 자체에서  lastBid 갑 -> auction마다 갑이다름
    //입찰자가 경매에 입찰을 보냄
    function bidAuction(uint256 _auctionID) public payable onlyNotOwner(_auctionID) onlyBeforeEnd(_auctionID) {

        uint256 klaySent = msg.value;
        Auction memory myAuction = auctions[_auctionID];
        uint bidsLength = auctionBids[_auctionID].length;
        uint256 bidPrice = myAuction.minPrice;
        Bid memory lastBid;

        if(bidsLength>0){
            lastBid = auctionBids[_auctionID][bidsLength-1];
            uint256 bidPrice = lastBid.amount;
        }
        
        if(klaySent < bidPrice){
            revert("bidAuction_smaller_than_lastBid");
        }

        if(bidsLength > 0){
            if(!lastBid.from.send(lastBid.amount)){
                revert("bidAuction_cannot_send");
            }
        }

        auctionBids[_auctionID].push(Bid({
            from : msg.sender,
            amount : klaySent
        }));
        emit BidSuccess(msg.sender, _auctionID);
    }

    function getCount() public view returns(uint256) {
        return auctions.length;
    }

    function getBidsCount(uint256 _auctionID) public view returns(uint256){
        return auctionBids[_auctionID].length;
    }

    function getCurrentBid(uint256 _auctionID) public view returns(address, uint256){
        uint256 bidsLength = auctionBids[_auctionID].length;

        if(bidsLength > 0){
            Bid memory lastBid = auctionBids[_auctionID][bidsLength-1];
            return (lastBid.from, lastBid.amount);
        }
    }

    function getBidhistory(uint256 _auctionID) public view returns(Bid[] memory){
        uint256 bidsLength = auctionBids[_auctionID].length;

        if(bidsLength > 0){
                Bid[] memory tmp = auctionBids[_auctionID];
                return tmp;
            }
            
    }

    function getOwnedAuction(address _owner) public view returns(uint[] memory) {
        uint[] memory ownedAuctions = auctionOwner[_owner];
        return ownedAuctions; // auction 위치 리턴
    }
    
    //모든 auction return
    function getAuctions() public view returns(Auction[] memory) {
    	return auctions;
    }

    function getAuctionInfo(uint256 _auctionID) public view returns (
        string memory,
        uint256,
        uint256,
        uint256,
        uint256,
        string memory,
        address,
        address,
        AuctionState
    ) {
        Auction memory auction = auctions[_auctionID];
        return (
            auction.name,
            auction.id,
            auction.expireTime,
            auction.minPrice,
            auction.NFT,
            auction.desc,
            auction.NFTRepositoryAddr,
            auction.owner,
            auction.state
        );
    }
}