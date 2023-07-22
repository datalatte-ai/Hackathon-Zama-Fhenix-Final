import { createInstance, initFhevm } from "fhevmjs";
import {
  Wallet,
  BrowserProvider,
  Contract,
  JsonRpcProvider,
  ethers,
} from "ethers";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import contractInfo from "../../../survey_enc_abi";

const CONTRACT_ADDRESS = "0x24AC8De7829896b6bfDc2ed1D058DD25bB7Cb506";

const provider = new JsonRpcProvider(`https://devnet.fhenix.io`);

const signer = new Wallet(
  "e715607992ad32638737402adb23c21024db83a424a8050aacdfc8a8481e1bbd",
  provider
);

export const useFHEVM = () => {
  const store = useStore();

  const instance = ref(null);
  const web3 = ref(null);
  const walletAddress = ref("");

  const publicKeyGlobal = ref("");

  // onMounted(async () => {});

  const getInstance = async () => {
    if (instance.value) return instance.value;

    await initFhevm();

    // 1. Get chain id
    const network = await provider.getNetwork();

    const chainId = +network.chainId.toString();

    // Get blockchain public key
    const publicKey = await provider.call({
      from: null,
      to: "0x0000000000000000000000000000000000000044",
    });

    publicKeyGlobal.value = publicKey;

    // Create instance
    instance.value = createInstance({ chainId, publicKey });
    return instance.value;
  };

  const addToMap = async (cid, _ind) => {
    // Initialize contract with ethers
    const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
    const transaction = await contract.addtoMap(cid, _ind);
    return transaction;
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

    const overrides = {
      gasLimit: 900000, // Put your desired gas limit here
      // value: ethers.parseEther("0.0001"), // Put the amount of ether you want to send here
    };

    const cid = "1234656713";
    const _ind = "10111";

    // const transaction = await contract.AddtoMap(cid, _ind, overrides);
    // //   .send({ from: walletAddress.value, gas: 900000 });
    // console.log("addtomap", transaction);

    // const receipt = await provider.waitForTransaction(transaction.hash);

    // console.log("addtomap receipt", receipt);

    // Call the method
    const encryptedAnswer = await contract.ReturnMapAnswer(
      generatedToken.publicKey,
      signature,
      address,
      cid,
      overrides
    );
    console.log("encryptedAnswer", encryptedAnswer);

    // Decrypt the Answer
    const answer = instance.decrypt(CONTRACT_ADDRESS, encryptedAnswer);
    return answer;
  };
  return {
    returnMapAnswer,
  };
};
