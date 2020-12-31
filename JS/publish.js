function add () {
  const text = document.getElementById('descript').value
  if (text !== '') {
    const table = document.getElementById('talk_list')
    const tr = document.createElement('tr')
    tr.setAttribute('class', 'talk')
    const td = document.createElement('td')
    td.setAttribute('class', 'dairy')

    const kong = document.createTextNode('   ')
    const span_tt = document.createElement('span') // 标题
    span_tt.setAttribute('class', 'title')
    const span_tm = document.createElement('span') // 时间
    span_tm.setAttribute('class', 'time')
    const span_ic_1 = document.createElement('span') // X图标
    span_ic_1.setAttribute('class', 'icon-uniE900')
    span_ic_1.addEventListener('click', function () { concel(this) }, false)
    const span_ic_2 = document.createElement('span') // 留言图标
    span_ic_2.setAttribute('class', 'icon-uniE9001')
    span_ic_2.addEventListener('click', function () { Leave_Message(this) }, false)
    const p_con = document.createElement('p')
    p_con.setAttribute('class', 'talk_con')
    const input_com = document.createElement('input') // 留言框
    input_com.setAttribute('id', 'leaveMess')
    input_com.setAttribute('disabled', 'disabled')
    const hr = document.createElement('hr')
    const a = document.createElement('a')
    const span_title = document.createTextNode(userName)
    const now = getTime()
    const span_time = document.createTextNode(now)
    const section = document.createTextNode(text)

    span_tt.appendChild(span_title)
    span_tm.appendChild(span_time)
    p_con.appendChild(section)
    input_com.value = ''
    input_com.placeholder = '留下你的感受吧'
    a.appendChild(span_ic_2)
    td.appendChild(span_tt)
    td.appendChild(span_tm)
    td.appendChild(span_ic_1)
    td.appendChild(p_con)
    td.appendChild(a)
    td.appendChild(hr)
    td.appendChild(input_com)
    tr.appendChild(td)
    table.insertBefore(tr, table.firstChild)

    const tr_hr = document.createElement('tr')
    const td_hr = document.createElement('td')
    td_hr.setAttribute('style', 'height:10px')
    td_hr.appendChild(kong)
    tr_hr.appendChild(td_hr)
    table.insertBefore(tr_hr, tr.nextSibling)
    document.getElementById('descript').value = null
    const num = document.getElementsByClassName('dairy').length
    const talk_num = document.getElementsByClassName('talk_num')
    for (let i = 0; i < talk_num.length; i++) { talk_num[i].innerHTML = num }
  }
}
