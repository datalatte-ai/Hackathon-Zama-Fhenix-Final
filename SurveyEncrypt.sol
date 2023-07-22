// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./node_modules/fhevm/abstracts/EIP712WithModifier.sol";
import "./node_modules/fhevm/lib/TFHE.sol";

contract SurveyEncrypt is EIP712WithModifier {
    euint32 private oneAnswer;
    address internal contractOwner;
    euint32 internal total_wallet;
    euint32 public zero_value = TFHE.asEuint32(0);
    address[] internal wallet_addresses;
    constructor() EIP712WithModifier("Authorization token", "1") {
        contractOwner = msg.sender;
    }

    mapping(address => mapping(string => euint32)) internal answer;
    
    struct Data {
    address userAddress;
    string cid;
    euint32 value;
    }
    // Define an array to hold the structs
    Data[] internal dataArray;
    
    
    function ReturnMapAnswer(
        bytes32 publicKey,
        bytes calldata signature,
        address _address,
        string memory _cid
    )
        public
        view
        onlySignedPublicKey(publicKey, signature)
        returns (bytes memory)
    {
        return TFHE.reencrypt(answer[_address][_cid], publicKey);
    }

    function AddtoMap(string memory cid,uint256 _ind) public {
        euint32 ind = TFHE.asEuint32(_ind);
        if (TFHE.isInitialized(answer[msg.sender][cid])) {
            require(1==0,"The wallet is exist in contract");
        } else {
            answer[msg.sender][cid] = ind;
        }
        Data memory newData = Data(msg.sender, cid, ind);
        dataArray.push(newData);
    }

    function CalculateQueryAnswer(
        string memory cid,
        uint256 _answerfrom
    ) 
        public 
        payable
    {
        require(msg.value >= 1e15 , "You must send some Ether");
        euint32 _answer = TFHE.asEuint32(_answerfrom);
        euint32 count_wallet = zero_value;
        for (uint i = 0; i < dataArray.length; i++) {
            ebool condition = TFHE.eq(dataArray[i].value, _answer);
            euint8 toAdd = TFHE.asEuint8(condition);

            // Compare the cid and value
            if (keccak256(abi.encodePacked(dataArray[i].cid)) == keccak256(abi.encodePacked(cid)) && TFHE.isInitialized(toAdd)) {                
                count_wallet = TFHE.add(count_wallet, toAdd);
            }
        }
        total_wallet = count_wallet;
        
        // return TFHE.divide(count_wallet, dataArray.length);
    }

    function ReturnCountAnswer(
        bytes32 publicKey,
        bytes calldata signature
    )
        public
        view
        onlySignedPublicKey(publicKey, signature)
        returns (bytes memory) 
    {
        return TFHE.reencrypt(total_wallet, publicKey);
    }

    function ReturnLengthOfArray() public view returns (uint256) {
        return dataArray.length;
    }

    function CalculateQueryWallet(
        string memory cid,
        uint256 _answerfrom
    ) 
        public
        payable
    {
        require(msg.value >= 1e15 , "You must send some Ether");
        euint32 _answer = TFHE.asEuint32(_answerfrom);
        for (uint i = 0; i < dataArray.length; i++) {
            ebool condition = TFHE.eq(dataArray[i].value, _answer);
            euint8 toAdd = TFHE.asEuint8(condition);

            // Compare the cid and value
            if (keccak256(abi.encodePacked(dataArray[i].cid)) == keccak256(abi.encodePacked(cid)) && TFHE.isInitialized(toAdd)) {                
                wallet_addresses.push(dataArray[i].userAddress);
            }
        }
    }

    function ReturnWallets() public view returns (address[] memory) {
        return wallet_addresses;
    }

}