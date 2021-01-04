const mode = {
  title: userName,
  time: '2020/12/25 11:29:00',
  content: '今天天气很明媚！'
}
const html_my = template('diary', mode)
document.getElementById('talk').innerHTML = html_my
