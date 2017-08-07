var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

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
    };*/
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
};
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
                    ${date}
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


app.get('/:articleName', function (req, res) {
    var articleName = req.param.articleName;
    res.send(createTemplate(articles[articleName]));
});

/*app.get('/article-one', function (req, res) {
    res.send(createTemplate(articleOne));
}); 
    
app.get('/article-two', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});*/

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
