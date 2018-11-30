function $(selector) {
  return document.querySelector(selector);
}

const form = $('#form');

store.promise.then(state => {
  form.enablePageVibration.checked = state.enablePageVibration;
  form.enableConcentrationLine.checked = state.enableConcentrationLine;
  form.concentrationLineType.value = state.concentrationLineType;
  form.concentrationLineOpacity.value = state.concentrationLineOpacity;
  form.effectSize.value = state.effectSize;
  form.effectOpacity.value = state.effectOpacity;
  form.effectDuration.value = state.effectDuration;
});

form.addEventListener('submit', async event => {
  event.preventDefault();

  store.state.enablePageVibration = form.enablePageVibration.checked;
  store.state.enableConcentrationLine = form.enableConcentrationLine.checked;
  store.state.concentrationLineType = form.concentrationLineType.value;
  store.state.concentrationLineOpacity = form.concentrationLineOpacity.value;
  store.state.effectSize = form.effectSize.value;
  store.state.effectOpacity = form.effectOpacity.value;
  store.state.effectDuration = form.effectDuration.value;

  await store.save();
  window.close();
});
