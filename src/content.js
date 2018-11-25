let keys = {};

function toggleHtmlClass() {
  document.documentElement.classList.toggle('jojo-effect-press', Object.values(keys).filter(Boolean).length);
}

const el = document.createElement('jojo-effect');
el.id = 'jojo-effect';
const shadowRoot = el.attachShadow({ mode: 'closed' });
shadowRoot.innerHTML = `<link rel="stylesheet" href="${chrome.runtime.getURL('shadow.css')}">`;
document.documentElement.appendChild(el);

function showRandomJojo() {
  const outer = document.createElement('div');
  outer.className = 'outer enter-active';

  const name = 'abcdefghijlmnopqrstuvwxyz'[(Math.random() * 25) | 0];
  const html = [`<div class="jojo jojo-${name}"></div>`];
  if ('abcdimsuw'.includes(name)) {
    html.push('<div class="jojo jojo-k"></div>');
  }
  outer.innerHTML = html.join('');
  const rect = el.getBoundingClientRect();
  outer.style.left = `${Math.random() * rect.width}px`;
  outer.style.top = `${Math.random() * rect.height}px`;

  shadowRoot.appendChild(outer);
  requestAnimationFrame(() => outer.classList.remove('enter-active'));
  outer.addEventListener('transitionend', () => shadowRoot.removeChild(outer));
}

document.addEventListener('keydown', event => {
  if (
    event.ctrlKey ||
    event.metaKey ||
    /^(?:F\d+|CapsLock|Escape|Tab)$/.test(event.code) ||
    /^(?:Arrow|Meta|Shift|Alt|Control)/.test(event.code)
  ) {
    return;
  }

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
  delete keys[event.code];
  toggleHtmlClass();
});

window.addEventListener('blur', () => {
  keys = {};
});
