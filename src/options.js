const form = document.querySelector('#form');

async function storeToForm() {
  await store.promise;

  form.enablePageVibration.checked = store.state.enablePageVibration;
  form.enableConcentrationLine.checked = store.state.enableConcentrationLine;
  form.concentrationLineType.value = store.state.concentrationLineType;
  form.concentrationLineOpacity.value = store.state.concentrationLineOpacity;
  form.effectSize.value = store.state.effectSize;
  form.effectOpacity.value = store.state.effectOpacity;
  form.effectDuration.value = store.state.effectDuration;
}

async function formToStore() {
  await store.promise;

  store.state.enablePageVibration = form.enablePageVibration.checked;
  store.state.enableConcentrationLine = form.enableConcentrationLine.checked;
  store.state.concentrationLineType = form.concentrationLineType.value;
  store.state.concentrationLineOpacity = form.concentrationLineOpacity.value;
  store.state.effectSize = form.effectSize.value;
  store.state.effectOpacity = form.effectOpacity.value;
  store.state.effectDuration = form.effectDuration.value;
}

storeToForm().then(() => {
  form.addEventListener('submit', async event => {
    event.preventDefault();

    await formToStore();
    await store.save();

    window.close();
  });

  document.querySelector('.reset').addEventListener('click', async () => {
    await store.reset();
    await storeToForm();
  });
});
