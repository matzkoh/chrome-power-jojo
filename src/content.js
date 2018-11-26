let keys = {};

const el = document.createElement('jojo-effect');
el.id = 'jojo-effect';
const shadowRoot = el.attachShadow({ mode: 'closed' });
shadowRoot.innerHTML = `
  <link rel="stylesheet" href="${chrome.runtime.getURL('shadow.css')}">
  <div class="manga-effect">
    <div class="manga-effect-cell top-left"></div>
    <div class="manga-effect-cell top-right"></div>
    <div class="manga-effect-cell bottom-left"></div>
    <div class="manga-effect-cell bottom-right"></div>
  </div>
`;
const mangaEffectCell = shadowRoot.querySelector('.top-left');
document.documentElement.appendChild(el);

function toggleHtmlClass() {
  document.documentElement.classList.toggle('jojo-effect-press', Object.values(keys).filter(Boolean).length);
}

function setMangaEffectCenter() {
  let width = '50vw';
  let height = '50vh';

  if (document.querySelector(':focus')) {
    let rect;
    let useCenter = false;
    const sel = document.getSelection();

    if (sel.focusOffset) {
      rect = sel.getRangeAt(sel.rangeCount - 1).getBoundingClientRect();

      if (!rect.top && !rect.bottom) {
        rect = sel.focusNode.getBoundingClientRect();
        useCenter = true;
      }
    } else {
      rect =
        sel.focusNode.nodeType === Node.TEXT_NODE
          ? sel.focusNode.parentNode.getBoundingClientRect()
          : sel.focusNode.getBoundingClientRect();
    }

    if (0 <= rect.left && 0 <= rect.top) {
      width = `${useCenter ? (rect.left + rect.right) / 2 : rect.left}px`;
      height = `${(rect.top + rect.bottom) / 2}px`;
    }
  }

  mangaEffectCell.style.width = width;
  mangaEffectCell.style.height = height;
}

function showRandomJojo() {
  const rect = el.getBoundingClientRect();
  const outer = document.createElement('div');
  outer.className = 'outer enter-active';
  outer.style.left = `${Math.random() * rect.width}px`;
  outer.style.top = `${Math.random() * rect.height}px`;

  const name = 'abcdefghijlmnopqrstuvwxyz'[(Math.random() * 25) | 0];
  const html = [`<div class="jojo jojo-${name}"></div>`];
  if ('abcdimsuw'.includes(name)) {
    html.push('<div class="jojo jojo-k"></div>');
  }
  outer.innerHTML = ['<div class="inner">', ...html, '</div>'].join('');

  shadowRoot.appendChild(outer);
  requestAnimationFrame(() => outer.classList.remove('enter-active'));
  outer.addEventListener('transitionend', () => shadowRoot.removeChild(outer));
}

document.addEventListener('keydown', event => {
  if (
    !event.isTrusted ||
    event.ctrlKey ||
    event.metaKey ||
    /^(?:F\d+|CapsLock|Escape|Tab)$/.test(event.code) ||
    /^(?:Arrow|Meta|Shift|Alt|Control)/.test(event.code)
  ) {
    return;
  }

  setTimeout(setMangaEffectCenter, 0);

  switch (keys[event.code]) {
    case 1:
      keys[event.code] = 2;
      break;

    case 2:
      break;

    default:
      keys[event.code] = 1;
      toggleHtmlClass();
      showRandomJojo();
      break;
  }
});

document.addEventListener('keyup', event => {
  if (!event.isTrusted) {
    return;
  }

  delete keys[event.code];
  toggleHtmlClass();
});

window.addEventListener('blur', () => {
  keys = {};
});
