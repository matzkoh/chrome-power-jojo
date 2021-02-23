const defaultState = {
  enablePageVibration: true,
  enableConcentrationLine: true,
  concentrationLineType: 'assets/image/manga1.svg',
  concentrationLineOpacity: 0.2,
  effectSize: 10,
  effectOpacity: 1,
  effectDuration: 500,
  excludeUrls: '',
}

const store = {
  state: null,
  promise: null,

  async load() {
    this.promise = new Promise(resolve => {
      chrome.storage.local.get(defaultState, state => {
        this.state = state
        resolve()
      })
    })
    return this.promise
  },

  async save() {
    await this.promise
    return new Promise(resolve => {
      chrome.storage.local.set(this.state, resolve)
    })
  },

  async reset() {
    await this.promise
    this.state = Object.create(defaultState)
  },
}

store.load()
