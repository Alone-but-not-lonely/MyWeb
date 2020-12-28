var mode = {
    title:"四叶花颖",
    time:"2021/12/25 11:29:00",
    content:"今天天气很明媚！"
};
var html_my = template("diary", mode); 
document.getElementById("talk").innerHTML = html_my;