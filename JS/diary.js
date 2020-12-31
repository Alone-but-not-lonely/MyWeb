function concel (obj) {
  const table = obj.parentNode.parentNode.parentNode
  const tr = obj.parentNode.parentNode
  if (tr.nextElementSibling) {
    table.removeChild(tr.nextElementSibling)
  }
  table.removeChild(tr)
  const num = document.getElementsByClassName('dairy').length
  const talk_num = document.getElementsByClassName('talk_num')
  for (let i = 0; i < talk_num.length; i++) { talk_num[i].innerHTML = num }
}
function certain (obj) {
  const tr = obj.parentNode
  tr.removeChild(obj)
  const leaveMess = tr.lastChild
  leaveMess.style.border = 'none'
  leaveMess.setAttribute('disabled', 'disabled')
}
function Leave_Message (obj) {
  const tr = obj.parentNode.parentNode
  const leaveMess = tr.lastChild
  leaveMess.removeAttribute('disabled')
  leaveMess.style.border = 'black 1px solid'
  const button = document.createElement('button')
  const value = document.createTextNode('确定')
  button.setAttribute('class', 'css_button')
  button.addEventListener('click', function () { certain(this) }, false)
  button.appendChild(value)
  tr.appendChild(button)
}
function getTime () {
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = (now.getMonth() + 1).toString()
  const day = now.getDate().toString()
  const h = now.getHours().toString()
  const m = now.getMinutes().toString()
  const s = now.getSeconds().toString()
  const time = year.padStart(4, '0') + '/' + month.padStart(2, '0') + '/' + day.padStart(2, '0') + ' ' + h.padStart(2, '0') + ':' + m.padStart(2, '0') + ':' + s.padStart(2, '0')
  return time
}
