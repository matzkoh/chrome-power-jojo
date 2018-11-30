const store = {
  state: {
    enablePageVibration: true,
    enableConcentrationLine: true,
    concentrationLineType: 'images/manga1.svg',
    concentrationLineOpacity: 1,
    effectSize: 10,
    effectOpacity: 1,
    effectDuration: 500,
  },

  async save() {
    return new Promise(resolve => {
      chrome.storage.local.set(store.state, resolve);
    });
  },
};

store.promise = new Promise(resolve => {
  chrome.storage.local.get(store.state, state => {
    store.state = state;
    resolve(state);
  });
});
