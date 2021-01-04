function more () {
  document.getElementById('SHOW_1').style.display = 'none'
  document.getElementById('SHOW_2').style.display = 'inline'
  document.getElementById('SHOW_3').style.display = 'none'
}

function Personal_file () {
  document.getElementById('SHOW_1').style.display = 'none'
  document.getElementById('SHOW_2').style.display = 'none'
  document.getElementById('SHOW_3').style.display = 'inline'
}

function openMenu (obj) {
  menuTitleId = obj.id
  menuId = 'menu' + menuTitleId.substring(10)
  indicatorId = 'indicator' + menuTitleId.substring(10)

  menu = document.getElementById(menuId)
  indicator = document.getElementById(indicatorId)
  height = menu.style.height

  if (height === '0px' || height === '') {
    menu.style.height = '100%'
    indicator.style.transform = 'rotate(180deg)'
  } else {
    menu.style.height = '0px'
    indicator.style.transform = 'rotate(0deg)'
  }
}

function musicShow () {
  if (document.getElementById('bgm_css').style.webkitAnimationPlayState === 'running') {
    document.getElementById('bgm_css').style.webkitAnimationPlayState = 'paused'
    window.child.close()
  } else {
    window.child = window.open('BGM.html', 'BGM', 'height=350,width=350,top=200,left=550,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no')
    document.getElementById('bgm_css').style.webkitAnimationPlayState = 'running'
  }
}
/*
    参数解释：
    window.open 弹出新窗口的命令；
    'page.html' 弹出窗口的文件名；
    'newwindow' 弹出窗口的名字（不是文件名），非必须，可用空''代替；
    height=100 窗口高度；
    width=400 窗口宽度；
    top=0 窗口距离屏幕上方的象素值；
    left=0 窗口距离屏幕左侧的象素值；
    toolbar=no 是否显示工具栏，yes为显示；
    menubar，scrollbars 表示菜单栏和滚动栏。
    resizable=no 是否允许改变窗口大小，yes为允许；
    location=no 是否显示地址栏，yes为允许；
    status=no 是否显示状态栏内的信息（通常是文件已经打开），yes为允许；
*/

function error_Show () {
  document.getElementById('SHOW_1').style.display = 'flex'
  document.getElementById('SHOW_2').style.display = 'none'
  document.getElementById('SHOW_3').style.display = 'none'
  const column = document.getElementsByClassName('column_2')
  let i
  for (i = 0; i < column.length; i++) {
    column[i].style.display = 'none'
  }
  const pro = document.getElementsByClassName('project')
  for (i = 1; i <= pro.length - 1; i++) {
    document.getElementById('project_' + i.toString()).style.display = 'none'
  }
  document.getElementById('project_error').style.display = 'flex'
}

function project_Show (id) {
  document.getElementById('SHOW_1').style.display = 'flex'
  document.getElementById('SHOW_2').style.display = 'none'
  document.getElementById('SHOW_3').style.display = 'none'
  const column = document.getElementsByClassName('column_2')
  let i
  for (i = 0; i < column.length; i++) {
    column[i].style.display = 'none'
  }
  const pro = document.getElementsByClassName('project')
  for (i = 1; i <= pro.length - 1; i++) {
    if (i === id) { document.getElementById('project_' + i.toString()).style.display = 'flex' } else { document.getElementById('project_' + i.toString()).style.display = 'none' }
  }
  document.getElementById('project_error').style.display = 'none'
}

function thumbs_up (obj) {
  if (obj.getAttribute('src', 2) === './CSS/icon/thumbs-up.png') { obj.src = './CSS/icon/after-thumbs-up.png' } else { obj.src = './CSS/icon/thumbs-up.png' }
}

// document.cookie="username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
function OUT () {
  const nickname = getCookie()
  const login = false
  const now = new Date()
  now.setDate(now.getDate() + 0)
  setCookie(nickname, login, now)
  window.parent.location = 'index.html'
}

function setCookie (name, value, expires, path, domain, secure) {
  const curcookie = 'name=' + name +
                    ((expires) ? ';expires=' + expires.toGMTString() : '');
  +((path) ? ';path=' + path : '') +
                    ((domain) ? ';domain=' + domain : '') +
                    ((secure) ? ';secure' : '')
  document.cookie = curcookie
}

function getCookie () {
  if (document.cookie !== null) {
    start = document.cookie.indexOf('name=')
    if (start != -1) {
      start = start + 5
      end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }
    }
    return decodeURI(document.cookie.substring(start, end))
  }
  return ''
}

function loginCheck () {
  const nickname = document.getElementById('nickname').value
  const password = document.getElementById('password').value
  if (nickname === '' || nickname.indexOf(' ') > -1) {
    document.getElementById('nickname').value = ''
    document.getElementById('nickname').placeholder = '                 -不能为空或包含空格！'
  }
  if (password === '' || password.indexOf(' ') > -1) {
    document.getElementById('password').value = ''
    document.getElementById('password').placeholder = '                 -不能为空或包含空格！'
  }
  if (nickname !== '' && password !== '' && nickname.indexOf(' ') < 0 && password.indexOf(' ') < 0) {
    const login = true
    const now = new Date()
    now.setDate(now.getDate() + 1)
    setCookie(nickname, login, now)
    window.location = 'frame.html'
  }
}

function userlogin () {
  const login = getCookie()
  if (login !== null && login !== '') {
    alert('欢迎 "' + login + '" !')
    window.location = 'frame.html'
  }
}

var userName = getCookie();