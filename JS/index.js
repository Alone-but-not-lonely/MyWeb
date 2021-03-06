'use strict'

const placeholders = document.querySelectorAll('.styled-input__placeholder-text')
const inputs = document.querySelectorAll('.styled-input__input')

placeholders.forEach(function (el, i) {
  let value = el.innerText
  let html = ''
  for (var _iterator = value, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
    var _ref

    if (_isArray) {
      if (_i >= _iterator.length) break
      _ref = _iterator[_i++]
    } else {
      _i = _iterator.next()
      if (_i.done) break
      _ref = _i.value
    }

    const w = _ref

    if (!value) value = '&nbsp;'
    html += '<span class="letter">' + w + '</span>'
  }
  el.innerHTML = html
})

inputs.forEach(function (el) {
  const parent = el.parentNode
  el.addEventListener('focus', function () {
    parent.classList.add('filled')
    placeholderAnimationIn(parent, true)
  }, false)
  el.addEventListener('blur', function () {
    if (el.value.length) return
    parent.classList.remove('filled')
    placeholderAnimationIn(parent, false)
  }, false)
})

function placeholderAnimationIn (parent, action) {
  const act = action ? 'add' : 'remove'
  let letters = parent.querySelectorAll('.letter')
  letters = [].slice.call(letters, 0)
  if (!action) letters = letters.reverse()
  letters.forEach(function (el, i) {
    setTimeout(function () {
      const contains = parent.classList.contains('filled')
      if (action && !contains || !action && contains) return
      el.classList[act]('active')
    }, 50 * i)
  })
}

setTimeout(function () {
  document.body.classList.add('on-start')
}, 100)

setTimeout(function () {
  document.body.classList.add('document-loaded')
}, 1800)

function Close () {
  window.opener = window
  const win = window.open('', '_self')
  win.close()
}
setTimeout('Close()', 60 * 1000) // 1分钟后自动关闭
