const shadowHost = document.createElement('jojo-effect')
const shadowRoot = shadowHost.attachShadow({ mode: 'closed' })

shadowHost.id = 'jojo-effect'

let keys = {}

store.promise.then(() => {
  const isExcluded = store.state.excludeUrls
    .split('\n')
    .map(t => t.trim())
    .filter(Boolean)
    .some(prefix => location.href.startsWith(prefix))

  if (isExcluded) {
    return
  }

  applyOptions()

  chrome.storage.onChanged.addListener(async () => {
    await store.load()
    applyOptions()
  })

  const template = document.createElement('template')
  template.innerHTML = `
    <link rel="stylesheet" href=${chrome.runtime.getURL('shadow.css')}>
    <div class="concentration-line" style="display: none;">
      <div class="concentration-line-cell top-left"></div>
      <div class="concentration-line-cell top-right"></div>
      <div class="concentration-line-cell bottom-left"></div>
      <div class="concentration-line-cell bottom-right"></div>
    </div>
  `
  shadowRoot.appendChild(template.content)

  document.documentElement.appendChild(shadowHost)

  setTimeout(() => {
    shadowRoot.querySelector('.concentration-line').removeAttribute('style')
  }, 0)

  document.addEventListener(
    'keydown',
    event => {
      if (
        !event.isTrusted ||
        event.ctrlKey ||
        event.metaKey ||
        /^(?:F\d+|CapsLock|Escape|Tab)$/.test(event.code) ||
        /^(?:Arrow|Meta|Shift|Alt|Control)/.test(event.code)
      ) {
        return
      }

      setTimeout(setMangaEffectCenter, 0)

      switch (keys[event.code]) {
        case 1:
          keys[event.code] = 2
          break

        case 2:
          break

        default:
          keys[event.code] = 1
          toggleHtmlClass()
          showRandomJojo()
          break
      }
    },
    { capture: true, passive: true },
  )

  document.addEventListener(
    'keyup',
    event => {
      if (!event.isTrusted) {
        return
      }

      delete keys[event.code]
      toggleHtmlClass()
    },
    { capture: true, passive: true },
  )

  window.addEventListener(
    'blur',
    () => {
      keys = {}
    },
    { capture: true, passive: true },
  )
})

function applyOptions() {
  if (store.state.enableConcentrationLine) {
    shadowHost.style.removeProperty('--enableConcentrationLine')
  } else {
    shadowHost.style.setProperty('--enableConcentrationLine', 'none')
  }

  shadowHost.style.setProperty(
    '--concentrationLineType',
    `url(${chrome.runtime.getURL(store.state.concentrationLineType)})`,
  )
  shadowHost.style.setProperty('--concentrationLineOpacity', store.state.concentrationLineOpacity)
  shadowHost.style.setProperty('--effectSize', store.state.effectSize)
  shadowHost.style.setProperty('--effectOpacity', store.state.effectOpacity)
  shadowHost.style.setProperty('--effectDuration', store.state.effectDuration)
}

function toggleHtmlClass() {
  const pressed = Object.values(keys).filter(Boolean).length
  const { classList } = document.documentElement

  classList.toggle('jojo-effect-press', pressed)

  if (store.state.enablePageVibration) {
    classList.toggle('jojo-effect-vibrate', pressed)
  }
}

function setMangaEffectCenter() {
  let width = '50vw'
  let height = '50vh'

  if (document.querySelector(':focus')) {
    let rect
    let useCenter = false
    const sel = document.getSelection()

    if (sel.focusOffset) {
      rect = sel.getRangeAt(sel.rangeCount - 1).getBoundingClientRect()

      if (!rect.top && !rect.bottom) {
        rect = sel.focusNode.getBoundingClientRect()
        useCenter = true
      }
    } else {
      rect =
        sel.focusNode.nodeType === Node.TEXT_NODE
          ? sel.focusNode.parentNode.getBoundingClientRect()
          : sel.focusNode.getBoundingClientRect()
    }

    if (0 <= rect.left && 0 <= rect.top) {
      width = `${useCenter ? (rect.left + rect.right) / 2 : rect.left}px`
      height = `${(rect.top + rect.bottom) / 2}px`
    }
  }

  shadowHost.style.setProperty('--mangaEffectCenterX', width)
  shadowHost.style.setProperty('--mangaEffectCenterY', height)
}

function showRandomJojo() {
  const outer = document.createElement('div')
  outer.className = 'outer enter-active'
  outer.style.left = `${Math.random() * 100}%`
  outer.style.top = `${Math.random() * 100}%`

  const effectType = 'abcdefghijlmnopqrstuvwxyz'[(Math.random() * 25) | 0]
  const html = [`<div class="jojo jojo-${effectType}"></div>`]
  if ('abcdimsuw'.includes(effectType)) {
    html.push('<div class="jojo jojo-k"></div>')
  }
  outer.innerHTML = ['<div class="inner">', ...html, '</div>'].join('')

  shadowRoot.appendChild(outer)

  requestAnimationFrame(() => {
    outer.classList.remove('enter-active')
    outer.addEventListener('transitionend', () => shadowRoot.removeChild(outer), { passive: true })
  })
}
