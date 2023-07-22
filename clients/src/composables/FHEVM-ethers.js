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
import contractInfo from "@/constants/survey_enc_abi";

const CONTRACT_ADDRESS = "0x24AC8De7829896b6bfDc2ed1D058DD25bB7Cb506";

const provider = new BrowserProvider(window.ethereum);

export const getWallet = async (provider) =>
  provider.request({
    method: "eth_requestAccounts",
  });

export const useFHEVM = () => {
  const store = useStore();

  const instance = ref(null);
  const walletAddress = ref("");

  const publicKeyGlobal = ref("");

  let signer;

  const getInstance = async () => {
    if (instance.value) return instance.value;

    await initFhevm();

    signer = await provider.getSigner();

    const wallet = await signer.getAddress();
    walletAddress.value = wallet;

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

  const addToMap = async (cid, answer) => {
    // Initialize contract with ethers
    signer = await provider.getSigner();

    const overrides = {
      gasLimit: 900000,
    };
    const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
    const transaction = await contract.addToMap(cid, answer, overrides);
    const receipt = await transaction.wait();
    return receipt;
  };

  const getSignature = async () => {
    signer = await provider.getSigner();
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

    return { signature, generatedToken };
  };

  const returnMapAnswer = async (CID) => {
    signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);

    const instance = await getInstance();

    const { generatedToken, signature } = await getSignature();

    const overrides = {
      gasLimit: 900000,
      value: ethers.parseEther("0.0001"),
    };

    const address = await signer.getAddress();
    // Call the method
    const encryptedAnswer = await contract.ReturnMapAnswer(
      generatedToken.publicKey,
      signature,
      address,
      CID,
      overrides
    );

    // Decrypt the Answer
    const answer = instance.decrypt(CONTRACT_ADDRESS, encryptedAnswer);
    return answer;
  };

  const returnAns = async () => {
    signer = await provider.getSigner();

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
    const encryptedAnswer = await contract.returnCountAnswer(
      generatedToken.publicKey,
      signature
    );

    const answer = instance.decrypt(CONTRACT_ADDRESS, encryptedAnswer);
    return answer;
  };

  const returnLengthOfArray = async () => {
    signer = await provider.getSigner();

    // Initialize contract with ethers
    const overrides = {
      gasLimit: 1000000,
      value: ethers.parseEther("1.0"),
    };
    const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
    const transaction = await contract.returnLengthOfArray(overrides);
    return transaction;
  };

  const calculateQueryAnswer = async (CID, asnwer, value = "0.001") => {
    signer = await provider.getSigner();

    // Initialize contract with ethers
    const overrides = {
      gasLimit: 1000000,
      value: ethers.parseEther(value),
    };
    const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
    const transaction = await contract.calculateQueryAnswer(
      CID,
      asnwer,
      overrides
    );
    const receipt = await transaction.wait();
    return receipt;
  };

  const calculateQueryWallet = async (CID, asnwer, value = "0.001") => {
    signer = await provider.getSigner();

    const overrides = {
      gasLimit: 10000000,
      value: ethers.parseEther(value),
    };
    const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
    const transaction = await contract.calculateQueryWallet(
      CID,
      asnwer,
      overrides
    );
    const receipt = await transaction.wait();
    return receipt;
  };

  const returnWallets = async (value = "0.001") => {
    signer = await provider.getSigner();

    // const overrides = {
    //   gasLimit: 1000000,
    // };
    const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
    // const transaction = await contract.returnWallets(overrides);
    const transaction = await contract.returnWallets();
    return transaction;
  };

  const returnCountAnswer = async () => {
    signer = await provider.getSigner();

    const { signature, generatedToken } = await getSignature();

    // Initialize contract with ethers
    const overrides = {
      gasLimit: 1000000,
      value: ethers.parseEther("0.001"),
    };
    const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
    const transaction = await contract.returnCountAnswer(
      generatedToken.publicKey,
      signature,
      overrides
    );
    const receipt = await transaction.wait();
    return receipt;
  };

  return {
    addToMap,
    returnMapAnswer,
    returnAns,
    returnLengthOfArray,
    calculateQueryAnswer,
    calculateQueryWallet,
    returnWallets,
    returnCountAnswer,
  };
};
