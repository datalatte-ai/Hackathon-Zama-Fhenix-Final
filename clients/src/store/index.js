import { createStore } from "vuex";

export default createStore({
  state: {
    /**
     * @type {Web3} #provider
     */
    web3: null,
    wallet: null,

    answers: {},
    walletsList: [],
  },
  getters: {},
  mutations: {
    setWeb3(state, { web3 }) {
      state.web3 = web3;
    },
    setWallet(state, { wallet }) {
      state.wallet = wallet;
    },
    setWalletLists(state, { walletsList }) {
      state.walletsList = walletsList;
    },
    setAnswer(state, { CID, answer }) {
      state.answers[CID] = answer;
    },
    setInitAnswers(state, { questions }) {
      questions.forEach((element) => {
        state.answers[element.CID] = 2;
      });
    },
    resetAnswers(state) {
      state.answers = {};
    },
  },
  actions: {},
  modules: {},
});
