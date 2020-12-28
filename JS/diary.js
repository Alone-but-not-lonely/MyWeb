function concel(obj) {
    var table = obj.parentNode.parentNode.parentNode;
    var tr = obj.parentNode.parentNode;
    if(tr.nextElementSibling) {
        table.removeChild(tr.nextElementSibling);
    }
    table.removeChild(tr);
    var num = document.getElementsByClassName("dairy").length;
    var talk_num = document.getElementsByClassName("talk_num");
    for(var i=0; i<talk_num.length; i++)
        talk_num[i].innerHTML = num;
}
function certain(obj) {
    var tr = obj.parentNode;
    tr.removeChild(obj);
    var leaveMess = tr.lastChild;
    leaveMess.style.border = "none";
    leaveMess.setAttribute("disabled","disabled");
}
function Leave_Message(obj) {
    var tr = obj.parentNode.parentNode;
    var leaveMess = tr.lastChild;
    leaveMess.removeAttribute("disabled");
    leaveMess.style.border = "black 1px solid";
    var button = document.createElement("button");
    var value = document.createTextNode("确定");
    button.setAttribute("class","css_button");
    button.addEventListener('click',function () {certain(this)},false);
    button.appendChild(value);
    tr.appendChild(button);
}
function getTime() {
    var now = new Date();
    var year = now.getFullYear().toString();
    var month = (now.getMonth()+1).toString();
    var day = now.getDate().toString();
    var h = now.getHours().toString();
    var m = now.getMinutes().toString();
    var s = now.getSeconds().toString();
    var time = year.padStart(4,"0")+"/"+month.padStart(2,"0")+"/"+day.padStart(2,"0")+" "+h.padStart(2,"0")+":"+m.padStart(2,"0")+":"+s.padStart(2,"0");
    return time;
}

