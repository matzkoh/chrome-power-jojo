const activeKeys = new Set()

const shadowHost = document.createElement('jojo-effect')
shadowHost.id = 'jojo-effect'

const shadowRoot = shadowHost.attachShadow({ mode: 'closed' })
shadowRoot.innerHTML = `
  <link
    rel="stylesheet"
    href="${chrome.runtime.getURL('content/shadow.css')}"
    onload="nextElementSibling.removeAttribute('style')"
  />
  <div class="concentration-line" style="display: none;">
    <div class="concentration-line-cell top-left"></div>
    <div class="concentration-line-cell top-right"></div>
    <div class="concentration-line-cell bottom-left"></div>
    <div class="concentration-line-cell bottom-right"></div>
  </div>
  <div class="jojo-container"></div>
`

const jojoContainer = shadowRoot.querySelector('.jojo-container')
jojoContainer.addEventListener('transitionend', event => event.target.remove(), { passive: true })

store.promise.then(() => {
  const isExcluded = store.state.excludeUrls
    .split('\n')
    .map(t => t.trim())
    .filter(Boolean)
    .some(prefix => location.href.startsWith(prefix))

  if (!isExcluded) {
    init()
  }
})

function init() {
  applyOptions()

  chrome.storage.onChanged.addListener(async () => {
    await store.load()
    applyOptions()
  })

  document.documentElement.append(shadowHost)

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

      requestAnimationFrame(setMangaEffectCenter)

      if (!activeKeys.has(event.code)) {
        activeKeys.add(event.code)
        toggleHtmlClass()
        showRandomJojo()
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

      // escape hatch
      if (event.code === 'Enter') {
        activeKeys.clear()
      } else {
        activeKeys.delete(event.code)
      }

      toggleHtmlClass()
    },
    { capture: true, passive: true },
  )

  window.addEventListener('blur', () => activeKeys.clear(), { capture: true, passive: true })
}

function applyOptions() {
  if (store.state.enableConcentrationLine) {
    shadowHost.style.removeProperty('--enableConcentrationLine')
  } else {
    shadowHost.style.setProperty('--enableConcentrationLine', 'none')
  }

  shadowHost.style.setProperty('--concentrationLineOpacity', store.state.concentrationLineOpacity)
  shadowHost.style.setProperty('--effectSize', store.state.effectSize)
  shadowHost.style.setProperty('--effectOpacity', store.state.effectOpacity)
  shadowHost.style.setProperty('--effectDuration', store.state.effectDuration)
  shadowHost.style.setProperty(
    '--concentrationLineType',
    `url(${chrome.runtime.getURL(store.state.concentrationLineType)})`,
  )
}

function toggleHtmlClass() {
  const pressed = !!activeKeys.size
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
  outer.classList.add('outer', 'enter-active')
  outer.style.left = `${Math.random() * 100}%`
  outer.style.top = `${Math.random() * 100}%`

  const a2z = 'abcdefghijlmnopqrstuvwxyz'
  const exc = 'abcdimsuw'
  const kind = a2z[(Math.random() * a2z.length) | 0]

  outer.innerHTML = [
    '<div class="inner">',
    `<div class="jojo jojo-${kind}"></div>`,
    exc.includes(kind) && '<div class="jojo jojo-k"></div>',
    '</div>',
  ]
    .filter(Boolean)
    .join('')

  jojoContainer.append(outer)

  requestAnimationFrame(() => {
    outer.classList.remove('enter-active')
  })
}
