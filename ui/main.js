console.log('Loaded!');

var button= document.getElementById("counter");
var counter = 0;
button.onclick = function(){
    var span= document.getElementById("count");
    counter = counter + 1;
    span.innerHTML = counter.toString();
};

/*var element= document.getElementById("main-text");
element.innerHTML="new Value";

var img= document.getElementById("madi");
var marginLeft = 0;
function moveRight(){
    marginLeft = marginLeft + 1;
    img.style.marginLeft = marginLeft+'px';
}
img.onclick = function(){
    var interval = setInterval(moveRight,50);
};*/