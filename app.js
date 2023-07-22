const { createInstance } = require('fhevmjs');
const { Wallet, JsonRpcProvider, Contract, ethers } = require('ethers');
require('dotenv').config();
const contractInfo = require('./survey_enc_abi.js');

const CONTRACT_ADDRESS = '0xEB204A0638bAC08489063B5DcCA656Ab5f7c3610';

const provider = new JsonRpcProvider(`https://devnet.fhenix.io`);

const signer = new Wallet(process.env.PRIVATE_KEY_wallet2, provider);

let _instance;

const getInstance = async () => {
  if (_instance) return _instance;


  const network = await provider.getNetwork();

  const chainId = +network.chainId.toString();

  const publicKey = await provider.call({ to: '0x0000000000000000000000000000000000000044' });

  _instance = createInstance({ chainId, publicKey });
  return _instance;
};

const returnMapAnswer = async () => {
    const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
  
    const instance = await getInstance();
  
    const generatedToken = instance.generateToken({
      verifyingContract: CONTRACT_ADDRESS,
    });
  
    const signature = await signer.signTypedData(
      generatedToken.token.domain,
      { Reencrypt: generatedToken.token.types.Reencrypt }, // Need to remove EIP712Domain from types
      generatedToken.token.message
    );
    instance.setTokenSignature(CONTRACT_ADDRESS, signature);
  
    const encryptedAnswer = await contract.ReturnMapAnswer(generatedToken.publicKey, signature, "0xFBeedbC9AaC1D3709002E21271fb1cF2Ade4d3C7", "123456789");

    const answer = instance.decrypt(CONTRACT_ADDRESS, encryptedAnswer);
    return answer;
  };

// returnMapAnswer().then((answer) => {
//     console.log(answer);
// });


const returnAns = async () => {
  const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);

  const instance = await getInstance();

  const generatedToken = instance.generateToken({
    verifyingContract: CONTRACT_ADDRESS,
  });

  const signature = await signer.signTypedData(
    generatedToken.token.domain,
    { Reencrypt: generatedToken.token.types.Reencrypt }, // Need to remove EIP712Domain from types
    generatedToken.token.message
  );
  instance.setTokenSignature(CONTRACT_ADDRESS, signature);
  const encryptedAnswer = await contract.ReturnCountAnswer(generatedToken.publicKey, signature);

  const answer = instance.decrypt(CONTRACT_ADDRESS, encryptedAnswer);
  return answer;
};

// returnAns().then((answer) => {
//   console.log(answer);
// });

// const addToMap = async (cid, _ind) => {
//     // Initialize contract with ethers
//     const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
//     const transaction = await contract.addtoMap(cid, _ind);
//     return transaction;
// }

// async function log_add() {
//     const ls = await addToMap("123456789", '10100');
//     return console.log(ls);
// }
// log_add()


// const returnLengthOfArray = async () => {
//     // Initialize contract with ethers
//     const overrides = {
//       gasLimit: 1000000, // Put your desired gas limit here
//       value: ethers.parseEther("1.0") // Put the amount of ether you want to send here
//     };
//     const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
//     const transaction = await contract.returnLengthOfArray(overrides);
//     return transaction;
// }

// async function log_add() {
//     const ls = await returnLengthOfArray();
//     return console.log(ls);
// }
// log_add()

const returnAnswer = async () => {
      const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
      const transaction = await contract.returnWallets();
      return transaction;
  }
  
  async function log_add() {
      const ls = await returnAnswer();
      return console.log(ls);
  }
  log_add()
