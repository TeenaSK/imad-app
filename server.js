var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
  user : 'teenakanil',
  database : 'teenakanil',
  host : 'db.imad.hasura-app.io',
  port : '5432',
  password : process.env.DB_PASSWORD
}
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

/*var articleOne =  {
        title:'Article-One',
        heading:'Article One',
        date:'August 5, 2017',
        content:`
            <p>
                Content of first article. Content of first article. Content of first article. Content of first article. Content of first article. Content of first article. Content of first article.
            </p>
            <p>
                Content of first article. Content of first article. Content of first article. Content of first article. Content of first article. Content of first article. Content of first article.
            </p>`
    };
var articles = {
    'article-one': {
        title:'Article-One',
        heading:'Article One',
        date:'August 5, 2017',
        content:`
            <p>
                Content of first article. Content of first article. Content of first article. Content of first article. Content of first article. Content of first article. Content of first article.
            </p>
            <p>
                Content of first article. Content of first article. Content of first article. Content of first article. Content of first article. Content of first article. Content of first article.
            </p>`
    },
    'article-two': {
        title:'Article-Two',
        heading:'Article Two',
        date:'August 10, 2017',
        content:`
            <p>
                Content of second article. Content of second article. Content of second article. Content of second article. Content of second article. Content of second article. Content of second article.
            </p>`
    }
};*/
function createTemplate(data){
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    var htmlTemplate = `
    <html>
        <head>
            <link href="/ui/style.css" rel="stylesheet" />
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
    
        </head>
        <body>
            <div class="container">
                <div>
                    <a href='/'>Home</a>
                </div>
                <br/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date.toDateString()}
                </div>
                <div>
                    ${content}
                </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}
app.get('/hash/:input', function (req, res) {
    var hashedString = hash(req.params.input,'this-is-some-random-string');
    res.send(hashedString);
});
app.post('/create-user', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password,salt);
    pool.query('INSERT INTO "user" (username, password) VALUES ($1,$2)',[username, dbString], function(err,result){
      if(err){
          res.status(500).send(err.toString());
      }else{
          res.send('User successfully created: ' + username);
      }
  })
});
app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('Select * from "user" where username=$1',[username], function(err,result){
      if(err){
          res.status(500).send(err.toString());
      }else{
          if(result.rows.length === 0){
            res.send(403).send('username/password is invalid');
          }else{
                var dbString = result.rows[0].password;
                var salt =   dbString.split('$')[2];
                var hashedPassword = hash(password, salt);
                if(hashedPassword === dbString){
                    req.session.auth = {userId: result.rows[0].id};
                    res.send('Credentials correct');
                }else{
                    res.send(403).send('username/password is invalid');
                }
          }
      }
  })
});
app.get('/check-login', function (req, res) {
    if(req.session && req.session.auth && req.session.auth.userId){
        res.send('U are logged in '+req.session.auth.userId.toString());
    }else{
        res.send('U are not logged in ');
    }
});
app.get('/logout', function (req, res) {
    delete req.session.auth;
    res.send('logged out');
});


var pool = new Pool(config);
app.get('/test-db', function (req, res) {
  pool.query('SELECT * from tag',function(err,result){
      if(err){
          res.status(500).send(err.toString());
      }else{
          res.send(JSON.stringify(result.rows));
      }
  })
});

app.get('/articles/:articleName', function (req, res) {
    //var articleName = req.params.articleName;
    pool.query("SELECT * from article where title=$1",[req.params.articleName],function(err,result){
        if(err){
          res.status(500).send(err.toString());
        }else{
            if(result.rows.length === 0){
                res.status(404).send('Article not found');
            }
            else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
  });
});

/*app.get('/article-one', function (req, res) {
    res.send(createTemplate(articleOne));
}); 
    
app.get('/article-two', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});*/

var counter = 0;
app.get('/counter',function (req, res) {
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var names=[];
app.get('/submit-name', function (req, res) {
    var name = req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
    
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
