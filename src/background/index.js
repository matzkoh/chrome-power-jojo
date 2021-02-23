chrome.runtime.onInstalled.addListener(details => {
  switch (details.previousVersion) {
    case '1.1.0': {
      store.state.concentrationLineType = store.state.concentrationLineType.replace('images/', '../assets/image/')
      store.save()
      break
    }
  }
})
