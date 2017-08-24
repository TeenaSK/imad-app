console.log('Loaded!');

/*var button = document.getElementById("counter");
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
        
    };
    request.open('GET','http://teenakanil.imad.hasura-app.io/counter',true);
    request.send(null);
};*/


var submit = document.getElementById("submit_btn");
submit.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                alert('loggedin successfully');
                
                /*//var names = ['name1','name2','name3','name4'];
                var names = request.responseText;
                names = JSON.parse(names);
                var list = '';
                for(var i=0;i<names.length;i++){
                    list = list +'<li>'+names[i]+'</li>';
                }
                var ul = document.getElementById("nameList");
                ul.innerHTML = list;*/
            }else if(request.status === 403){
                alert('Username/password is incorrect');
            }else if(request.status === 500){
                alert('Something went wrong in server');
            }
        }
    };
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log(username);
    console.log(password);
    request.open('POST','http://teenakanil.imad.hasura-app.io/login',true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({username:username, password:password}));
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