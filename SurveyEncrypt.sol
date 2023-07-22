// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./node_modules/fhevm/abstracts/EIP712WithModifier.sol";
import "./node_modules/fhevm/lib/TFHE.sol";

// Solidity Contract named SurveyEncrypt inheriting EIP712WithModifier
contract SurveyEncrypt is EIP712WithModifier {
    // Define internal and private state variables
    euint32 internal totalWallet;
    euint32 public zeroValue = TFHE.asEuint32(0);
    address internal contractOwner;
    address[] internal walletAddresses;
    
    // Define mappings to store address and associated values
    mapping(address => mapping(string => euint32)) internal answer;
    mapping(address => bool) internal clientsPayableWallets;
    mapping(address => bool) internal clientsPayableLength;

    // Define a struct to hold address, string, and value
    struct Data {
        address userAddress;
        string cid;
        euint32 value;
    }

    // Define an array to hold the structs
    Data[] internal dataArray;

    // Contract constructor
    constructor() EIP712WithModifier("Authorization token", "1") {
        contractOwner = msg.sender;
    }

    // Function to return map answer based on public key, signature, address, and cid
    function returnMapAnswer(
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

    // Function to add to map based on cid and index
    function addToMap(string memory cid, uint256 _ind) public {
        euint32 ind = TFHE.asEuint32(_ind);
        require(!TFHE.isInitialized(answer[msg.sender][cid]), "The wallet exists in the contract");
        answer[msg.sender][cid] = ind;
        Data memory newData = Data(msg.sender, cid, ind);
        dataArray.push(newData);
    }

    // Function to calculate query answer based on cid and answer
    function calculateQueryAnswer(
        string memory cid,
        uint256 _answerFrom
    ) 
        public 
        payable
    {
        require(msg.value >= 1e15 , "You must send some Ether");
        clientsPayableLength[msg.sender] = true;
        euint32 _answer = TFHE.asEuint32(_answerFrom);
        euint32 countWallet = zeroValue;
        for (uint i = 0; i < dataArray.length; i++) {
            ebool condition = TFHE.eq(dataArray[i].value, _answer);
            euint8 toAdd = TFHE.asEuint8(condition);

            // Compare the cid and value
            if (keccak256(abi.encodePacked(dataArray[i].cid)) == keccak256(abi.encodePacked(cid)) && TFHE.isInitialized(toAdd)) {                
                countWallet = TFHE.add(countWallet, toAdd);
            }
        }
        totalWallet = countWallet;

        // We needed to include division functionality, but it has not yet been implemented in your current library. Therefore we made a workaround by making the count of total wallet addresses public. 
        // return TFHE.divide(count_wallet, dataArray.length);
    }

    // Function to return count answer based on public key and signature
    function returnCountAnswer(
        bytes32 publicKey,
        bytes calldata signature
    )
        public
        view
        onlySignedPublicKey(publicKey, signature)
        authorizeClientsLength(msg.sender)
        returns (bytes memory) 
    {
        return TFHE.reencrypt(totalWallet, publicKey);
    }

    // Function to return length of array
    function returnLengthOfArray() public view authorizeClientsLength(msg.sender) returns (uint256) {
        return dataArray.length;
    }

    // Function to calculate query wallet based on cid and answer
    function calculateQueryWallet(
        string memory cid,
        uint256 _answerFrom
    ) 
        public
        payable
    {
        require(msg.value >= 1e15 , "You must send some Ether");
        clientsPayableWallets[msg.sender] = true;
        euint32 _answer = TFHE.asEuint32(_answerFrom);
        for (uint i = 0; i < dataArray.length; i++) {
            ebool condition = TFHE.eq(dataArray[i].value, _answer);
            euint8 toAdd = TFHE.asEuint8(condition);

            // Compare the cid and value
            if (keccak256(abi.encodePacked(dataArray[i].cid)) == keccak256(abi.encodePacked(cid)) && TFHE.isInitialized(toAdd)) {                
                walletAddresses.push(dataArray[i].userAddress);
            }
        }
    }

    // Function to return wallets
    function returnWallets() public view authorizeClientsWallet(msg.sender) returns (address[] memory) {
        return walletAddresses;
    }

    // Modifier to authorize client's wallet
    modifier authorizeClientsWallet(address _wallet) {
        require(clientsPayableWallets[_wallet], "You did not pay for payable function!");
        _; 
    }

    // Modifier to authorize client's length
    modifier authorizeClientsLength(address _wallet) {
        require(clientsPayableLength[_wallet], "You did not pay for payable function!");
        _; 
    }
}
