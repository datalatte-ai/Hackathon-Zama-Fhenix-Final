import { createInstance, initFhevm } from "fhevmjs";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import Web3 from "web3";
import contractInfo from "@/constants/survey_enc_abi";

const CONTRACT_ADDRESS = "0x187cBa18214b3e792C4da520DB5B52c00D6626Fe";

export const getWallet = async (provider) =>
  provider.request({
    method: "eth_requestAccounts",
  });

export const useFHEVM = () => {
  const store = useStore();

  const instance = ref(null);
  const web3 = ref(null);
  const walletAddress = ref("");
  const publicKey = ref("");

  // onMounted(async () => {});

  const getInstance = async () => {
    if (instance.value) return instance;

    await initFhevm();

    // const provider = new Web3.providers.HttpProvider(
    //   "https://devnet.fhenix.io"
    // );

    // const _web3 = new Web3(provider);
    const _web3 = store.state.web3;
    web3.value = _web3;

    console.log("before wallet");
    const [wallet] = await getWallet(store.state.web3.provider);
    walletAddress.value = wallet;
    console.log("wallet", wallet);

    web3.value.eth.defaultAccount = wallet;

    const chainId = Number(await web3.value.eth.getChainId());
    // const chainId = Number(await store.state.web3.eth.getChainId());

    // const chainId = parseInt(await web3.value.eth.getChainId(), 16);
    // const chainId = parseInt(await store.state.web3.eth.getChainId(), 16);

    console.log("chainId", chainId);

    const provider = new Web3.providers.HttpProvider(
      "https://devnet.fhenix.io"
    );

    const fhweb3 = new Web3(provider);
    const _publicKey = await fhweb3.eth.call({
      to: "0x0000000000000000000000000000000000000044",
    });

    publicKey.value = _publicKey;

    return createInstance({ chainId, publicKey: _publicKey });
  };

  // const addToMap = async (cid, _ind) => {
  //     // Initialize contract with ethers
  //     const contract = new Contract(CONTRACT_ADDRESS, contractInfo, signer);
  //     return transaction;
  // }

  const returnMapAnswer = async () => {
    instance.value = await getInstance();

    // Initialize contract with web3
    const contract = new web3.value.eth.Contract(
      contractInfo,
      CONTRACT_ADDRESS
    );

    // Generate token to decrypt
    const generatedToken = instance.value.generateToken({
      verifyingContract: CONTRACT_ADDRESS,
    });

    // Sign the public key
    // const signature = await web3.value.eth.sign(generatedToken.hash);
    // instance.value.setTokenSignature(CONTRACT_ADDRESS, signature.signature);

    const typedData = {
      domain: generatedToken.token.domain,
      types: { Reencrypt: generatedToken.token.types.Reencrypt }, // Need to remove EIP712Domain from types
      message: generatedToken.token.message,
    };

    // const params = [walletAddress.value, JSON.stringify(generatedToken.token)];
    // const signature = await window.ethereum.request({
    //   method: "eth_signTypedData_v4",
    //   params,
    // });

    // const signature = await web3.value.eth.signTypedData(typedData);

    const signature = await web3.value.provider.request({
      method: "eth_signTypedData_v4",
      // params: [msgParams, walletAddress.value],
      params: [walletAddress.value, JSON.stringify(generatedToken.token)],
      from: walletAddress.value,
    });
    // const signature = await store.state.web3.provider.request({
    //   method: "eth_signTypedData",
    //   params: [typedData, walletAddress.value],
    //   from: walletAddress.value,
    // });
    console.log("after sign", signature);

    instance.value.setTokenSignature(CONTRACT_ADDRESS, signature);

    const cid = "123456781";
    const _ind = "10100";

    const transaction = await contract.methods
      .addtoMap(cid, _ind)
      .send({ from: walletAddress.value, gas: 900000 });

    console.log("addtomap", transaction);

    // Call the method
    const encryptedAnswer = await contract.methods
      .ReturnMapAnswer(
        generatedToken.publicKey,
        signature,
        // Web3.utils.asciiToHex(signature),
        "0xFBeedbC9AaC1D3709002E21271fb1cF2Ade4d3C7",
        "12345678913"
      )
      .call({ from: walletAddress.value });

    console.log("encryptedAnswer", encryptedAnswer);

    // Decrypt the Answer
    const answer = instance.value.decrypt(CONTRACT_ADDRESS, encryptedAnswer);
    console.log("answer", answer);
    return answer;
  };

  return {
    returnMapAnswer,
  };
};
