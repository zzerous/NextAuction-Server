pragma solidity ^0.5.6;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ContentManagement.sol";
import "../contracts/NFTManagement.sol";

contract TestContent{

    	//ContentManagement cm = ContentManagement(DeployedAddresses.ContentManagement());
    	ContentManagement cm = ContentManagement(0x345cA3e014Aaf5dcA488057592ee47305D9B3e10);
    	NFTManagement nm = NFTManagement(0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF);
    	enum ContentState{None, Saved, Deleted}
    	
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
        uint256 created;
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
        string accessLocation;
        string storageSignature; //@when transfer owner, change
    }
    	
    function test() public {
    	
    	cm.issueNFT("a",0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF);
    	
    	address[] memory _history;
    	
    	ContentMeta memory cmeta = ContentMeta({
    	    NFT: 111,
    	    created: 111,
    	    name: 'a',
    	    fileType: 'a',
    	    size: 'a',
    	    metaHash: 'a',
    	    contentType: 'a',
    	    desc: 'a',
    	    state: ContentState.Saved
    	});
    	OwnerInfo memory info = OwnerInfo({
    	    did: 'a',
    	    history: _history
    	});
    	StorageService memory ssvc = StorageService({
    	    storageDID: 'a',
    	    downloadEndpoint: 'a',
    	    accessLocation: 'a',
    	    storageSignature: 'a'
    	});
    	
    	cm.storeOwnershipCert(111,cmeta,info,ssvc,111);
}

