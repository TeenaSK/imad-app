console.log('Loaded!');

var button= document.getElementById("counter");
//var counter = 0;
button.onclick = function(){
    //create request variable
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                var counter = request.responseText;
                var span= document.getElementById("count");
                span.innerHTML = counter.toString();
            }
        }
        
    }
    
    request.open('GET','http://teenakanil.imad.hasura-app.io/counter',true);
    request.send(null);
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