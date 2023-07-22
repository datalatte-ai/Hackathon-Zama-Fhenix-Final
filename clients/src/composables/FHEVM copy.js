import { createInstance, initFhevm } from "fhevmjs/web";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import Web3 from "web3";
import contractInfo from "@/constants/survey_enc_abi";

const CONTRACT_ADDRESS = "0x22678c3B5F5D2FFB0f003EC4e73b4ccC2FDDBFC4";

export const getWallet = async (provider) =>
  provider.request({
    method: "eth_requestAccounts",
  });

export const useFHEVM = () => {
  const store = useStore();

  const instance = ref(null);
  const web3 = ref(null);
  const walletAddress = ref("");

  // onMounted(async () => {});

  const getInstance = async () => {
    if (instance.value) return instance;

    await initFhevm();

    const provider = new Web3.providers.HttpProvider(
      "https://devnet.fhenix.io"
    );

    const _web3 = new Web3(provider);
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

    const publicKey = await web3.value.eth.call({
      to: "0x0000000000000000000000000000000000000044",
    });

    return createInstance({ chainId, publicKey });
  };

  const returnMapAnswer = async () => {
    instance.value = await getInstance();

    console.log("instance.value", instance.value);
    // Initialize contract with web3
    const contract = new web3.value.eth.Contract(
      contractInfo,
      CONTRACT_ADDRESS
    );

    console.log("after contract");

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
      // const signature = await store.state.web3.provider.request({
      method: "eth_signTypedData_v4",
      // params: [msgParams, walletAddress.value],
      params: [walletAddress.value, JSON.stringify(generatedToken.token)],
      // from: walletAddress.value,
    });
    // const signature = await store.state.web3.provider.request({
    //   method: "eth_signTypedData",
    //   params: [typedData, walletAddress.value],
    //   from: walletAddress.value,
    // });
    console.log("after sign", signature);

    instance.value.methods
      .setTokenSignature(CONTRACT_ADDRESS, signature)
      .send({ from: walletAddress.value });

    // Call the method
    const encryptedAnswer = await contract.methods
      .ReturnMapAnswer(
        generatedToken.publicKey,
        signature.signature,
        "0xFBeedbC9AaC1D3709002E21271fb1cF2Ade4d3C7",
        "12345678913"
      )
      .call();

    // Decrypt the Answer
    const answer = instance.value.decrypt(CONTRACT_ADDRESS, encryptedAnswer);
    return answer;
  };

  return {
    returnMapAnswer,
  };
};
