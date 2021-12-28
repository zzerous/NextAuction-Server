pragma solidity ^0.5.6;
pragma experimental ABIEncoderV2;

import "./NFTManagement.sol";


//version2
contract ContentManagement {

    enum ContentState{None, Saved, Deleted} // del Uploading(version1)
    
    event isRegister(uint256 _tokenID);
    event isStoreCert(uint256 _nft, string _did);
    event isAssignDelegation(uint256 _nft, string _auctionserviceDID);
    event isChangeCert(uint256 _nft, string _newOwnerDID);

    modifier checkOverlap(string memory _metahash) {
        require(!contents[_metahash], "Same contents exist");
        _;
    }
    
    modifier checkValidDelegateAccount(uint256 _nft){
        address delegationAccount = ownershipCerts[_nft].delegations.account;
        require(msg.sender == delegationAccount, "Not valid Delegate Account");
        _;
    }
    
    modifier checkValidDelegateState(uint256 _nft){
        require(ownershipCerts[_nft].delegations.isActivate, "Not valid Delegate State");
        _;
    }

    modifier checkValidContentOwner(uint256 _nft){
        uint256 len = ownershipCerts[_nft].ownerInfo.history.length;
        address ownerAccount = ownershipCerts[_nft].ownerInfo.history[len-1];
        require(msg.sender == ownerAccount, "Not valid Content Owner");
        _;
    }    

    struct OwnershipCert{
        ContentMeta contentMeta;
        OwnerInfo ownerInfo; //@@@@@@@@@@@@@@@core@ 
        StorageService storageSvc;
        Delegation delegations; 
        uint256 issueTime; //@when transfer owner, change
    }

    struct Delegation{
        string did;
        address account;
        string signMeta; //auction meta
        string signature; //sign auction meta with auction server private key
        uint256 validTime; 
        bool isActivate; //@when transfer owner, false
    }

    struct ContentMeta{
        uint256 NFT;
        string created;
        string name;
        string fileType;
        string size;
        string metaHash;
        string contentType;
        string desc;
        ContentState state;  // 0: None, 1: Saved,  2: Deleted
    }

    struct OwnerInfo{
        string did; //@when transfer owner, change
        address[] history;  //@when transfer owner, change
    }

    struct StorageService{
        string storageDID;
        string downloadEndpoint;
        string reIssueEndpoint;
        string accessLocation;
        string storageSignature; //@when transfer owner, change
    }

    //NFT ---- ownershipCert content
    mapping (uint256 => OwnershipCert) ownershipCerts;
    //defence overlap content 
    mapping (string => bool) contents;
    //owner --- NFTs
    mapping (address => uint256[]) ownerNFTs;


    function issueNFT(
        string memory _metahash,
        address _NFTManagementAddr) public checkOverlap(_metahash) {
            
            // uint256(keccak256(abi.encodePacked(block.difficulty, now)));
             
            NFTManagement nftContract = NFTManagement(_NFTManagementAddr);
            uint256 tokenID = nftContract.totalSupply() + 1;
            nftContract.registerNFT(msg.sender, tokenID);
            emit isRegister(tokenID);  

            contents[_metahash] = true;
            ownerNFTs[msg.sender].push(tokenID);
    }
    
    function storeOwnershipCert(
        uint256 _nft,
        ContentMeta memory _cmeta,
        OwnerInfo memory _ownerInfo,
        StorageService memory _storageSvc,
        uint256 _issueTime
        ) public
    {
        
        Delegation memory delegation;
        OwnershipCert memory cert = OwnershipCert({
            contentMeta: _cmeta,
            ownerInfo: _ownerInfo,
            storageSvc: _storageSvc,
            delegations: delegation,
            issueTime: _issueTime
        });
        
        ownershipCerts[_nft] = cert;
        ownershipCerts[_nft].ownerInfo.history.push(msg.sender); 
        
        emit isStoreCert(_nft, ownershipCerts[_nft].ownerInfo.did);
    
    } 


    //seller when.start aution
    function assignDelegate(
        uint256 _nft, 
        string memory _auctionserviceDID, 
        address _auctionAccount,
        string memory _signMeta,
        string memory _signature,
        uint256 _validTime) public checkValidContentOwner(_nft) {
        //check content owner
        //update onwershipcert delegation 

        Delegation memory newDelegation = Delegation({
            did: _auctionserviceDID,
            account: _auctionAccount,
            signMeta: _signMeta,
            signature: _signature,
            validTime: _validTime,
            isActivate: true
        });

        ownershipCerts[_nft].delegations = newDelegation;
        
        emit isAssignDelegation(_nft, _auctionserviceDID);

    } 


    function approveAndTransfer(
        address _from, 
        address _to, 
        address _NFTManagementAddr,
        uint256 _NFT
        ) public returns(bool) {
            NFTManagement nftContract = NFTManagement(_NFTManagementAddr);
            nftContract.approve(_to, _NFT); //change or reaffirm the approved address for an NFT
            nftContract.transferFrom(_from, _to, _NFT); //NFT 소유권 이전
            return true;
    }    
    

    function changeOwnershipCert(
        uint256 _nft,
        string memory _newOwnerDID,
        string memory _storageSignature,
        uint256 _issueTime,
        address _newOwnerAddress,
        address _NFTManagementAddr
        //) public checkValidDelegateAccount(_nft) checkValidDelegateState(_nft)
        ) public checkValidDelegateState(_nft)
    {
        // 1. add modifier isValidDelegation()
        // => aution service (check auth. msg.sender == delegationDID)

        ownershipCerts[_nft].ownerInfo.did = _newOwnerDID;
        ownershipCerts[_nft].storageSvc.storageSignature = _storageSignature;
        ownershipCerts[_nft].ownerInfo.history.push(_newOwnerAddress);
        ownershipCerts[_nft].issueTime = _issueTime;

        uint len = ownershipCerts[_nft].ownerInfo.history.length;
        address prevOwnerAddress = ownershipCerts[_nft].ownerInfo.history[len-2];
        if(approveAndTransfer(prevOwnerAddress, _newOwnerAddress, _NFTManagementAddr, _nft)){ //nft의 소유권 양도
            // pause delegation
            ownershipCerts[_nft].delegations.isActivate = false;
            emit isChangeCert(_nft, _newOwnerDID);

        }else{
            revert("Fail to transfer NFT Owner");
        }    
    }

// 12
//     function deleteContentstate(uint256 _nft) public {
//         uint256 contentLen = 
//     }

    function getNFT() public view returns (uint256[] memory){
        return ownerNFTs[msg.sender];
    }
    
    function getOwnershipCert(uint256 _nft) public view returns (OwnershipCert memory cert){
        return ownershipCerts[_nft];
    }

    //자기 소유의 owenrshipCert 만을 Return 
    // function getOwnershipCerts() public view returns (OwnershipCert[] memory cert){
    //     OwnershipCert[] memory certs;
    //     uint256[] ownerNFTs = getNFTs();
    //     uint256 length = ownerNFTs.length;
        
    //     for(i=0 ; i < length ; i++){
    //         OwnershipCert memory cert = ownerNFTs[i];
    //         uint256 len = cert.ownerInfo.history.length;
    //         if(msg.sender == cert.ownerInfo.history[len-1]){
    //             certs.push(cert);
    //         }
            
    //     }
        
    //     return certs;
    // }

}