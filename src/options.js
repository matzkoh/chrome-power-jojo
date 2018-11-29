function $(selector) {
  return document.querySelector(selector);
}

store.promise.then(state => {
  $('#enablePageVibration').checked = state.enablePageVibration;
  $('#enableConcentrationLine').checked = state.enableConcentrationLine;
  $('#concentrationOpacity').value = state.concentrationOpacity;
  $('#effectSize').value = state.effectSize;
  $('#effectOpacity').value = state.effectOpacity;
  $('#effectDuration').value = state.effectDuration;
});

$('#form').addEventListener('submit', async event => {
  event.preventDefault();

  store.state.enablePageVibration = $('#enablePageVibration').checked;
  store.state.enableConcentrationLine = $('#enableConcentrationLine').checked;
  store.state.concentrationOpacity = $('#concentrationOpacity').value;
  store.state.effectSize = $('#effectSize').value;
  store.state.effectOpacity = $('#effectOpacity').value;
  store.state.effectDuration = $('#effectDuration').value;

  await store.save();
  window.close();
});
